import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View} from 'react-native';
import Dropdown from '../components/form/dropdown';
import {setUserSetting} from '../actions/userSettings';
import RowSwitcher from '../components/elements/switcherInLine';
import ListCards from '../components/listCards';
import {deleteTimetable, getTimetableList} from '../database/repositories/timetableRepo';
import {getDB} from '../database/connection';

const INITIAL_DAYS = [
  {name: 'Все дни', id: 'all', defaultName: 'Все дни'},
  {name: 'Понедельник', id: 'mon', defaultName: 'Понедельник', orderBy: 1},
  {name: 'Вторник', id: 'tue', defaultName: 'Вторник', orderBy: 2},
  {name: 'Среда', id: 'wen', defaultName: 'Среда', orderBy: 3},
  {name: 'Четверг', id: 'thu', defaultName: 'Четверг', orderBy: 4},
  {name: 'Пятница', id: 'fri', defaultName: 'Пятница', orderBy: 5},
  {name: 'Суббота', id: 'sat', defaultName: 'Суббота', orderBy: 6},
  {name: 'Воскресенье', id: 'sun', defaultName: 'Воскресенье', orderBy: 7},
];

export default function TimetableWrap({navigation}) {
  const [dataFiltered, setDataFiltered] = useState([]);
  const [itemsDays, setItemsDays] = useState(INITIAL_DAYS);
  const [bigSizeCards, setBigSizeCards] = useState(userSettings.bigCardTimetable);
  const [loading, setLoading] = useState(true);

  const defaultDataRef = useRef([]);
  const selectDayRef = useRef('all');

  const updateCounter = useCallback((data, days) => {
    let counter = {all: 0, mon: 0, tue: 0, wen: 0, thu: 0, fri: 0, sat: 0, sun: 0};
    data.forEach(item => {
      counter.all += 1;
      counter[item.date] += 1;
    });
    let newData = (days || itemsDays).map(item => ({
      ...item,
      name: item.defaultName + ` (${counter[item.id]})`,
    }));
    setItemsDays(newData);
    return newData;
  }, [itemsDays]);

  const setFilter = useCallback((day, data) => {
    selectDayRef.current = day;
    let source = data || defaultDataRef.current;
    let newData;

    if (day === 'all') {
      newData = [...source];
    } else {
      newData = source.filter(item => item.date === day);
    }
    setDataFiltered(newData);
    updateCounter(newData);
  }, [updateCounter]);

  const getData = useCallback(() => {
    const db = getDB();
    db.transaction(tx => {
      getTimetableList(tx, data => {
        defaultDataRef.current = [...data];
        let updatedDays = updateCounter(data, INITIAL_DAYS);
        setDataFiltered([...data]);
        setLoading(false);
        // Apply current filter
        let day = selectDayRef.current;
        if (day !== 'all') {
          let filtered = data.filter(item => item.date === day);
          setDataFiltered(filtered);
          updateCounter(filtered, updatedDays);
        }
      });
    });
  }, [updateCounter]);

  useEffect(() => {
    let resetFilters = false;
    const tabUnsub = navigation.getParent('mainTab').addListener('tabPress', () => {
      resetFilters = true;
    });
    const focusUnsub = navigation.addListener('focus', () => {
      setBigSizeCards(userSettings.bigCardTimetable);
      if (resetFilters) {
        selectDayRef.current = 'all';
        setLoading(true);
        resetFilters = false;
      }
      getData();
    });

    return () => {
      tabUnsub();
      focusUnsub();
    };
  }, [navigation, getData]);

  const removeCard = async currentList => {
    await currentList.forEach(id => deleteTimetable(id));
    defaultDataRef.current = defaultDataRef.current.filter(
      item => !currentList.includes(item.ID),
    );
    setFilter(selectDayRef.current);
  };

  if (loading) {
    return null;
  }

  return (
    <View style={Styles.container}>
      <View style={{gap: 15, marginBottom: 30}}>
        <Dropdown
          data={itemsDays}
          value={selectDayRef.current}
          placeholder="Выберите день недели"
          editing={true}
          onChange={id => setFilter(id)}
        />
        {userSettings.sizeCardAll.length == 2 ? (
          <RowSwitcher
            label="Расширенные карточки"
            currentValue={bigSizeCards}
            onCallBack={val => {
              setUserSetting('bigCardTimetable', val);
              setBigSizeCards(val);
            }}
          />
        ) : null}
      </View>
      <ListCards
        onCallDeleteData={currentList => removeCard(currentList)}
        data={dataFiltered}
        bigSizeCards={bigSizeCards}
        typeData={'Timetable'}
        navigation={navigation}
        groupLabels={itemsDays}
        isGroup={selectDayRef.current === 'all' ? 'date' : 'without'}
      />
    </View>
  );
}
