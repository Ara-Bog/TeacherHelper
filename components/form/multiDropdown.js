import React, {useState, useRef, useEffect} from 'react';
import {Text, View} from 'react-native';
import {DivDefaultRow} from '../elements/divDefault';
import {MultiSelect} from 'react-native-element-dropdown';
import {
  itemRender,
  RenderHeaderList,
  defaultPropsDroplist,
  itemRenderIsolated,
} from '../elements/dropdownItems';

export default function MultiDropdownView({
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
    if (value[0] != undefined) {
      return data.find(item => item.id == value[0])?.name;
    }
    return null;
  };

  const [currentValue, setVal] = useState(value || []);
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

  const onSelectAll = isSelectAll => {
    const selectItem = [];
    if (isSelectAll) {
      items.map(item => {
        selectItem.push(item.id);
      });
    }
    setVal(selectItem);
    onChange(selectItem);
  };

  const editingView = (
    <View style={[Styles.divDefault__edit, {gap: 0}]}>
      {label ? (
        <Text style={[Styles.divDefaultLabel__edit, {marginBottom: 10}]}>
          {label}
          {requared ? ' *' : null}
        </Text>
      ) : null}
      <MultiSelect
        {...defaultPropsDroplist}
        ref={drop}
        placeholder={isDisabled ? 'Список пуст' : placeholder}
        disable={isDisabled}
        value={currentValue}
        // проверка на необходимость подтверждения
        confirmSelectItem={onConfirm instanceof Function}
        onChange={item => {
          // возвращаем колбэк
          onChange(item);
          // устанавливаем новое значение для списка
          setVal(item);
        }}
        onConfirmSelectItem={item => {
          // вызываем функцию подтверждения
          onConfirm(item.id, change => {
            // когда подтвеждение выполненно успешно
            if (change) {
              // устанавливаем значение
              setVal(item.id);
              // вызов колбэка не нужен, т.к. он обрабатывается в подтверждении
            }
          });
        }}
        data={items}
        // кастомный элемент списка
        renderItem={itemRender}
        flatListProps={{
          ListHeaderComponent: (
            <RenderHeaderList
              onSelectAll={onSelectAll}
              curLength={currentValue.length}
              itemsLength={items.length}
            />
          ),
        }}
        renderSelectedItem={itemRenderIsolated}
      />
    </View>
  );
  return (
    <>{editing ? editingView : <DivDefaultRow label={label} value={name} />}</>
  );
}
