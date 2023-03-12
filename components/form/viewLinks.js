import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function ViewLinks({
  value,
  editing,
  label,
  onChange,
  requared,
  type,
  navigate,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // - дата или время или вместе -- type: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)
  const showView = (
    <View style={Styles.divMain}>
      <Text style={Styles.divMainTitle}>{label}</Text>
      {value ? (
        <View style={Styles.viewLinksWrap}>
          {value.map((item, indexEl) => {
            return (
              <TouchableOpacity
                key={indexEl}
                style={Styles.viewLinksItem}
                onPress={() => navigate(item.id)}>
                <Text style={Styles.viewLinksItemText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text style={Styles.emptyValue}>Не указано</Text>
      )}
    </View>
  );

  return <>{editing ? null : showView}</>;
}
