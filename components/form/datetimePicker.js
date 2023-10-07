import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {DivDefaultRow} from '../elements/divDefault';

export function TimePicker({
  value,
  editing,
  label,
  onChange,
  requared,
  labelEdit,
}) {
  // блок пикера времени
  // props:
  // - editing: Bool -- режим редактирования или просмотра
  // - value: String -- значение поля ввода
  // - requared: Bool -- звездочка в поле
  // - label: String -- заголовок
  // - labelEdit: String -- заголовок при редактировании
  // --
  // props-functions:
  // - onChange(val: string) -- изменение значения поля

  const timeFromString = val => {
    if (val) {
      let [hours, minutes] = val.split(':');
      const curDate = new Date();
      curDate.setHours(hours);
      curDate.setMinutes(minutes);
      return curDate;
    }
    return null;
  };
  const [currentValue, setVal] = useState(
    value ? value : 'Нажмите чтобы выбрать время',
  );
  const [currentTime, setTime] = useState(timeFromString(value));
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (value != currentValue) {
      setVal(value ? value : 'Нажмите чтобы выбрать время');
      setTime(timeFromString(value));
    }
  }, [editing]);

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
        <DivDefaultRow label={label} value={currentValue} />
      )}
      {showPicker ? (
        <DateTimePicker
          value={currentTime || new Date()}
          mode={'time'}
          is24Hour={true}
          onChange={(e, val) => {
            setShowPicker(false);
            if (e.type == 'set') {
              let stringTime = val.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
              setTime(val);
              setVal(stringTime);
              onChange(stringTime);
            }
          }}
        />
      ) : null}
    </>
  );
}

// пикер дня рождения
export function BirhdayView({
  value,
  editing,
  label,
  onChange,
  requared,
  labelEdit,
}) {
  // блок пикера даты рождения
  // props:
  // - editing: Bool -- режим редактирования или просмотра
  // - value: String -- значение поля ввода
  // - requared: Bool -- звездочка в поле
  // - label: String -- заголовок
  // - labelEdit: String -- заголовок при редактировании
  // --
  // props-functions:
  // - onChange(val: string) -- изменение значения поля

  const stringToDate = val => {
    if (val) {
      let newVal = val.split('.').reverse().join('-');
      return new Date(Date.parse(newVal));
    }
    return null;
  };

  const calcAge = val => {
    if (val) {
      let miliseconds = new Date().getTime() - new Date(val); // считаем разницу в милисекундах
      let calcData = miliseconds / (24 * 3600 * 365.25 * 1000); // делим на милисекунды в год
      let age = Math.trunc(calcData);
      let month = Math.round(12 * (calcData - age));
      return `${age} л.${month ? ` ${month} мес.` : ''}`;
    }
    return null;
  };

  let parseDate = stringToDate(value);

  const [currentValue, setVal] = useState(
    value ? value : 'Нажмите чтобы выбрать дату',
  );
  const [currentAge, setAge] = useState(calcAge(parseDate) || 0);
  const [showPicker, setShowPicker] = useState(false);
  const [currentDate, setDate] = useState(parseDate);

  useEffect(() => {
    if (value != currentValue) {
      setVal(value ? value : 'Нажмите чтобы выбрать дату');
      let parseDate = stringToDate(value);
      setAge(calcAge(parseDate) || 0);
      setDate(parseDate);
    }
  }, [editing]);

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
