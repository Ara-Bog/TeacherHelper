import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

export default function MenuActions({
  callClose,
  callSelect,
  callCopy,
  callMove,
  callDelete,
  callResetSelected,
  visible,
  isSelected,
}) {
  // получает:
  // - текущее значение свича -- includeCard: bool
  // - статус выделения блока -- status: bool
  // --
  // возврат:
  // - событие на LongPress -- onCallLong()

  function actionClose(action) {
    action();
    callClose();
  }

  const selectCard = (
    <TouchableOpacity
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callSelect)}>
      <Icons.Octicons name="check" size={20} color="#554AF0" />
      <Text style={Styles.holdMenuButtonText}>Выделить</Text>
    </TouchableOpacity>
  );

  const copyCard = (
    <TouchableOpacity
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callCopy)}>
      <Icons.Octicons name="copy" size={20} color="#554AF0" />
      <Text style={Styles.holdMenuButtonText}>Копировать</Text>
    </TouchableOpacity>
  );

  const moveToCard = (
    <TouchableOpacity
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callMove)}>
      <Icons.Ionicons
        name="chevron-forward-outline"
        size={20}
        color="#554AF0"
      />
      <Text style={Styles.holdMenuButtonText}>Перейти к карточке</Text>
    </TouchableOpacity>
  );

  // !!!!
  const deleteCards = (
    <TouchableOpacity
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callDelete)}>
      <Icons.AntDesign name="delete" size={20} color="#DC5F5A" />
      <Text style={{...Styles.holdMenuButtonText, color: '#DC5F5A'}}>
        Удалить
      </Text>
    </TouchableOpacity>
  );

  const removeSelection = (
    <TouchableOpacity
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callResetSelected)}>
      <Icons.MaterialCommunityIcons name="cancel" size={20} color="#DC5F5A" />
      <Text style={{...Styles.holdMenuButtonText, color: '#DC5F5A'}}>
        Отменить веделение
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      style={{marginBottom: 0, marginLeft: 0, marginRight: 0}}
      isVisible={visible}
      onBackButtonPress={() => callClose()}
      onBackdropPress={() => callClose()}>
      <View style={Styles.holdMenu}>
        {isSelected ? null : selectCard}
        {isSelected ? null : copyCard}
        {callMove == undefined ? null : moveToCard}
        {isSelected ? removeSelection : null}
        {deleteCards}
      </View>
    </Modal>
  );
}
