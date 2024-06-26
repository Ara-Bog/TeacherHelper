import React, {useState, useRef, useEffect} from 'react';
import {Text, View} from 'react-native';
import {DivDefaultRow} from '../elements/divDefault';
import {Dropdown} from 'react-native-element-dropdown';

export default function DropdownView({
  value,
  data,
  editing,
  label,
  onChange,
  requared,
  onConfirm,
  placeholder = 'Выберите значение',
  flagUpdate,
}) {
  // получает:
  // - значение поля ввода -- value: String
  // - массив объектов заполняемых значений дроплиста -- data: Array<Object>
  // - режим редактирования или просмотра -- editing: Bool
  // - заголовок -- label: String
  // - звездочка в поле -- requared: Bool
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)
  // - при выборе, требующий подтверждения, отправляется
  // выбранный id и в случае успеха = вызывается afterConfirm
  // для изменения состояний компонента  -- onConfirm(id: int, afterConfirm: Function)

  const findName = () => {
    if (value != undefined) {
      return data.find(item => item.id == value)?.name;
    }
    return null;
  };

  const [currentValue, setVal] = useState(value);
  const [items, setItems] = useState(data);
  const [name, setName] = useState(findName());

  useEffect(() => {
    if (value != currentValue) {
      setVal(value);
      setName(findName());
    }
  }, [editing]);

  useEffect(() => {
    setItems(data);
    setVal(value);
    setName(findName());
  }, [flagUpdate]);

  // ссылка на список, чтобы закрывать его
  const drop = useRef();

  // кастомный элемент выпадающего списка
  const itemRender = (item, selected) => {
    return (
      <View
        style={{
          ...Styles.dropDownBoxRow,
          backgroundColor: selected ? 'rgba(85, 74, 240, 0.1)' : '#fff',
        }}>
        <Text
          style={{
            ...Styles.dropDownBoxRowText,
            color: selected ? '#554AF0' : '#04021D',
          }}>
          {item.name}
        </Text>
      </View>
    );
  };

  const editingView = (
    <View style={Styles.divDefault__edit}>
      {label ? (
        <Text style={Styles.divDefaultLabel__edit}>
          {label}
          {requared ? ' *' : null}
        </Text>
      ) : null}
      <Dropdown
        ref={drop}
        style={Styles.dropDown}
        selectedTextStyle={Styles.dropDownText}
        itemContainerStyle={{borderRadius: 10}}
        placeholder={placeholder}
        placeholderStyle={{...Styles.dropDownText, color: '#848484'}}
        maxHeight={250}
        containerStyle={Styles.dropDownBox}
        activeColor="transparent"
        backgroundColor="rgba(4, 2, 29, 0.3)"
        fontFamily="sf_regular"
        labelField="name"
        valueField="id"
        value={currentValue}
        // проверка на необходимость подтверждения
        confirmSelectItem={onConfirm instanceof Function}
        onChange={item => {
          // возвращаем колбэк
          onChange(item.id);
          // устанавливаем новое значение для списка
          setVal(item.id);
          // устанавливаем имя для отображения
          setName(item.name);
        }}
        onConfirmSelectItem={item => {
          // вызываем функцию подтверждения
          onConfirm(item.id, change => {
            // когда подтвеждение выполненно успешно
            if (change) {
              // устанавливаем значение
              setVal(item.id);
              // устанавливаем имя
              setName(item.name);
              // вызов колбэка не нужен, т.к. он обрабатывается в подтверждении
            }
            // закрываем список
            drop.current.close();
          });
        }}
        // автоскролл до выбранного значения
        autoScroll={false}
        data={items}
        // кастомный элемент списка
        renderItem={itemRender}
      />
    </View>
  );
  return (
    <>{editing ? editingView : <DivDefaultRow label={label} value={name} />}</>
  );
}
