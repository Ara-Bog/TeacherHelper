import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function defaultCard({
  data,
  select,
  typeData,
  onCallPress,
  onCallLong,
}) {
  // полученные данные:
  // - текущие значения свича -- data: object
  // - статус выделения блока -- select: bool
  // - тип данных (ученики, группы или расписание) -- typeData: string
  // --
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

  let showAdded;
  if (userSettings.sizeCardAll.length != 1) {
    showAdded = userSettings['bigCard' + typeData];
  } else {
    showAdded = userSettings.sizeCardAll[0] == 'big';
  }
  return (
    <TouchableOpacity
      style={select ? Styles.cardDelault__active : Styles.cardDelault}
      onPress={() => onCallPress()}
      onLongPress={() => onCallLong()}>
      <View style={Styles.cardDelaultRow}>
        <Text style={Styles.cardDelaultRowTitle}>{data.LeftTop}</Text>
      </View>
      {showAdded ? addedContent : null}
    </TouchableOpacity>
  );
}
