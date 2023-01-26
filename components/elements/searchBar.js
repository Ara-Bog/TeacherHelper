import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function LargeCard({data}) {
  // получает:
  // - текущее значение свича -- currentValue: Bool
  // - заголовок -- label: String
  // --
  // возврат:
  // - массив выбранных значений -- onCallBack(val: bool)
  return (
    <TouchableOpacity style={Styles.cardDelault}>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowTitle}>{data.LeftTop}</Text>
      </View>
      <View style={Styles.cardDelaultRowLine}></View>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowText}>
          {data.LeftBot == null ? '*не заполненно*' : data.LeftBot}
        </Text>
        <Text style={Styles.cardDelaultRowText}>{data.RightBot}</Text>
      </View>
    </TouchableOpacity>
  );
}
