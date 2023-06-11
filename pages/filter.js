import React, {Component} from 'react';
import {View, TouchableOpacity, ScrollView, Text} from 'react-native';
import DropdownLabel from '../components/elements/dropdownLabel';
import Checkbox from '../components/form/checkbox';

export default class FilterPage extends Component {
  // Компонент, фильтр списка учеников/групп
  // props.route.params:
  // - предыдущие значения фильтра -- currentFilter: object
  // - список id's выпадающих списков, которые остались открытыми -- showLabels: array
  // - предыдущая страница -- pageBack: string
  // ----------------------------
  // выходные props.route.params:
  // - выбранные значения -- listChecked: object
  // - список id's открытых выпадающих списков -- showLabels: array

  constructor(props) {
    super(props);
    const params = {...this.props.route.params};

    this.state = {
      listChecked: params.currentFilter,
      data: {},
      showLabels: [...params.showLabels],
      pageBack: params.pageBack,
    };

    // запрос данных для фильтрации
    // для групп, categories убрать where
    db.transaction(tx => {
      tx.executeSql(
        `SELECT id, name as label FROM Categories WHERE id > 0`,
        [],
        (_, {rows}) => {
          this.state.data = {
            ...this.state.data,
            ['Возрастная группа']: rows.raw(),
          };
        },
        (_, err) => console.log('error getData (Categories) - ', err),
      );
      tx.executeSql(
        `SELECT id, name as label FROM Templates`,
        [],
        (_, {rows}) => {
          this.state.data = {...this.state.data, ['Шаблон']: rows.raw()};
        },
        (_, err) => console.log('error getData (Templates) - ', err),
      );
      tx.executeSql(
        `
        SELECT MIN(id) as id, name as label
        FROM Diagnosis
        GROUP BY label
        ORDER BY id
        `,
        [],
        (_, {rows}) => {
          this.state.data = {
            ...this.state.data,
            ['Заключение ЦПМПК']: rows.raw(),
          };
          this.forceUpdate();
        },
        (_, err) => console.log('error getData (Diagnosis) - ', err),
      );
    });
  }

  selectVal(label, val) {
    let currentList = this.state.listChecked[label];
    let indexVal = currentList.indexOf(val);

    if (indexVal >= 0) {
      currentList.splice(indexVal, 1);
    } else {
      currentList.push(val);
    }

    // не через setState - т.к. происходит ререндер
    // изменение состояние объекта происходит на прямую
    this.state.listChecked[label] = currentList;
  }

  labelAction(val) {
    let currentList = [...this.state.showLabels];
    let indexVal = currentList.indexOf(val);

    if (indexVal >= 0) {
      currentList.splice(indexVal, 1);
    } else {
      currentList.push(val);
    }

    // не через setState - т.к. происходит ререндер
    // изменение состояние объекта происходит на прямую
    this.state.showLabels = currentList;
  }

  render() {
    return (
      <>
        <View style={Styles.seqLineHeader}></View>
        <View style={{...Styles.container, backgroundColor: '#fff'}}>
          <ScrollView contentContainerStyle={{gap: 15}}>
            {Object.keys(this.state.data).map((label, index) => (
              <DropdownLabel
                key={index}
                id={index}
                label={label}
                data={this.state.data[label]}
                show={this.state.showLabels.includes(index)}
                editing={true}
                setCheck={() => this.labelAction(index)}>
                <Checkbox
                  onCallBack={val => this.selectVal(label, val)}
                  isSelected={val =>
                    this.state.listChecked[label].includes(val)
                  }
                />
              </DropdownLabel>
            ))}
            <View style={Styles.crutch}></View>
          </ScrollView>
          <View style={Styles.filterButtons}>
            <TouchableOpacity
              style={Styles.buttonRed}
              onPress={() => {
                this.setState({
                  listChecked: {
                    'Возрастная группа': [],
                    Шаблон: [],
                    'Заключение ЦПМПК': [],
                  },
                });
              }}>
              <Text style={Styles.buttonRedText}>Сбросить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.submitBtn}
              onPress={() => {
                this.props.navigation.navigate(this.state.pageBack, {
                  listChecked: this.state.listChecked,
                  showLabels: this.state.showLabels,
                });
              }}>
              <Text style={Styles.submitBtnText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}
