import React from 'react';
import {Text, View} from 'react-native';

export default function EmptyField({typeField, showMode}) {
  // Компонент для отображения пустых списков на всех основных страницах

  // получает:
  // - ключ значения для вставки в текст -- typeField: String
  // - режим просмотра -- showMode: bool

  const fieldValues = {
    Student: 'карточку ученика',
    Group: 'группу',
    Timetable: 'запись в расписании',
    Dynamic: 'запись',
  };

  const text = showMode
    ? 'Перейдите в режим редактирования, чтобы добавить новые записи'
    : `Нажмите на кнопку “+” в правном нижнем углу экрана, что бы создать новую ${fieldValues[typeField]}`;

  return (
    <View style={Styles.emptyContainer}>
      <Text style={Styles.emptyContainer_mainText}>Ничего не найдено</Text>
      <Text style={Styles.emptyContainer_addedText}>{text}</Text>
    </View>
  );
}
