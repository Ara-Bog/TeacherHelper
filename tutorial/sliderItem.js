import {Text, View, Dimensions, StyleSheet, ScrollView} from 'react-native';

const {width} = Dimensions.get('screen');
let curWidth = width - 40;

export default function SliderItem({item}) {
  return (
    <ScrollView style={localStyle.container}>
      <View style={localStyle.circleWrap}>
        <View style={localStyle.circle}></View>
        <item.component />
      </View>
      <View style={{gap: 15, alignItems: 'center'}}>
        <Text style={localStyle.title}>{item.title}</Text>
        <Text style={localStyle.text}>{item.text}</Text>
      </View>
    </ScrollView>
  );
}

const localStyle = StyleSheet.create({
  container: {
    height: '100%',
    width: width,
    paddingHorizontal: 20,
  },
  circleWrap: {
    minHeight: curWidth,
    marginBottom: 38,
    justifyContent: 'center',
    paddingHorizontal: 27,
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#EEEDFE',
    borderRadius: curWidth,
    width: curWidth,
    height: curWidth,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    color: '#1F1F1F',
    fontStyle: 'normal',
  },
  text: {
    color: '#717171',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 400,
    fontStyle: 'normal',
    textAlign: 'center',
  },
});
