import React, {Component} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default class Checkbox extends Component {
  // Компонент чекбокс
  // props:
  // - возвращает текущее состояние чекбокса -- isSelected: func
  // - текущий id элемента (1.1) -- id: string
  // - текст чекбокса -- label: string
  // --
  // обратная связь:
  // - событие на установку флага -- callBack(id)

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
          style={[
            Styles.checkboxIcon,
            this.state.isSelected ? Styles.checkboxIcon__active : null,
          ]}>
          {this.state.isSelected ? (
            <Icons.Octicons name="check" size={13} color="#fff" />
          ) : null}
        </View>
        <Text style={Styles.checkboxText}>{this.state.label}</Text>
      </TouchableOpacity>
    );
  }
}
