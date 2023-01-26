import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import AddingButton from '../components/elements/buttonAdd';
import EmptyData from '../components/emptyDataList';
import LargeCard from '../components/elements/LargeCardList';
import MenuActions from '../components/elements/menuActions';

export default class ListStudentsWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {dataStudents: [], selected: [], onHold: false, holdIdCard: 0};
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => this.getData());
    this.props.navigation.addListener('blur', () => {
      this.setState({selected: [], onHold: false, holdIdCard: 0});
    });
  }

  // выбор карточек
  selectCard(id = this.state.holdIdCard) {
    let selectedArr = [...this.state.selected];

    if (selectedArr.includes(id)) {
      selectedArr.splice(selectedArr.indexOf(id), 1);
    } else {
      selectedArr.push(id);
    }

    this.setState({selected: [...selectedArr]});
    this.setState({holdIdCard: 0});
  }

  // удаление пользователя с подтверждением
  deleteUser() {
    const currentList = [...this.state.selected];
    const holdId = this.state.holdIdCard;
    if (holdId != 0 && !this.state.selected.includes(holdId)) {
      currentList.push(holdId);
    }
    let message = '';
    if (currentList.length == 1) {
      let name = this.state.dataStudents.find(
        obj => obj.ID === currentList[0],
      ).LeftTop;
      message = `Вы действительно хотите удалить карточку ${name} ?\nЭто также удалит связанные с ней записи в расписании.`;
    } else {
      message = `Вы действительно хотите удалить карточки в количестве ${currentList.length} штук?\nЭто также удалит связанные с ними записи в расписании.`;
    }
    let confirmDelete = new Promise((resolve, reject) => {
      Alert.alert('Подтвердите удаление', message, [
        {
          text: 'Да',
          onPress: () => resolve(),
          style: 'destructive',
        },
        {text: 'Отмена', onPress: () => reject(), style: 'cancel'},
      ]);
    });

    confirmDelete
      .then(() => {
        db.transaction(tx => {
          currentList.map(id => {
            tx.executeSql(
              "DELETE FROM Timetable WHERE id_client = ? AND type_client = 's'",
              [id],
              () => null,
              (_, err) => (
                Alert.alert('Произошла непредвиденная ошибка!'),
                console.log('error removeStudent (timetable) - ', err)
              ),
            );
            tx.executeSql(
              'DELETE FROM students WHERE id = ?',
              [id],
              () => Alert.alert('Карточка успешно удаленна'),
              (_, err) => (
                Alert.alert('Произошла непредвиденная ошибка!'),
                console.log('error removeStudent (students) - ', err)
              ),
            );
          });
        });
        this.setState({selected: [], holdIdCard: 0});
        this.getData();
      })
      .catch(() => {
        return;
      });
  }

  // запрос списка учеников
  getData() {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT st.id as ID, st.group_org as LeftBot, dg.name as RightBot, 
                st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as LeftTop 
        FROM Students as st 
        INNER JOIN Diagnosis as dg ON st.id_diagnos = dg.id`,
        [],
        (_, {rows}) => this.setState({dataStudents: rows.raw()}),
        (_, err) => console.log('error getData - ', err),
      );
    });
  }

  render() {
    let content;
    if (this.state.dataStudents.length != 0) {
      content = (
        <ScrollView style={Styles.containerCard}>
          {this.state.dataStudents.map(item => (
            <LargeCard
              key={item.ID}
              data={item}
              select={this.state.selected.includes(item.ID)}
              onCallPress={() => {
                this.state.selected.length != 0
                  ? this.selectCard(item.ID)
                  : this.props.navigation.navigate('Student', {
                      type: 'view',
                      id: item.ID,
                    });
              }}
              onCallLong={() => {
                this.state.selected.length != 0
                  ? this.state.selected.includes(item.ID)
                    ? this.setState({onHold: true})
                    : this.selectCard(item.ID)
                  : this.setState({onHold: true, holdIdCard: item.ID});
              }}
            />
          ))}
          <View style={Styles.crutch}></View>
        </ScrollView>
      );
    } else {
      content = <EmptyData typeField={'s'} />;
    }
    return (
      <View style={Styles.container}>
        {content}
        <MenuActions
          visible={this.state.onHold}
          callClose={() => this.setState({onHold: false})}
          callSelect={() => this.selectCard()}
          callCopy={() =>
            this.props.navigation.navigate('Student', {
              type: 'copy',
              id: item.ID,
            })
          }
          callDelete={() => this.deleteUser()}
          callResetSelected={() => this.setState({selected: []})}
          isSelected={this.state.selected.length != 0}
        />
        <AddingButton
          execute={() =>
            this.props.navigation.navigate('Student', {
              type: 'add',
              id: undefined,
            })
          }
        />
      </View>
    );
  }
}
