import React, {useRef, useEffect} from 'react';
import {View, Animated, Image} from 'react-native';
import Styles from '../styles/index';

export default function LoadingAnimation() {
  const startValue = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.loop(
      Animated.spring(startValue, {
        toValue: 30,
        useNativeDriver: true,
        friction: 7,
      }),
      {iterations: -1},
    ).start();
  }, [startValue]);

  const persons = [];
  for (let i = 0; i < 4; i++) {
    persons.push(
      <Image
        key={i}
        style={Styles.iconLoadImagePerson}
        source={require('../assets/person.png')}
      />,
    );
  }

  return (
    <View style={Styles.iconLoadContainer}>
      <View style={Styles.iconLoadWrap}>
        <Image
          style={{width: 115, height: 120}}
          source={require('../assets/borderIcon.png')}
        />
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              position: 'absolute',
              overflow: 'hidden',
              transform: [{translateX: startValue}],
            },
          ]}>
          {persons}
        </Animated.View>
      </View>
    </View>
  );
}
