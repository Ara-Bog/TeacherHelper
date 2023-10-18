import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function DefaultCard({
  data,
  select,
  bigSize,
  isTimetable,
  onCallPress,
  onCallLong,
  noUsed,
}) {
  // Карточка для список расписания/групп/учеников
  // props:
  // - data: object -- текущие значения свича
  // - select: bool -- статус выделения блока
  // - bigSize: bool -- большой размер карточек
  // - isTimetable : bool -- флаг карточки расписания
  // - noUsed: bool -- флаг для не используемых карточек
  // ---------------
  // props-functions:
  // - onCallLong () -- событие на зажатие
  // - onCallPress () -- событие на нажатие

  const addedContent = (
    <>
      <View style={Styles.cardDelaultRowLine}></View>
      <View style={Styles.cardDelaultRow}>
        <Text style={[Styles.cardDelaultRowText, {flexShrink: 1}]}>
          {data.LeftBot}
        </Text>
        <Text style={Styles.cardDelaultRowText}>{data.RightBot}</Text>
      </View>
    </>
  );
  return (
    <TouchableOpacity
      style={select ? Styles.cardDelault__active : Styles.cardDelault}
      onPress={() => onCallPress()}
      onLongPress={() => onCallLong()}>
      <View style={[Styles.cardDelaultRow, noUsed ? {opacity: 0.4} : null]}>
        {isTimetable ? (
          <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
            <Icons.Feather name="clock" size={17} color="#554AF0" />
            <Text style={[Styles.cardDelaultRowTitle, {fontSize: 14}]}>
              {data.LeftTop}
            </Text>
          </View>
        ) : (
          <Text
            style={[Styles.cardDelaultRowTitle, {flexShrink: 1, fontSize: 14}]}>
            {data.LeftTop}
          </Text>
        )}

        {!bigSize && isTimetable ? (
          <Text style={Styles.cardDelaultRowText}>{data.LeftBot}</Text>
        ) : (
          <Text style={Styles.cardDelaultRowText}>{data.RightTop}</Text>
        )}
      </View>
      {bigSize ? addedContent : null}
    </TouchableOpacity>
  );
}
