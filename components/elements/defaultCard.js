import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function defaultCard({
  data,
  select,
  bigSize,
  onCallPress,
  onCallLong,
}) {
  // полученные данные:
  // - текущие значения свича -- data: object
  // - статус выделения блока -- select: bool
  // - большой размер карточек -- bigSize: bool
  // ---------------
  // обратная связь:
  // - событие на зажатие -- onCallLong
  // - событие на нажатие -- onCallPress
  const addedContent = (
    <>
      <View style={Styles.cardDelaultRowLine}></View>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowText}>{data.LeftBot}</Text>
        <Text style={Styles.cardDelaultRowText}>{data.RightBot}</Text>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      style={select ? Styles.cardDelault__active : Styles.cardDelault}
      onPress={() => onCallPress()}
      onLongPress={() => onCallLong()}>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowTitle}>{data.LeftTop}</Text>
      </View>
      {bigSize ? addedContent : null}
    </TouchableOpacity>
  );
}
