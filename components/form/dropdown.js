import React, {useState, useEffect} from 'react';
import {Text, View, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

DropDownPicker.setLanguage('RU');

export default function Dropdown({
  value,
  data,
  editing,
  label,
  onChange,
  requared,
  zIndex,
  // currentOpen,
  open,
  setOpen,
  // testIndex,
  ref,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // - zIndex блока -- zIndex: int
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)

  const [currentValue, setVal] = useState(value);
  // const [open123, setOpen] = useState();
  const [items, setItems] = useState(data);

  const editingView = (
    <View style={{...Styles.divDefault__edit, zIndex: zIndex}}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <DropDownPicker
        schema={{
          label: 'name',
          value: 'id',
        }}
        // open={test === testIndex}
        open={open}
        value={currentValue}
        items={items}
        setOpen={val => {
          setOpen(val);
        }}
        setValue={setVal}
        setItems={setItems}
        listMode="SCROLLVIEW"
        style={Styles.dropDown}
        dropDownContainerStyle={Styles.dropDownBox}
        disabled={!editing}
        dropDownDirection="BOTTOM"
      />
    </View>
  );
  const showView = (
    <View style={Styles.divDefault}>
      <Text style={Styles.divDefaultLabel}>{label}</Text>
      {currentValue ? (
        <Text style={Styles.divDefaultValue}>
          {
            items.find(item => {
              return (item.id = currentValue);
            }).name
          }
        </Text>
      ) : (
        <Text style={Styles.emptyValue}>
          *Пустоasdasdasdasdasdasdasdasdasdasdasdasdasdas*
        </Text>
      )}
    </View>
  );

  return <>{editing ? editingView : showView}</>;
}
