import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function defaultCard(props) {
  // Маханизм выпадающего списка
  // props:
  // - id текущего списка -- id: int || str
  // - данные для заполнения дочернего элемент -- data: array
  // - дочерний элемент -- children: Component || func
  // - заголовок выпадающего списка -- label: string

  // отслеживания открытия/закрытия списка
  const [show, changeShow] = useState(false);

  // обход переданных данных, для создания детей с передачей им необходимых props
  const ChildrenElements = props.data.map((item, index) => {
    let newId = [props.id, index].join('.');

    return React.cloneElement(props.children, {
      key: newId,
      id: newId,
      label: item.name,
    });
  });

  return (
    <>
      <TouchableOpacity
        style={Styles.dropdownLabel}
        onPress={() => changeShow(!show)}>
        <Text style={Styles.dropdownLabelText}>{props.label}</Text>
        <Icons.Entypo
          name="chevron-down"
          style={{transform: [{rotate: show ? '180deg' : '0deg'}]}}
          size={20}
          color={'#04021D'}
        />
      </TouchableOpacity>
      <View
        style={{
          ...Styles.dropdownList,
          display: show ? 'flex' : 'none',
        }}>
        {ChildrenElements}
      </View>
    </>
  );
}
