import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View, TextInput, Linking} from 'react-native';
import {MaskedTextInput, MaskedText} from 'react-native-mask-text';

export default function PhoneView({value, editing, label, onChange, requared}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)

  const [currentValue, setVal] = useState(String(value));

  useEffect(() => {
    if (value != currentValue) {
      setVal(value || '');
    }
  }, [editing]);

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <View style={Styles.inputDefaultWrap}>
        <MaskedTextInput
          style={Styles.inputDefault}
          value={currentValue}
          mask="+9 (999) 999-99-99"
          onChangeText={(text, rawText) => {
            onChange(rawText.replace(/\D/g, ''));
          }}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const showView = (
    <View style={Styles.divMain}>
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${currentValue}`)}>
        <MaskedText style={Styles.phoneStyle} mask="+9 (999) 999-99-99">
          {currentValue}
        </MaskedText>
      </TouchableOpacity>
    </View>
  );

  return <>{editing ? editingView : showView}</>;
}
