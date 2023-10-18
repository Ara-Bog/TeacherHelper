import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';

export default function Pagination({lengthList, curIndex}) {
  return (
    <View
      style={{
        alignSelf: 'center',
        justifySelf: 'center',
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 'auto',
      }}>
      {Array.from({length: lengthList}).map((_, index) => (
        <View
          key={index}
          style={[
            localStyle.dot,
            index === curIndex ? localStyle.dot__active : null,
          ]}
        />
      ))}
    </View>
  );
}

const localStyle = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
    backgroundColor: '#F1F1F1',
  },
  dot__active: {
    backgroundColor: '#554AF0',
  },
});
