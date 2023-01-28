import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import DropList from '../elements/dropdownList';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: this.props.isSelected(this.props.id),
      label: this.props.label,
      id: this.props.id,
    };
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({isSelected: !this.state.isSelected});
          this.props.callBack(this.state.id);
        }}
        style={Styles.checkbox}>
        <View
          style={
            this.state.isSelected
              ? Styles.checkboxIcon__active
              : Styles.checkboxIcon
          }>
          {this.state.isSelected ? (
            <Icons.Octicons name="check" size={13} color="#fff" />
          ) : null}
        </View>
        <Text
          style={this.state.isSelected ? {color: 'red'} : {color: 'orange'}}>
          {this.state.label}
        </Text>
      </TouchableOpacity>
    );
  }
}

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
      <>
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
      </>
    );
  }
}
