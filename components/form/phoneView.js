import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  Text,
  View,
  TextInput,
  Linking,
  FlatList,
} from 'react-native';
import Modal from '../elements/AppModal';
import {MaskedTextInput, MaskedText} from 'react-native-mask-text';
import Contacts from 'react-native-contacts';

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
  const [contacts, setContacts] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [search, setSearch] = useState('');

  // запрос разрешения на чтение контактов
  async function ensureContactsPermission() {
    if (Platform.OS !== 'android') {
      return true;
    }
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
      return false;
    }
    return true;
  }

  // загрузка контактов и открытие модального списка выбора
  async function openContactPicker() {
    if (!(await ensureContactsPermission())) {
      return;
    }
    try {
      const all = await Contacts.getAll();
      // оставляем только контакты с телефоном, сортируем по имени
      const withPhones = all
        .filter(c => c.phoneNumbers && c.phoneNumbers.length)
        .sort((a, b) =>
          contactName(a).localeCompare(contactName(b), 'ru'),
        );
      setContacts(withPhones);
      setSearch('');
      setPickerVisible(true);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить контакты.');
    }
  }

  function contactName(contact) {
    return (
      contact.displayName ||
      [contact.givenName, contact.familyName].filter(Boolean).join(' ') ||
      'Без имени'
    );
  }

  // применяем выбранный номер: обновляем поле и предлагаем вставить имя
  function applySelection(contact, phone) {
    setPickerVisible(false);
    const cleaned = phone.number.replace(/\D/g, '');
    setVal(cleaned);
    onChange(cleaned);
    Alert.alert('Подтвердите действие', 'Вставить имя контакта в поле ФИО ?', [
      {
        text: 'Да',
        onPress: () => callAction(contactName(contact)),
        style: 'default',
      },
      {text: 'Нет', style: 'cancel'},
    ]);
  }

  // тап по контакту: один номер -- сразу, несколько -- предлагаем выбрать
  function onContactPress(contact) {
    const phones = contact.phoneNumbers || [];
    if (!phones.length) {
      return;
    }
    if (phones.length === 1) {
      applySelection(contact, phones[0]);
      return;
    }
    Alert.alert('Выберите номер', contactName(contact), [
      ...phones.map(p => ({
        text: `${p.label ? p.label + ': ' : ''}${p.number}`,
        onPress: () => applySelection(contact, p),
      })),
      {text: 'Отмена', style: 'cancel'},
    ]);
  }

  const filteredContacts = search
    ? contacts.filter(c =>
        contactName(c).toLowerCase().includes(search.toLowerCase()),
      )
    : contacts;

  useEffect(() => {
    if (value != currentValue) {
      setVal(String(value) || '');
    }
  }, [editing]);

  const contactPickerModal = (
    <Modal
      isVisible={pickerVisible}
      onBackdropPress={() => setPickerVisible(false)}
      onBackButtonPress={() => setPickerVisible(false)}
      useNativeDriver
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 16,
          paddingHorizontal: 16,
          maxHeight: '75%',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 12,
            color: '#1A1A2E',
          }}>
          Выбор контакта
        </Text>
        <TextInput
          style={{
            backgroundColor: '#F4F4F8',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginBottom: 10,
            fontSize: 15,
          }}
          placeholder="Поиск контакта..."
          placeholderTextColor="#9A9AB0"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.recordID}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                color: '#9A9AB0',
                paddingVertical: 24,
              }}>
              Контакты не найдены
            </Text>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => onContactPress(item)}
              style={{
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#EEE',
              }}>
              <Text style={{fontSize: 16, color: '#1A1A2E'}}>
                {contactName(item)}
              </Text>
              <Text style={{fontSize: 13, color: '#8E8E9A', marginTop: 2}}>
                {item.phoneNumbers[0].number}
                {item.phoneNumbers.length > 1
                  ? ` (+${item.phoneNumbers.length - 1})`
                  : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          onPress={() => setPickerVisible(false)}
          style={{paddingVertical: 16, alignItems: 'center'}}>
          <Text style={{color: '#554AF0', fontSize: 16, fontWeight: '600'}}>
            Закрыть
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={openContactPicker} style={Styles.contactButton}>
          <Icons.AntDesign name="contacts" size={23} color="#554AF0" />
        </TouchableOpacity>
        <View style={{...Styles.inputDefaultWrap, width: 'auto', flex: 1}}>
          <MaskedTextInput
            style={{...Styles.inputDefault, width: 'auto', flex: 1}}
            value={currentValue}
            mask="+9 (999) 999-99-99"
            onChangeText={(text, rawText) => {
              onChange(rawText.replace(/\D/g, ''));
            }}
            keyboardType="numeric"
          />
        </View>
      </View>
      {contactPickerModal}
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
