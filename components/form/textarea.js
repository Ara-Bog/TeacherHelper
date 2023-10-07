import React, {useState, useEffect} from 'react';
import {Text, View, TextInput} from 'react-native';
import {DivDefaultCol} from '../elements/divDefault';

export default function Textarea({value, editing, label, onChange, requared}) {
  // props:
  // - editing: Bool -- режим редактирования или просмотра
  // - value: String -- значение поля ввода
  // - requared: Bool -- звездочка в поле
  // - label: String -- заголовок
  // --
  // props-functions:
  // - onChange(val: string) -- изменение значения поля

  const [currentValue, setVal] = useState(value || '');

  useEffect(() => {
    if (value != currentValue) {
      setVal(value);
    }
  }, [editing]);

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
          placeholder={'Введите текст'}
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
