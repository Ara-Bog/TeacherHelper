import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';

export default function FieldText({label}) {
  // Компонент текстового представления полей формы
  // props:
  // - текст компонента -- label: string

  return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
      <Text style={{marginRight: 7}}>{`\u2022`}</Text>
      <Text>{label}</Text>
    </View>
  );
}
