import React, {useState} from 'react';
import {Text, View, TextInput} from 'react-native';
import {DivDefaultCol} from '../elements/divDefault';

export default function Textarea({
  value,
  editing,
  label,
  onChange,
  requared,
  type,
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

  const [currentValue, setVal] = useState(value || '');

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <View style={Styles.divNoteWrap_edit}>
        <TextInput
          multiline={true}
          numberOfLines={5}
          value={currentValue}
          placeholder={'Введиие текст'}
          onChangeText={val => {
            setVal(val);
            onChange(val);
          }}
          style={Styles.divNoteInput}
          editable={editing}
        />
      </View>
    </View>
  );

  return (
    <>
      {editing ? (
        editingView
      ) : (
        <DivDefaultCol label={label} value={currentValue} />
      )}
    </>
  );
}
