import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, Alert, BackHandler, Text, TouchableOpacity, ScrollView} from 'react-native';
import Styles from '../styles/index';

import {TimePicker} from '../components/form/datetimePicker';
import Dropdown from '../components/form/dropdown';
import MultiDropdown from '../components/form/multiDropdown.js';
import Textarea from '../components/form/textarea.js';
import setHeaderNavigation from '../actions/changeHeader.js';
import MenuActions from '../components/menuActions.js';
import {DivDefaultRow} from '../components/elements/divDefault.js';
import {
  saveConfirm,
  removeConfirm,
  undoConfirm,
  undoCreate,
} from '../actions/confirmAction';
import {
  getTimetableById,
  getStudentsForTimetable,
  getGroupsForTimetable,
  checkTimeOverlap,
  createTimetable,
  updateTimetable,
  insertMultipleDays,
  deleteTimetable,
} from '../database/repositories/timetableRepo';
import {getDB} from '../database/connection';
import useBackHandler from '../hooks/useBackHandler';

const ITEMS_DAYS = [
  {name: 'Понедельник', id: 'mon'},
  {name: 'Вторник', id: 'tue'},
  {name: 'Среда', id: 'wen'},
  {name: 'Четверг', id: 'thu'},
  {name: 'Пятница', id: 'fri'},
  {name: 'Суббота', id: 'sat'},
  {name: 'Воскресенье', id: 'sun'},
];

const ITEMS_TYPE = [
  {name: 'Групповое', id: 'g'},
  {name: 'Индивидуальное', id: 's'},
];

export default function TimetableForm({route, navigation}) {
  const optionsRef = useRef({...route.params});
  const [editing, setEditing] = useState(optionsRef.current.type !== 'view');
  const [loading, setLoading] = useState(true);
  const [menuShow, setMenuShow] = useState(false);
  const [valuesStorage, setValuesStorage] = useState({
    date: [],
    time_start: null,
    time_end: null,
    type_client: null,
    id_client: null,
  });
  const [currentData, setCurrentData] = useState({});
  const [listStudents, setListStudents] = useState([]);
  const [listGroups, setListGroups] = useState([]);
  const [flagTypeChange, setFlagTypeChange] = useState(false);

  const valuesRef = useRef(valuesStorage);
  const currentDataRef = useRef(currentData);

  // Keep refs in sync
  useEffect(() => {
    valuesRef.current = valuesStorage;
  }, [valuesStorage]);
  useEffect(() => {
    currentDataRef.current = currentData;
  }, [currentData]);

  const setNavView = useCallback(() => {
    setHeaderNavigation({
      mainTitle: 'Запись расписания',
      addedTitle: optionsRef.current.template.name,
      onPressRight: () => setMenuShow(true),
      navigation: navigation,
      mode: 'menu',
    });
  }, [navigation]);

  const increaseTime = useCallback((time, addMinutes) => {
    let [hours, minutes] = time.split(':');
    const curDate = new Date();
    curDate.setHours(hours);
    curDate.setMinutes(parseInt(minutes) + addMinutes);
    return curDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  const confirmEdit = useCallback(() => {
    let flagError = false;
    const vals = valuesRef.current;
    Object.keys(vals).forEach(key => {
      if (!['note', 'category', 'diagnos'].includes(key)) {
        if (!vals[key] || vals[key].length === 0) {
          flagError = true;
        }
      }
    });

    if (flagError) {
      Alert.alert(
        'Ошибка ввода',
        `Поля со звездочкой должны быть обязательно заполненны`,
        [{text: 'Ок', style: 'destructive'}],
        {cancelable: true},
      );
      return;
    }

    if (vals.time_start >= vals.time_end) {
      Alert.alert(
        'Ошибка ввода',
        `Время окончания должно быть больше времени начала занятия`,
        [{text: 'Ок', style: 'destructive'}],
        {cancelable: true},
      );
      return;
    }

    // updateBase inline
    const data = vals;
    checkTimeOverlap(
      data.date,
      data.time_start,
      data.time_end,
      (time, add) => increaseTime(time, add),
    ).then(async badDays => {
      if (badDays.length) {
        let listDays = ITEMS_DAYS.filter(item => badDays.includes(item.id));
        Alert.alert(
          'Ошибка ввода!',
          `В следующих днях имеются пересечения по времени занятия:\n${listDays
            .map(item => item.name)
            .join(', ')}`,
        );
        return;
      }

      if (data.date.length > 1) {
        await new Promise((resolve) => {
          Alert.alert(
            'Уведомление',
            `Вы указали запись на несколько дней.\n
Будет создано ${data.date.length} записей и вы автоматически будете перемещены на струницу расписания!`,
            [{text: 'Ок', onPress: () => resolve()}],
          );
        });
        await insertMultipleDays(data, data.date);
        Alert.alert('Данные успешно обновлены!');
        navigation.goBack();
      } else {
        if (optionsRef.current.type != 'view') {
          let newId = await createTimetable({...data, date: data.date[0]});
          optionsRef.current.id = newId;
          optionsRef.current.type = 'view';
        } else {
          await updateTimetable({...data, date: data.date[0]}, optionsRef.current.id);
        }
        Alert.alert('Данные успешно обновлены!');
        setCurrentData(JSON.parse(JSON.stringify(vals)));
        setNavView();
        setEditing(false);
      }
    });
  }, [navigation, setNavView, increaseTime]);

  const setNavChange = useCallback(() => {
    setHeaderNavigation({
      mainTitle: 'Редактирование записи',
      addedTitle: optionsRef.current.template.name,
      onPressRight: () => saveConfirm(() => confirmEdit()),
      onPressLeft: () => {
        undoConfirm(() => {
          setValuesStorage(JSON.parse(JSON.stringify(currentDataRef.current)));
          setEditing(false);
          setNavView();
        });
      },
      navigation: navigation,
      mode: 'edit',
    });
  }, [navigation, confirmEdit, setNavView]);

  // BackHandler
  useBackHandler(() => {
    if (optionsRef.current.type === 'view') {
      undoConfirm(() => {
        setValuesStorage(JSON.parse(JSON.stringify(currentDataRef.current)));
        setEditing(false);
        setNavView();
      });
    } else {
      undoCreate(() => {});
    }
    return true;
  }, editing);

  // Initial setup
  useEffect(() => {
    const currentType = optionsRef.current.type;

    switch (currentType) {
      case 'view':
        setNavView();
        break;
      case 'add':
        setHeaderNavigation({
          mainTitle: 'Новая запись',
          addedTitle: optionsRef.current.template.name,
          onPressRight: () => saveConfirm(() => confirmEdit()),
          onPressLeft: () => undoCreate(() => navigation.goBack()),
          navigation: navigation,
          mode: 'edit',
        });
        break;
      case 'copy':
        setHeaderNavigation({
          mainTitle: 'Копия записи',
          addedTitle: optionsRef.current.template.name,
          onPressRight: () => saveConfirm(() => confirmEdit()),
          onPressLeft: () => undoCreate(() => navigation.goBack()),
          navigation: navigation,
          mode: 'edit',
        });
        break;
    }

    const db = getDB();
    db.transaction(tx => {
      if (currentType !== 'add') {
        getTimetableById(tx, optionsRef.current.id, data => {
          let dataStr = JSON.stringify(data);
          let parsed = JSON.parse(dataStr);
          parsed.date = [parsed.date];
          setValuesStorage(parsed);

          let currentParsed = JSON.parse(dataStr);
          currentParsed.date = [currentParsed.date];
          setCurrentData(currentParsed);
        });
      }
      getStudentsForTimetable(tx, optionsRef.current.template.id, data => {
        setListStudents(data);
      });
      getGroupsForTimetable(tx, optionsRef.current.template.id, data => {
        setListGroups(data);
        setLoading(false);
      });
    });
  }, []);

  const removeCard = useCallback(async () => {
    await deleteTimetable(optionsRef.current.id);
    Alert.alert('Карточка успешно удалена!');
    navigation.pop();
  }, [navigation]);

  const changeValue = useCallback((key, val) => {
    setValuesStorage(prev => ({...prev, [key]: val}));
  }, []);

  if (loading) {
    return null;
  }

  let currListCliens =
    valuesStorage.type_client === 'g' ? listGroups : listStudents;
  let isDisabled = currListCliens.length === 0;

  return (
    <>
      <View style={Styles.seqLineHeader}></View>
      <View
        style={{
          ...Styles.container,
          backgroundColor: '#fff',
        }}>
        <ScrollView contentContainerStyle={{gap: 25}}>
          {/* День недели */}
          {optionsRef.current.type === 'view' ? (
            <Dropdown
              data={ITEMS_DAYS}
              value={valuesStorage.date[0]}
              editing={editing}
              label={'День недели'}
              requared={true}
              onChange={val => changeValue('date', [val])}
            />
          ) : (
            <MultiDropdown
              data={ITEMS_DAYS}
              value={valuesStorage.date}
              editing={editing}
              label={'День недели'}
              requared={true}
              onChange={val => changeValue('date', val)}
            />
          )}

          {/* Время начала */}
          <TimePicker
            value={valuesStorage.time_start}
            editing={editing}
            label={'Время начала'}
            labelEdit={'Время начала'}
            requared={true}
            onChange={val => changeValue('time_start', val)}
          />
          {/* Время окончания */}
          <TimePicker
            value={valuesStorage.time_end}
            editing={editing}
            label={'Время окончания'}
            labelEdit={'Время окончания'}
            requared={true}
            onChange={val => changeValue('time_end', val)}
          />
          {/* Тип занятия */}
          <Dropdown
            data={ITEMS_TYPE}
            value={valuesStorage.type_client}
            editing={editing}
            label={'Тип занятия'}
            requared={true}
            onChange={val => {
              setFlagTypeChange(prev => !prev);
              setValuesStorage(prev => ({
                ...prev,
                id_client: null,
                type_client: val,
              }));
            }}
          />
          {/* Клиент */}
          {valuesStorage.type_client ? (
            <Dropdown
              data={currListCliens}
              value={valuesStorage.id_client}
              editing={editing}
              label={'С кем будет занятие'}
              requared={true}
              flagUpdate={flagTypeChange}
              isDisabled={isDisabled}
              onChange={val => {
                let item = currListCliens.find(el => el.id == val);
                setValuesStorage(prev => ({
                  ...prev,
                  id_client: val,
                  diagnos: item.diagnos,
                  category: item.category,
                }));
              }}
            />
          ) : null}
          {/* Статичные данные только отображение */}
          {!editing ? (
            <>
              <DivDefaultRow
                label={'Возрастная группа'}
                value={valuesStorage.category}
              />
              <DivDefaultRow
                label={'Заключение ЦПМПК'}
                value={valuesStorage.diagnos}
              />
            </>
          ) : null}
          <View style={Styles.seqLineHeader}></View>
          {/* Заметки */}
          <Textarea
            editing={editing}
            value={valuesStorage.note}
            label={'Заметки'}
            onChange={id => changeValue('note', id)}
          />
        </ScrollView>
        <MenuActions
          visible={menuShow}
          callClose={() => setMenuShow(false)}
          callCopy={() => {
            navigation.pop();
            navigation.push('Timetable', {
              type: 'copy',
              id: optionsRef.current.id,
              template: optionsRef.current.template,
            });
          }}
          callDelete={() => removeConfirm(() => removeCard())}
          callChange={() => {
            setEditing(true);
            setNavChange();
          }}
          onCard={true}
        />
      </View>
    </>
  );
}
