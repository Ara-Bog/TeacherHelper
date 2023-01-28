import React from 'react';
import {Text, View} from 'react-native';

export default function emptyField({typeField}) {
  // Компонент для отображения пустых списков на всех основных страницах

  // получает:
  // - ключ значения для вставки в текст -- typeField: bool

  const fieldValues = {
    Student: 'карточку ученика',
    Group: 'группу',
    Timetable: 'запись в расписании',
  };

  return (
    <View style={Styles.emptyContainer}>
      <Text style={Styles.emptyContainer_mainText}>Ничего не найдено</Text>
      <Text style={Styles.emptyContainer_addedText}>
        Нажмите на кнопку “+” в правном нижнем углу экрана, что бы создать новую{' '}
        {fieldValues[typeField]}
      </Text>
    </View>
  );
}
