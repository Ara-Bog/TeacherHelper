import React from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function NavPage({values, onSelect, selected}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)
  const Tab = (val, key, index) => (
    <TouchableOpacity
      key={key}
      onPress={() => onSelect(index)}
      style={[
        Styles.navPageTab,
        selected == index ? {backgroundColor: '#554AF0'} : null,
      ]}>
      <Text
        style={[
          Styles.navPageTabText,
          selected == index ? {color: '#fff'} : null,
        ]}>
        {val}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{backgroundColor: '#fff'}}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          display: 'flex',
          minWidth: '100%',
          width: 'auto',
        }}>
        {values.map((item, index) => {
          return Tab(
            item.show_label === null ? item.name : item.show_label,
            item.id,
            index,
          );
        })}
      </ScrollView>
    </View>
  );
}
