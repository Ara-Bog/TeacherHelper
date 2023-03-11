import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DivDefaultRow} from '../elements/divDefault';

// ДОЛАТЬ ДО ПИКЕРА ВРЕМЕНИ И ДАТА ВРЕМЯ
export default function BirhdayView({
  value,
  editing,
  label,
  onChange,
  requared,
  type,
  labelEdit,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // - дата или время или вместе -- type: String
  // - заголовок при редактировании -- labelEdit: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)

  const stringToDate = val => {
    let newVal = null;
    if (val) {
      newVal = val.split('.').reverse().join('-');
      return new Date(Date.parse(newVal));
    }
    return null;
  };

  const calcAge = val => {
    if (val != null) {
      let days = new Date().getTime() - new Date(val); // считаем разницу в милисекундах
      days = Math.round(days / (24 * 3600 * 365.25 * 1000)); // делим на милисекунды в год
      return days;
    }
    return null;
  };

  let parseDate = stringToDate(value);

  const [currentValue, setVal] = useState(
    value || 'Нажмите чтобы выбрать дату',
  );
  const [currentAge, setAge] = useState(calcAge(parseDate) || 0);
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setDate] = useState(parseDate);

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {labelEdit}
        {requared ? ' *' : null}
      </Text>
      <View style={Styles.inputDefaultWrap}>
        <TouchableOpacity
          style={Styles.formDataTime}
          onPress={() => setShowPicker(true)}>
          <Text style={Styles.formDataTimeText}>{currentValue}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      {editing ? (
        editingView
      ) : (
        <DivDefaultRow label={label} value={currentAge} />
      )}
      {showPicker ? (
        <DateTimePicker
          maximumDate={new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)}
          value={currentDate || new Date()}
          mode={'date'}
          is24Hour={true}
          onChange={(e, val) => {
            setShowPicker(false);
            if (e.type == 'set') {
              setAge(calcAge(val));
              setDate(val);
              let stringDate = val.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              setVal(stringDate);
              onChange(stringDate);
            }
          }}
        />
      ) : null}
    </>
  );
}
