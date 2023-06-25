import React from 'react';
import {Text, View, Switch} from 'react-native';

export default function RowSwitcher({label, currentValue, onCallBack}) {
  // получает:
  // - текущее значение свича -- currentValue: Bool
  // - заголовок -- label: String
  // --
  // возврат:
  // - массив выбранных значений -- onCallBack(val: bool)
  return (
    <View style={Styles.rowSwitch}>
      <Text style={Styles.rowSwitchText}>{label}</Text>
      <Switch
        value={currentValue}
        trackColor={{true: '#554AF0', false: '#EBEBEB'}}
        thumbColor={'#FFFFFF'}
        onValueChange={check => onCallBack(check)}
      />
    </View>
  );
}
