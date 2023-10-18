import React, {useState, useRef} from 'react';
import {Text, View, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import SliderItem from './sliderItem';
import Slides from './sliderData';
import Pagination from './pagination';

const {width} = Dimensions.get('screen');

export default function Slider({onClose}) {
  const flatListRef = useRef(null);
  const [curInd, setIndex] = useState(0);

  const handleMomentumScrollEnd = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width + 20)); // width + 20 - это ширина элемента + отступ

    if (index !== curInd) {
      setIndex(index);
    }
  };

  const srollContinue = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index: curInd + 1, animated: true});
      setIndex(curInd + 1);
    }
  };

  return (
    <View
      style={{
        paddingTop: 70,
        paddingBottom: 42,
        height: '100%',
      }}>
      <View style={{alignItems: 'flex-end', marginRight: 20, marginBottom: 20}}>
        <TouchableOpacity onPress={onClose}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#554AF0',
            }}>
            Пропустить
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        style={{zIndex: 2}}
        data={Slides}
        renderItem={({item}) => <SliderItem item={item} />}
        horizontal={true}
        snapToAligment="center"
        snapToInterval={width + 20}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        ItemSeparatorComponent={() => (
          <View style={{height: '100%', width: 20}} />
        )}
      />
      <Pagination lengthList={Slides.length} curIndex={curInd} />
      {curInd < Slides.length - 1 ? (
        <TouchableOpacity
          style={[
            Styles.opacityButton,
            {
              marginHorizontal: 20,
            },
          ]}
          onPress={srollContinue}>
          <Text style={Styles.opacityButtonText}>Далее</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            Styles.opacityButton,
            {
              marginHorizontal: 20,
            },
          ]}
          onPress={onClose}>
          <Text style={Styles.opacityButtonText}>Закрыть</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
