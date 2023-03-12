import React, {useState, useEffect} from 'react';
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

  const [currentValue, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [editing]);

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <View style={Styles.inputDefaultWrap}>
        <TextInput
          style={Styles.inputDefault}
          value={currentValue}
          placeholder={'Введите текст'}
          onChangeText={val => {
            onChange(val);
            setVal(val);
          }}
        />
      </View>
    </View>
  );

  const showView = (
    <View style={Styles.divDefault}>
      <Text style={Styles.divDefaultLabel}>{label}</Text>
      {currentValue ? (
        <Text style={Styles.divDefaultValue}>{currentValue}</Text>
      ) : (
        <Text style={Styles.emptyValue}>Не указано</Text>
      )}
    </View>
  );

  return <>{editing ? editingView : showView}</>;
}
