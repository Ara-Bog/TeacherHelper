import React, {useState, useEffect} from 'react';
import {Keyboard, View, TouchableOpacity, Alert} from 'react-native';

export default function ButtonEdit({
  onChangeState,
  funcAdd,
  onUpdate,
  onConfirm,
}) {
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
    );
  };

  const submitConfirm = () => {
    Alert.alert('Подтвердите действие', `Сохранить внесенные изменения ?`, [
      {
        text: 'Да',
        onPress: () => onConfirm(),
        style: 'destructive',
      },
      {text: 'Отмена', style: 'cancel'},
    ]);
  };

  return keyboardStatus ? null : (
    <View style={Styles.float_btnRow}>
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
