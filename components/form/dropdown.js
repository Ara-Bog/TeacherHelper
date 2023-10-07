import React, {useState, useRef, useEffect} from 'react';
import {Text, View} from 'react-native';
import {DivDefaultRow} from '../elements/divDefault';
import {Dropdown} from 'react-native-element-dropdown';
import {itemRender, defaultPropsDroplist} from '../elements/dropdownItems';

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
  isDisabled,
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

  const editingView = (
    <View style={Styles.divDefault__edit}>
      {label ? (
        <Text style={Styles.divDefaultLabel__edit}>
          {label}
          {requared ? ' *' : null}
        </Text>
      ) : null}
      <Dropdown
        {...defaultPropsDroplist}
        ref={drop}
        placeholder={isDisabled ? 'Список пуст' : placeholder}
        disable={isDisabled}
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
