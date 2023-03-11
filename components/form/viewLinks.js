import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ViewLinks({
  value,
  editing,
  label,
  onChange,
  requared,
  type,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // - дата или время или вместе -- type: String
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
    let days = new Date().getTime() - new Date(val); // считаем разницу в милисекундах
    days = Math.round(days / (24 * 3600 * 365.25 * 1000)); // делим на милисекунды в год
    return days;
  };

  let parseDate = stringToDate(value);

  const [currentValue, setVal] = useState(value || '__-__-____');
  const [currentAge, setAge] = useState(calcAge(parseDate) || 0);
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setDate] = useState(parseDate || new Date());

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
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

  const showView = (
    <View style={Styles.divDefault}>
      <Text style={Styles.divDefaultLabel}>{label}</Text>
      {currentAge ? (
        <Text style={Styles.divDefaultValue}>{currentAge}</Text>
      ) : (
        <Text style={Styles.emptyValue}>*Не указано*</Text>
      )}
    </View>
  );

  return (
    <>
      {editing ? editingView : showView}
      {showPicker ? (
        <DateTimePicker
          maximumDate={new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000)}
          minimumDate={new Date(Date.now() - 9 * 365 * 24 * 60 * 60 * 1000)}
          value={currentDate}
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
