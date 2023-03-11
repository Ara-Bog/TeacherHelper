import React, {useState} from 'react';
import {Text, View, TextInput} from 'react-native';

export default function DynamicBlock({
  value,
  editing,
  label,
  onChange,
  requared,
  childrens,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)

  const [currentValue, setVal] = useState(value);

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={{...Styles.divDefaultLabel__edit, color: 'red'}}>
        {label}
        {requared ? ' *' : null}
        hui
      </Text>
      <View style={Styles.inputDefaultWrap}></View>
    </View>
  );
  console.debug('qwe', childrens);
  const showView = (
    <View style={Styles.divDefault}>
      <Text style={Styles.divDefaultLabel}>{label}</Text>
      {currentValue ? (
        <Text style={Styles.divDefaultValue}>asd</Text>
      ) : (
        <Text style={Styles.emptyValue}>Не указано</Text>
      )}
    </View>
  );

  return <>{editing ? editingView : showView}</>;
}
