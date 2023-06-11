import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import InputView from '../form/inputView';
import PhoneView from '../form/phoneView';

export default function ContactCard(props) {
  // Карточка контакта, для страницы ученика
  // props:
  // - режим редактирования или просмотра -- editing: Bool
  // - является ли блок первым в списке -- isFirst: Bool
  // - данные для заполнения -- values: Object<String>
  // ---------------
  // обратная связь (props):
  // - изменение конкретного поля -- onChanges(field: string, val: string)
  // - удаление текущего блока -- removeBlock()

  const [nameContact, setNameContact] = useState(props.values.name);

  return (
    <View
      style={
        props.editing
          ? [props.isFirst ? Styles.contactItem_edit : null, {gap: 10}]
          : Styles.contactItem
      }>
      {/* обход элементов блока */}
      <InputView
        label="ФИО"
        requared={true}
        editing={props.editing}
        value={props.values.name}
        onChange={val => props.onChanges('name', val)}
        addedValue={nameContact}
      />
      <InputView
        label="Кем приходится"
        editing={props.editing}
        value={props.values.type}
        onChange={val => props.onChanges('type', val)}
      />
      <PhoneView
        label="Телефон"
        requared={true}
        editing={props.editing}
        value={props.values.phone}
        onChange={val => props.onChanges('phone', val)}
        callAction={val => (props.onChanges('name', val), setNameContact(val))}
      />

      {props.editing ? (
        <TouchableOpacity
          style={Styles.buttonRed}
          onPress={() => props.removeBlock()}>
          <Text style={Styles.buttonRedText}>Удалить</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
