import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';
import ListCards from '../components/listCards';
import SearchBar from '../components/elements/searchBar';
import {setUserSetting} from '../actions/userSettings';
import RowSwitcher from '../components/elements/switcherInLine';
import {deleteStudent, getStudentsList} from '../database/repositories/studentRepo';
import {getDB} from '../database/connection';

export default function ListStudentsWrap({navigation, route}) {
  const [dataStudents, setDataStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bigSizeCards, setBigSizeCards] = useState(userSettings.bigCardStudent);

  const defaultDataRef = useRef([]);
  const filterDataRef = useRef([]);
  const filterUsedRef = useRef(false);
  const currentSearchRef = useRef('');
  const currentFilterRef = useRef({
    'Возрастная группа': [],
    Шаблон: [],
    'Заключение ЦПМПК': [],
  });
  const showLabelsRef = useRef([]);

  // добавление кнопки фильтра
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Filter', {
              currentFilter: currentFilterRef.current,
              showLabels: showLabelsRef.current,
              pageBack: 'ListStudents',
            })
          }>
          <Icons.Ionicons name="filter" color="#554AF0" size={25} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const search = useCallback((val, data, defaultData, filterUsed) => {
    let newData;
    let tempTitle;

    if (val.length > 0) {
      newData = data.filter(
        item => item.LeftTop.toLowerCase().indexOf(val.toLowerCase()) != -1,
      );
      tempTitle = `Ученики (${newData.length}/${defaultData.length})`;
    } else {
      newData = [...data];
      if (filterUsed) {
        tempTitle = `Ученики (${newData.length}/${defaultData.length})`;
      } else {
        tempTitle = `Ученики (${defaultData.length})`;
      }
    }

    setDataStudents(newData);
    navigation.setOptions({title: tempTitle});
  }, [navigation]);

  const setFilters = useCallback(() => {
    if (route.params === undefined) {
      filterDataRef.current = [...defaultDataRef.current];
      search(currentSearchRef.current, filterDataRef.current, defaultDataRef.current, false);
      return;
    }

    let currentValues = route.params.listChecked;
    let newData;

    if (Object.values(currentValues).flat().length > 0) {
      newData = defaultDataRef.current.filter(
        item =>
          currentValues['Возрастная группа'].includes(item.LeftBot_id) ||
          currentValues['Шаблон'].includes(item.RightTop_id) ||
          currentValues['Заключение ЦПМПК'].includes(item.RightBot_id),
      );
      filterUsedRef.current = true;
    } else {
      newData = [...defaultDataRef.current];
      filterUsedRef.current = false;
    }

    filterDataRef.current = newData;
    showLabelsRef.current = [...route.params.showLabels];
    currentFilterRef.current = currentValues;
    setDataStudents(newData);

    search(currentSearchRef.current, newData, defaultDataRef.current, filterUsedRef.current);
  }, [route.params, search]);

  const getData = useCallback(() => {
    const db = getDB();
    db.transaction(tx => {
      getStudentsList(tx, data => {
        defaultDataRef.current = data;
        filterDataRef.current = data;
        setDataStudents(data);
        setLoading(false);
        navigation.setOptions({title: `Ученики (${data.length})`});
        // use setTimeout to allow state to settle before filtering
        setTimeout(() => setFilters(), 0);
      });
    });
  }, [navigation, setFilters]);

  useEffect(() => {
    let resetFilters = false;
    const tabUnsub = navigation.getParent('mainTab').addListener('tabPress', () => {
      resetFilters = true;
    });
    const focusUnsub = navigation.addListener('focus', () => {
      setBigSizeCards(userSettings.bigCardStudent);
      if (resetFilters) {
        route.params = undefined;
        showLabelsRef.current = [];
        filterUsedRef.current = false;
        currentSearchRef.current = '';
        currentFilterRef.current = {
          'Возрастная группа': [],
          Шаблон: [],
          'Заключение ЦПМПК': [],
        };
        setLoading(true);
        resetFilters = false;
      }
      getData();
    });

    return () => {
      tabUnsub();
      focusUnsub();
    };
  }, [navigation, route, getData]);

  const removeCard = async currentList => {
    await currentList.forEach(id => deleteStudent(id));
    defaultDataRef.current = defaultDataRef.current.filter(
      item => !currentList.includes(item.ID),
    );
    setFilters();
  };

  if (loading) {
    return null;
  }

  return (
    <View style={Styles.container}>
      <View style={{gap: 10, marginBottom: 30}}>
        <SearchBar
          value={currentSearchRef.current}
          onChange={val => {
            currentSearchRef.current = val;
            search(val, filterDataRef.current, defaultDataRef.current, filterUsedRef.current);
          }}
        />
        {userSettings.sizeCardAll.length === 2 ? (
          <RowSwitcher
            label="Расширенные карточки"
            currentValue={bigSizeCards}
            onCallBack={val => {
              setUserSetting('bigCardStudent', val);
              setBigSizeCards(val);
            }}
          />
        ) : null}
      </View>
      <ListCards
        onCallDeleteData={currentList => removeCard(currentList)}
        data={dataStudents}
        bigSizeCards={bigSizeCards}
        typeData={'Student'}
        navigation={navigation}
      />
    </View>
  );
}
