import React, {useState, useEffect} from 'react';
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

  useEffect(() => {
    if (JSON.stringify(value) == JSON.stringify(currentValue)) {
      setVal(value);
    }
  }, [editing]);

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={{...Styles.divDefaultLabel__edit, color: 'red'}}>
        {label}
        {requared ? ' *' : null}
        hui
      </Text>
      <View style={Styles.inputDefaultWrap}>pizda</View>
    </View>
  );

  const showView = (
    <>
      {/* {childrens.map(item => {
        return item(editing);
      })} */}
    </>
  );

  return (
    <>
      {childrens.map((block, indexBlock) => {
        return block.map((item, indexItem) => {
          return item[1](editing, value[indexBlock][item[0]]);
        });
      })}
    </>
  );
}
