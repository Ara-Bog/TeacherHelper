import React from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';

export default function ButtonEdit({
  onChangeState,
  funcAdd,
  onUpdate,
  onConfirm,
}) {
  const closeConfirm = () => {
    Alert.alert(
      'Подтвердите действие',
      `Вы действительно хотите вернуться к просмотру не сохранив изменения ?`,
      [
        {
          text: 'Да',
          onPress: () => onChangeState(),
          style: 'destructive',
        },
        {text: 'Отмена', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const submitConfirm = () => {
    Alert.alert(
      'Подтвердите действие',
      `Сохранить внесенные изменения ?`,
      [
        {
          text: 'Да',
          onPress: () => onConfirm(),
          style: 'destructive',
        },
        {text: 'Отмена', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  return (
    <View
      style={{
        // ...Styles.float_btnRow,
        gap: 40,
        paddingVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderRadius: 86,
        shadowColor: 'rgba(4, 2, 29, 0.9)',
        elevation: 20,
        shadowOffset: {height: 20, width: 20},
        position: 'absolute',
        bottom: 26,
        right: 20,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={() => closeConfirm()}>
        <Icons.MaterialIcons name="close" size={25} color="#DC5F5A" />
      </TouchableOpacity>
      <TouchableOpacity
      // onPress={() => this.submitConfirm()}
      >
        <Icons.Feather name="copy" size={17} color="#554AF0" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => submitConfirm()}>
        <Icons.MaterialIcons name="check" size={25} color="#15AA2C" />
      </TouchableOpacity>
      {funcAdd != undefined ? (
        <TouchableOpacity style={{}} onPress={() => (funcAdd(), onUpdate())}>
          <Icons.MaterialIcons name="add" size={25} color="#554AF0" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
