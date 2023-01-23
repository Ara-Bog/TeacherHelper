import React from 'react';
import {Text, View, Switch} from 'react-native';
import {COLORS} from '../../colors.js';

export default function rowSwitcher({label, currentValue, onCallBack}) {
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
        trackColor={{true: COLORS.blue, false: COLORS.gray}}
        thumbColor={'#FFFFFF'}
        onValueChange={check => onCallBack(check)}
      />
    </View>
  );
}
