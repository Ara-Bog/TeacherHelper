import {Text, TouchableOpacity} from 'react-native';

// чекер в виде надписи
export default function TextChecker({active, label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        Styles.textCheckerWrap,
        active ? Styles.textCheckerWrap__active : null,
      ]}>
      <Text
        style={[
          Styles.textCheckerText,
          active ? Styles.textCheckerText__active : null,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
