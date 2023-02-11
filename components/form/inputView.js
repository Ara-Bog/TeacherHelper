import React from 'react';
import {Text, View, TextInput} from 'react-native';

export default function InputView({value, editing, label, onChange, requared}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>

      {editing ? (
        <View style={Styles.inputDefaultWrap}>
          <TextInput
            style={Styles.inputDefault}
            value={value}
            onChangeText={val => onChange(val)}
          />
        </View>
      ) : (
        <Text style={Styles.divDefaultValue}>{value}</Text>
      )}
    </View>
  );

  const showView = (
    <View style={Styles.divDefault}>
      <Text style={Styles.divDefaultLabel}>{label}</Text>
      <Text style={Styles.divDefaultValue}>{value}</Text>
    </View>
  );

  return <>{editing ? editingView : showView}</>;
}
