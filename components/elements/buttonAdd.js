import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';

export default function AddingButton({onPress}) {
  // Элемент, плавающая кнопка в нижней части экрана для добавления новых объектов
  // onPress - функция колбэка
  return (
    <View style={Styles.float_btAdd_wrap}>
      <TouchableOpacity style={Styles.float_btAdd} onPress={() => onPress()}>
        <Icons.MaterialIcons name="add" size={30} color="#554AF0" />
      </TouchableOpacity>
    </View>
  );
}
