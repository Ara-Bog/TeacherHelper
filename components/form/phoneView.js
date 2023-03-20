import React, {useState, useEffect} from 'react';
import {TouchableOpacity, PermissionsAndroid, Platform} from 'react-native';
import {Alert} from 'react-native';
import {Text, View, TextInput, Linking} from 'react-native';
import {MaskedTextInput, MaskedText} from 'react-native-mask-text';
import {selectContactPhone} from 'react-native-select-contact';

export default function PhoneView({
  value,
  editing,
  label,
  onChange,
  requared,
  callAction,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)
  // - вызов колбэка в родительский, для изменения View -- callAction:(val: String)

  const [currentValue, setVal] = useState(String(value));

  // получения списка контактов
  async function getPhoneNumber() {
    // запрос на открытие контактов
    const request = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    );
    // denied permission || user chose 'deny, don't ask again'
    if (
      request === PermissionsAndroid.RESULTS.DENIED ||
      request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      Alert.alert(
        'Ошибка разрешений',
        'Без разрешения чтения контактов, мы не можем загрузить список :с',
      );
      return null;
    }

    // вызываем получение списка
    const selection = await selectContactPhone();
    // ничего не выбрали
    if (!selection) {
      return null;
    }

    // данные контакта
    let {contact, selectedPhone} = selection;

    // убираем все кроме чисел и обновляем value
    setVal(selectedPhone.number.replace(/\D/g, ''));
    // запрос на обновление имени в блоке
    Alert.alert('Подтвердите действие', 'Вставить имя контакта в поле ФИО ?', [
      {text: 'Да', onPress: () => callAction(contact.name), style: 'default'},
      {text: 'Нет', style: 'cancel'},
    ]);
  }

  useEffect(() => {
    if (value != currentValue) {
      setVal(String(value) || '');
    }
  }, [editing]);

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={getPhoneNumber} style={Styles.contactButton}>
          <Icons.AntDesign name="contacts" size={23} color="#554AF0" />
        </TouchableOpacity>
        <View style={{...Styles.inputDefaultWrap, width: 'auto', flex: 1}}>
          <MaskedTextInput
            style={{...Styles.inputDefault, width: 'auto'}}
            value={currentValue}
            mask="+9 (999) 999-99-99"
            onChangeText={(text, rawText) => {
              onChange(rawText.replace(/\D/g, ''));
            }}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const showView = (
    <View style={{...Styles.divMain, marginTop: 10}}>
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${currentValue}`)}>
        <MaskedText
          style={{...Styles.phoneStyle, alignContent: 'flex-end'}}
          mask="+9 (999) 999-99-99">
          {currentValue}
        </MaskedText>
      </TouchableOpacity>
    </View>
  );

  return <>{editing ? editingView : showView}</>;
}
