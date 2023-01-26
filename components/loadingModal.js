import React from 'react';
import {Text, View, ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';

export default function LoadModal({status}) {
  // Компонент заглушка во время загрузки данных

  // получает:
  // текущий статус отображения -- status: bool

  return (
    <Modal
      style={{alignItems: 'center'}}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      isVisible={status}
      transparent={true}>
      <View style={Styles.modalLoad}>
        <ActivityIndicator size={70} color="#554AF0" />
        <Text style={Styles.modalLoad_text}>Загрузка</Text>
      </View>
    </Modal>
  );
}
