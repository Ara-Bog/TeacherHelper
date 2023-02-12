import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

function RadioItem({label, checked, onSelect}) {
  // кнопка радио
  // получет:
  // - текст возле радио -- label: string
  // - статус отметки -- checked: bool
  // обратный вызов:
  // - нажатие на радио -- onSelect
  return (
    <TouchableOpacity
      onPress={() => onSelect()}
      style={{flexDirection: 'row', gap: 12}}>
      <View
        style={[
          Styles.radioCircle,
          checked ? Styles.radioCircle__active : null,
        ]}
      />
      <Text style={Styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default class RadioBlock extends Component {
  // получает:
  // - id текущего выбранного элемента -- currentVall: Array(int)
  // обратная связь:
  // - возвращает данные радио, на которую нажали -- onCallBack(key: int, val: string)
  constructor(props) {
    super(props);
    // распаковываем текущее значение, чтобы вместо [] - было int
    let [tempVall] = this.props.currentVall;

    this.state = {
      // текущий сохраненный id
      currentVall: tempVall,
    };
  }

  setRadioChecked(key, val) {
    // перезаписываем выбранный id
    this.setState({currentVall: key});
    // возвращаем выбранное значение
    this.props.onCallBack(key, val);
  }

  render() {
    return (
      <View style={{gap: 15}}>
        {this.props.data.map(item => (
          <RadioItem
            key={item.id}
            label={item.label}
            checked={this.state.currentVall == item.id}
            onSelect={() => this.setRadioChecked(item.id, item.label)}
          />
        ))}
      </View>
    );
  }
}
