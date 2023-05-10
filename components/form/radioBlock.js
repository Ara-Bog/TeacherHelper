import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FieldText from '../elements/formFieldText';

function RadioItem({label, checked, onSelect, hideCircle}) {
  // кнопка радио
  // получет:
  // - текст возле радио -- label: string
  // - статус отметки -- checked: bool
  // - статус отметки -- hideCircle: bool
  // обратный вызов:
  // - нажатие на радио -- onSelect
  return (
    <TouchableOpacity
      onPress={() => onSelect()}
      style={{flexDirection: 'row', gap: 12}}>
      <View
        style={[
          Styles.radioCircle_outer,
          checked ? Styles.radioCircle_outer__active : null,
        ]}>
        <View
          style={[
            Styles.radioCircle_inner,
            checked ? Styles.radioCircle_inner__active : null,
          ]}
        />
      </View>
      <Text style={Styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default class RadioBlock extends Component {
  // получает:
  // - id текущего выбранного элемента -- values: Array(int)
  // обратная связь:
  // - возвращает данные радио, на которую нажали -- onCallBack(key: int, val: string)
  constructor(props) {
    super(props);
    // распаковываем текущее значение, чтобы вместо [] - было int
    let [tempVall] = this.props.values;

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
        {this.props.editing ? (
          <RadioItem
            key={0}
            label={'Не выбрано'}
            checked={this.state.currentVall == undefined}
            onSelect={() => this.setRadioChecked(undefined, undefined)}
          />
        ) : null}
        {this.props.data.map(item => {
          if (this.props.editing) {
            return (
              <RadioItem
                key={item.id}
                label={item.label}
                checked={this.state.currentVall == item.id}
                onSelect={() => this.setRadioChecked(item.id, item.label)}
              />
            );
          } else if (this.state.currentVall == item.id) {
            return <FieldText key={item.id} label={item.label} />;
          }
          return null;
        })}
      </View>
    );
  }
}
