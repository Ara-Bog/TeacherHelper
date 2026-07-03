import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Alert, BackHandler} from 'react-native';
import SubTab from '../components/generatorPages';
import PagerView from 'react-native-pager-view';
import NavPage from '../components/elements/navPage';
import setHeaderNavigation from '../actions/changeHeader';
import MenuActions from '../components/menuActions';
import {
  saveConfirm,
  removeConfirm,
  undoConfirm,
  undoCreate,
} from '../actions/confirmAction';
import {getDiagnoses} from '../database/repositories/studentRepo';
import {
  getGroupMembers,
  getGroupById,
  createGroup,
  updateGroup,
  saveGroupMembers,
  deleteGroup,
} from '../database/repositories/groupRepo';
import {getDB} from '../database/connection';
import useBackHandler from '../hooks/useBackHandler';

export default function GroupPage({route, navigation}) {
  const optionsRef = useRef({...route.params});
  const pageViewerRef = useRef(null);

  const [editing, setEditing] = useState(optionsRef.current.type !== 'view');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuShow, setMenuShow] = useState(false);

  const [sections] = useState([
    {
      id: 1,
      name: 'default_main',
      show_label: null,
      tab_name: 'Общие сведения',
      footer: null,
    },
    {
      id: 2,
      name: 'default_list',
      show_label: null,
      tab_name: 'Состав',
      footer: null,
    },
  ]);

  const defaultDataRef = useRef({
    default_main: {
      name: {
        label: 'Название',
        requared: true,
        type: 'inputView',
      },
      category: {
        label: 'Возрастная группа',
        requared: true,
        type: 'droplist',
      },
      diagnos: {
        label: 'Заключение ЦПМПК',
        requared: true,
        type: 'droplist',
      },
    },
    default_list: {
      list: {
        label: '',
        type: 'selectedInList',
        props: {
          sqlText: `
          SELECT st.id,
              st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as name
          FROM Students as st
          WHERE st.id NOT IN (?) AND id_template = ?
          `,
          sqlArgs: ['', route.params.template.id],
          labelCurrent: 'Выбранные ученики',
          labelPossible: 'Общий список учеников',
        },
      },
    },
  });

  const valuesStorageRef = useRef({list: []});
  const currentDataRef = useRef({list: []});

  const setNavView = useCallback(() => {
    setHeaderNavigation({
      mainTitle: 'Карточка группы',
      addedTitle: optionsRef.current.template.name,
      onPressRight: () => setMenuShow(true),
      navigation: navigation,
      mode: 'menu',
    });
  }, [navigation]);

  const confirmEdit = useCallback(() => {
    let flagError = false;
    const defaultMain = defaultDataRef.current.default_main;
    for (const key of Object.keys(defaultMain)) {
      if (defaultMain[key].requared) {
        if (valuesStorageRef.current[key] == undefined) {
          flagError = true;
          break;
        }
      }
    }

    if (flagError) {
      Alert.alert(
        'Ошибка ввода',
        `Поля со звездочкой должны быть обязательно заполненны`,
        [{text: 'Ок', style: 'destructive'}],
        {cancelable: true},
      );
      return;
    }

    currentDataRef.current = JSON.parse(JSON.stringify(valuesStorageRef.current));
    const data = currentDataRef.current;

    (async () => {
      if (optionsRef.current.type != 'view') {
        let newId = await createGroup(data, optionsRef.current.template.id);
        optionsRef.current.id = newId;
        optionsRef.current.type = 'view';
      } else {
        await updateGroup(data, optionsRef.current.id);
      }

      await saveGroupMembers(optionsRef.current.id, currentDataRef.current.list);
      Alert.alert('Данные успешно обновлены!');
      setNavView();
      setEditing(false);
    })();
  }, [setNavView]);

  const setNavChange = useCallback(() => {
    setHeaderNavigation({
      mainTitle: 'Редактирование группы',
      addedTitle: optionsRef.current.template.name,
      onPressRight: () => saveConfirm(() => confirmEdit()),
      onPressLeft: () => {
        undoConfirm(() => {
          valuesStorageRef.current = JSON.parse(
            JSON.stringify(currentDataRef.current),
          );
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
        valuesStorageRef.current = JSON.parse(
          JSON.stringify(currentDataRef.current),
        );
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
    let getGroupFlag = currentType != 'add';

    switch (currentType) {
      case 'view':
        setNavView();
        break;
      case 'add':
        setHeaderNavigation({
          mainTitle: 'Новая группа',
          addedTitle: optionsRef.current.template.name,
          onPressRight: () => saveConfirm(() => confirmEdit()),
          onPressLeft: () => undoCreate(() => navigation.goBack()),
          navigation: navigation,
          mode: 'edit',
        });
        break;
      case 'copy':
        setHeaderNavigation({
          mainTitle: 'Копия группы',
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
      getDiagnoses(tx, optionsRef.current.template.id, data => {
        defaultDataRef.current.default_main.diagnos.values = data;
      });

      tx.executeSql(
        'SELECT * FROM Categories',
        [],
        (_, {rows}) => {
          defaultDataRef.current.default_main.category.values = rows.raw();
          if (!getGroupFlag) {
            setLoading(false);
          }
        },
        err => console.log('error groupPage get Categories', err),
      );

      if (getGroupFlag) {
        getGroupMembers(tx, optionsRef.current.id, data => {
          let dataString = JSON.stringify(data);
          currentDataRef.current.list = JSON.parse(dataString);
          valuesStorageRef.current.list = JSON.parse(dataString);

          let propsList = defaultDataRef.current.default_list.list.props;
          let list_Ids = JSON.parse(dataString).map(item => item.id);

          propsList.sqlText = propsList.sqlText.replace(
            '?',
            `?,`.repeat(list_Ids.length).slice(0, -1),
          );
          propsList.sqlArgs.shift();
          propsList.sqlArgs.unshift(...list_Ids);
        });

        getGroupById(tx, optionsRef.current.id, data => {
          let stringJson = JSON.stringify(data);
          currentDataRef.current = {
            ...currentDataRef.current,
            ...JSON.parse(stringJson),
          };
          valuesStorageRef.current = {
            ...valuesStorageRef.current,
            ...JSON.parse(stringJson),
          };
          setLoading(false);
        });
      }
    });
  }, []);

  const removeCard = useCallback(async () => {
    await deleteGroup(optionsRef.current.id);
    Alert.alert('Карточка успешно удалена!');
    navigation.pop();
  }, [navigation]);

  if (loading) {
    return null;
  }

  return (
    <>
      {/* верхняя навигация подстраниц */}
      <NavPage
        values={sections}
        selected={selectedPageIndex}
        onSelect={index => pageViewerRef.current.setPage(index)}
      />
      <PagerView
        style={{flex: 1}}
        initialPage={0}
        ref={pageViewerRef}
        onPageSelected={e => setSelectedPageIndex(e.nativeEvent.position)}>
        {sections.map(item => {
          const assignData = {
            ...defaultDataRef.current[item.name],
          };
          return (
            <SubTab
              key={item.id}
              footer={Boolean(item.footer)}
              lable={item.show_label ? item.name : null}
              data={assignData}
              currentData={valuesStorageRef.current}
              editing={editing}
              indexParent={item.id}
              navigation={navigation}
            />
          );
        })}
      </PagerView>
      {/* меню действий с карточкой */}
      <MenuActions
        visible={menuShow}
        callClose={() => setMenuShow(false)}
        callCopy={() => {
          navigation.pop();
          navigation.push('Group', {
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
    </>
  );
}
