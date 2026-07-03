import React from 'react';
import {
  Modal as RNModal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

// Maintained replacement for the abandoned `react-native-modal`, built on the
// React Native core <Modal>. Implements the subset of the react-native-modal
// API this app relies on:
//   - isVisible            -> core `visible`
//   - onBackButtonPress    -> core `onRequestClose` (Android back)
//   - onBackdropPress      -> tap on the dark backdrop
//   - style                -> merged into the content container (same as rn-modal)
//   - animationIn          -> mapped to core `animationType` (slide/fade)
// Backdrop defaults (black @ 0.7) and content default ({flex:1, justifyContent:
// 'center'}) match react-native-modal so existing layouts render the same.
export default function AppModal({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  style,
  children,
  animationIn,
}) {
  const animationType =
    typeof animationIn === 'string' &&
    animationIn.toLowerCase().includes('fade')
      ? 'fade'
      : 'slide';

  return (
    <RNModal
      visible={!!isVisible}
      transparent
      animationType={animationType}
      onRequestClose={onBackButtonPress || onBackdropPress}
      statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onBackdropPress}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View pointerEvents="box-none" style={[styles.content, style]}>
        {children}
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
