import React from 'react';
import {View, TextInput} from 'react-native';

export default function LargeCard({value, onChange}) {
  // получает:
  // - текущее значение свича -- currentValue: Bool
  // - заголовок -- label: String
  // --
  // возврат:
  // - массив выбранных значений -- onCallBack(val: bool)
  return (
    <View style={Styles.inputDefaultWrap}>
      <Icons.Octicons
        name="search"
        color="#B1B1B1"
        size={15}
        style={{paddingVertical: 3.5, transform: [{scaleX: -1}]}}
      />
      <TextInput
        style={Styles.inputDefault}
        value={value}
        placeholder="Найти ученика..."
        placeholderTextColor="#B1B1B1"
        onChangeText={val => {
          onChange(val);
        }}
      />
    </View>
  );
}
