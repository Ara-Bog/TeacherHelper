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
    ? React.cloneElement(props.children, {
        data: props.data,
        editing: props.editing,
        values: props.values,
      })
    : props.data.map((item, index) => {
        let newId = [props.id, index].join('.');

        return React.cloneElement(props.children, {
          key: newId,
          id: item.id,
          label: item.label,
          editing: props.editing,
        });
      });

  const subContent = props.childrenElements.map(item => {
    // let newId = [props.id, item.key].join('.');
    return React.cloneElement(item.element, {
      editing: props.editing,
    });
  });
  // меняем текущее значение и отправляем колбэк, что состояние сменилось
  const changeShow = state => {
    props.setCheck();
    setShow(state);
  };

  return (
    <View style={props.editing ? {gap: 25} : {gap: 12}}>
      <TouchableOpacity
        style={props.editing ? Styles.dropdownListWrap : null}
        onPress={() => changeShow(!show)}>
        <Text
          style={[
            Styles.dropdownListText,
            !props.editing
              ? {color: '#04021D', fontSize: 14, lineHeight: 17}
              : null,
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
          color={'#554AF0'}
        />
      </TouchableOpacity>
      {show || !props.editing ? (
        <>
          <View
            style={[
              show ? {display: 'flex'} : {display: 'none'},
              !props.editing
                ? Styles.dropdownList__showMod
                : Styles.dropdownList,
            ]}>
            {mainContent}
          </View>
          <View>{subContent}</View>
        </>
      ) : null}
    </View>
  );
}
