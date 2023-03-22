import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function SymptomBlock(props) {
  // Маханизм выпадающего списка для блока симптоматикии ей подобных
  // props:
  // - id текущего списка -- id: int || str
  // - данные для заполнения дочернего элемент -- data: array
  // - дочерний элемент -- children: Component || func
  // - заголовок выпадающего списка -- label: string
  // - текущее состояния открытия списка -- show: bool
  // ---------------
  // обратная связь (props):
  // - значение сменилось setCheck

  // отслеживания открытия/закрытия списка
  const [show, setShow] = useState(props.show);

  // обход переданных данных, для создания детей с передачей им необходимых props
  const ChildrenElements = props.data.map((item, index) => {
    let newId = [props.id, index].join('.');

    return React.cloneElement(props.children, {
      key: newId,
      id: newId,
      label: item.name,
    });
  });

  // меняем текущее значение и отправляем колбэк, что состояние сменилось
  const changeShow = state => {
    props.setCheck();
    setShow(state);
  };

  return (
    <>
      <TouchableOpacity
        style={Styles.dropdownListWrap}
        onPress={() => changeShow(!show)}>
        <Text style={Styles.dropdownListText}>{props.label}</Text>
        <Icons.Entypo
          name="chevron-down"
          style={{transform: [{rotate: show ? '180deg' : '0deg'}]}}
          size={20}
          color={'#554AF0'}
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
