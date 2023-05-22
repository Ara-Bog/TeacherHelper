import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function DropdownLabel(props) {
  // Маханизм выпадающего списка
  // props:
  // - id текущего списка -- id: int || str
  // - данные для заполнения дочернего элемент -- data: array
  // - дочерний элемент -- children: Component || func
  // - заголовок выпадающего списка -- label: string
  // - текущее состояния открытия списка -- show: bool
  // - отображение заголовков в редактировании/просмотре -- edititng: bool
  // ---------------
  // обратная связь (props):
  // - значение сменилось setCheck

  // отслеживания открытия/закрытия списка
  const [show, setShow] = useState(props.show);
  // обход переданных данных, для создания детей с передачей им необходимых props
  const mainContent = props.childView
    ? [
        React.cloneElement(props.children, {
          key: [props.id, 0].join('.'),
          data: props.data,
          editing: props.editing,
          values: props.values,
        }),
      ]
    : props.data.map((item, index) => {
        let newId = [props.id, index].join('.');

        return React.cloneElement(props.children, {
          key: newId,
          id: item.id,
          label: item.label,
          editing: props.editing,
        });
      });

  // вложенный контент
  const subContent = props.childrenElements.map(item => {
    // проверка пустого значения
    if ((props.child_values[item.key] || []).length) {
      return React.cloneElement(item.element, {
        editing: props.editing,
      });
    } else {
      return null;
    }
  });

  // меняем текущее значение и отправляем колбэк, что состояние сменилось
  const changeShow = state => {
    props.setCheck();
    setShow(state);
  };

  return (
    <View style={props.editing ? {gap: 25} : {gap: 12}}>
      <TouchableOpacity
        style={
          props.editing
            ? props.simpleShow
              ? Styles.dropdownListWrap__nasted
              : Styles.dropdownListWrap
            : null
        }
        onPress={() => changeShow(!show)}>
        <Text
          style={[
            props.simpleShow
              ? Styles.dropdownListText__nested
              : Styles.dropdownListText,
            !props.editing ? Styles.dropdownListText__show : null,
          ]}>
          {props.label}
        </Text>
        <Icons.Entypo
          name="chevron-down"
          style={[
            {alignSelf: 'center'},
            !props.editing ? {display: 'none'} : null,
            show ? {transform: [{rotate: '180deg'}]} : null,
          ]}
          size={20}
          color={props.simpleShow ? '#B1B1B1' : '#554AF0'}
        />
      </TouchableOpacity>
      {show || !props.editing ? (
        <>
          {mainContent.length ? (
            <View
              style={[
                show ? {display: 'flex'} : {display: 'none'},
                !props.editing
                  ? Styles.dropdownList__showMod
                  : Styles.dropdownList,
              ]}>
              {mainContent}
            </View>
          ) : null}

          <View style={{gap: 25}}>{subContent}</View>
        </>
      ) : null}
    </View>
  );
}
