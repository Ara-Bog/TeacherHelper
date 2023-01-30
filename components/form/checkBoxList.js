import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import DropList from '../elements/dropdownList';
import Checkbox from './checkbox';

export default class CheckboxList extends Component {
  // полученные данные:
  // - текущие значения свича -- data: object
  // - статус выделения блока -- select: bool
  // - тип данных (ученики, группы или расписание) -- typeData: string
  // --
  // обратная связь:
  // - событие на зажатие -- onCallLong
  // - событие на нажатие -- onCallPress

  constructor(props) {
    super(props);
    this.state = {
      listCheched: [],
      data: this.props.data,
      currentValues: {...this.props.currentValues},
    };
  }

  setCheck(val) {
    let currentList = [...this.state.listCheched];
    let indexVal = currentList.indexOf(val);

    if (indexVal >= 0) {
      currentList.splice(indexVal, 1);
    } else {
      currentList.push(val);
    }

    // не через setState - т.е. тогда ререндер происходит
    // изменение состояние объекта происходит на прямую
    this.state.listCheched = currentList;
  }

  // стилизовать
  // перебросить все в filter

  render() {
    return (
      <View style={{gap: 15}}>
        {Object.keys(this.state.data).map((label, index) => (
          <DropList
            key={index}
            id={index}
            label={label}
            data={this.state.data[label]}>
            <Checkbox
              isSelected={idChildren =>
                this.state.listCheched.includes(idChildren)
              }
              callBack={idChildren => this.setCheck(idChildren)}
            />
          </DropList>
        ))}
      </View>
    );
  }
}
