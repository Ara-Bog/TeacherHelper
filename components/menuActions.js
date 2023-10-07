import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

export default function MenuActions({
  callClose,
  callSelect,
  callCopy,
  callMove,
  callDelete,
  callDeleteAll,
  callResetSelected,
  callChange,
  visible,
  isSelected,
  onCard,
}) {
  // получает:
  // - текущее значение свича -- includeCard: bool
  // - статус выделения блока -- status: bool
  // --
  // возврат:
  // - событие на LongPress -- onCallLong()

  // обработка события
  function actionClose(action) {
    // вызов переданной функции
    action();
    // закрытие модалки
    callClose();
  }

  // выбор карточки
  const selectCard = (
    <TouchableOpacity
      key={1}
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callSelect)}>
      <Icons.Octicons name="check" size={20} color="#554AF0" />
      <Text style={Styles.holdMenuButtonText}>Выделить</Text>
    </TouchableOpacity>
  );

  // копирование
  const copyCard = (
    <TouchableOpacity
      key={2}
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callCopy)}>
      <Icons.Octicons name="copy" size={20} color="#554AF0" />
      <Text style={Styles.holdMenuButtonText}>Копировать</Text>
    </TouchableOpacity>
  );

  // переход к карточке
  const moveToCard = (
    <TouchableOpacity
      key={3}
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

  // удаление
  const deleteCards = (
    <TouchableOpacity
      key={4}
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callDelete)}>
      <Icons.AntDesign name="delete" size={20} color="#DC5F5A" />
      <Text style={{...Styles.holdMenuButtonText, color: '#DC5F5A'}}>
        Удалить
      </Text>
    </TouchableOpacity>
  );

  // удаление всех
  const deleteAllCards = (
    <TouchableOpacity
      key={5}
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callDeleteAll)}>
      <Icons.AntDesign name="delete" size={20} color="#DC5F5A" />
      <Text style={{...Styles.holdMenuButtonText, color: '#DC5F5A'}}>
        Удалить все карточки текущего списка
      </Text>
    </TouchableOpacity>
  );

  // убрать выделения
  const removeSelection = (
    <TouchableOpacity
      key={6}
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callResetSelected)}>
      <Icons.MaterialCommunityIcons name="cancel" size={20} color="#DC5F5A" />
      <Text style={{...Styles.holdMenuButtonText, color: '#DC5F5A'}}>
        Отменить веделение
      </Text>
    </TouchableOpacity>
  );

  // переход в режим редактирования
  const changeMode = (
    <TouchableOpacity
      key={7}
      style={Styles.holdMenuButton}
      onPress={() => actionClose(callChange)}>
      <Icons.Feather name="edit" size={20} color="#554AF0" />
      <Text style={Styles.holdMenuButtonText}>Редактировать</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      style={{marginBottom: 0, marginLeft: 0, marginRight: 0}}
      isVisible={visible}
      onBackButtonPress={() => callClose()}
      onBackdropPress={() => callClose()}>
      <View style={Styles.holdMenu}>
        {onCard
          ? [changeMode, copyCard]
          : [
              isSelected ? removeSelection : [selectCard, copyCard],
              callMove == undefined ? null : moveToCard,
            ]}
        {deleteCards}
        {deleteAllCards}
      </View>
    </Modal>
  );
}
