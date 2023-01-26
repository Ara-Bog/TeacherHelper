import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function LargeCard({data, select, onCallPress, onCallLong}) {
  // получает:
  // - текущее значение свича -- data: object
  // - статус выделения блока -- status: bool
  // --
  // возврат:
  // - событие на LongPress -- onCallLong()
  return (
    <TouchableOpacity
      style={select ? Styles.cardDelault__active : Styles.cardDelault}
      onPress={() => onCallPress()}
      onLongPress={() => onCallLong()}>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowTitle}>{data.LeftTop}</Text>
      </View>
      <View style={Styles.cardDelaultRowLine}></View>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowText}>
          {data.LeftBot == null ? '*не заполненно*' : data.LeftBot}
        </Text>
        <Text style={Styles.cardDelaultRowText}>
          {data.RightBot == null ? '*не заполненно*' : data.RightBot}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
