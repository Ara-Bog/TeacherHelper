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
import {
  destructStudentCardData,
  getSections,
  getSymptomsStructure,
  getDiagnoses,
  getCategories,
  getCurrentSymptoms,
  getStudentById,
  getParents,
  getStudentGroups,
  createStudent,
  updateStudent,
  saveStudentRelatedData,
  deleteStudent,
} from '../database/repositories/studentRepo';
import {getDB} from '../database/connection';
import useBackHandler from '../hooks/useBackHandler';

export default function StudentPage({route, navigation}) {
  const optionsRef = useRef({...route.params});
  const pageViewerRef = useRef(null);

  const [editing, setEditing] = useState(optionsRef.current.type !== 'view');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuShow, setMenuShow] = useState(false);

  const [sections, setSections] = useState([]);

  const defaultDataRef = useRef({
    default_main: {
      surname: {
        label: 'Фамилия',
        requared: true,
        type: 'inputView',
      },
      name: {label: 'Имя', requared: true, type: 'inputView'},
      midname: {label: 'Отчество', type: 'inputView'},
      date_bd: {
        label: 'Возраст',
        labelEdit: 'Дата рождения',
        type: 'dateTime-date',
      },
      group_org: {
        label: 'Группа в организации',
        type: 'inputView',
      },
      groups: {
        label: 'Группы',
        type: 'viewLinks',
        last: true,
        template: route.params.template,
      },
      diagnos: {
        label: 'Заключение ЦПМПК',
        requared: true,
        type: 'droplist',
      },
      category: {
        label: 'Возрастная группа',
        requared: true,
        type: 'droplist',
      },
      note: {label: 'Заметки', type: 'textarea', last: true},
    },
    default_contacts: {
      contacts: {
        label: '',
        type: 'dynamicBlock',
        element: 'contactCard',
        defStruct: {name: true, type: false, phone: true},
      },
    },
  });

  const sectionsDataRef = useRef({});
  const valuesStorageRef = useRef({contacts: {}, symptoms: {}, groups: []});
  const currentDataRef = useRef({contacts: {}, symptoms: {}, groups: []});

  const setNavView = useCallback(() => {
    setHeaderNavigation({
      mainTitle: 'Карточка ученика',
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

    if (!flagError) {
      let massRequired = [];
      let fields = defaultDataRef.current.default_contacts.contacts.defStruct;
      Object.keys(fields).forEach(keyItem => {
        if (fields[keyItem]) {
          massRequired.push(keyItem);
        }
      });
      Object.values(valuesStorageRef.current.contacts).forEach(block => {
        massRequired.forEach(itemReq => {
          if (block[itemReq] == undefined) {
            flagError = true;
            return;
          }
          if (flagError) return;
        });
      });
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
        let newId = await createStudent(data, optionsRef.current.template.id);
        optionsRef.current.id = newId;
        optionsRef.current.type = 'view';
      } else {
        await updateStudent(data, optionsRef.current.id);
      }

      await saveStudentRelatedData(
        optionsRef.current.id,
        currentDataRef.current.contacts,
        currentDataRef.current.symptoms,
      );

      Alert.alert('Данные успешно обновлены!');
      setNavView();
      setEditing(false);
    })();
  }, [setNavView]);

  const setNavChange = useCallback(() => {
    setHeaderNavigation({
      mainTitle: 'Редактирование карточки',
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
    let getStudent = currentType != 'add';

    switch (currentType) {
      case 'view':
        setNavView();
        break;
      case 'add':
        setHeaderNavigation({
          mainTitle: 'Новая карточка',
          addedTitle: optionsRef.current.template.name,
          onPressRight: () => saveConfirm(() => confirmEdit()),
          onPressLeft: () => undoCreate(() => navigation.goBack()),
          navigation: navigation,
          mode: 'edit',
        });
        break;
      case 'copy':
        setHeaderNavigation({
          mainTitle: 'Копия карточки',
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
      getSections(tx, optionsRef.current.template.id, data => {
        setSections(data);
      });

      getSymptomsStructure(tx, optionsRef.current.template.id, data => {
        sectionsDataRef.current = {
          ...sectionsDataRef.current,
          ...data,
        };
      });

      getDiagnoses(tx, optionsRef.current.template.id, data => {
        defaultDataRef.current.default_main.diagnos.values = data;
      });

      getCategories(tx, data => {
        defaultDataRef.current.default_main.category.values = data;
        if (!getStudent) {
          setLoading(false);
        }
      });

      if (getStudent) {
        getCurrentSymptoms(tx, optionsRef.current.id, data => {
          let stringJson = JSON.stringify(data);
          currentDataRef.current.symptoms = JSON.parse(stringJson);
          valuesStorageRef.current.symptoms = JSON.parse(stringJson);
        });

        getStudentById(tx, optionsRef.current.id, data => {
          let stringJson = JSON.stringify(data);
          currentDataRef.current = {
            ...currentDataRef.current,
            ...JSON.parse(stringJson),
          };
          valuesStorageRef.current = {
            ...valuesStorageRef.current,
            ...JSON.parse(stringJson),
          };
        });

        getParents(tx, optionsRef.current.id, contacts => {
          let stringJson = JSON.stringify(contacts);
          currentDataRef.current.contacts = JSON.parse(stringJson);
          valuesStorageRef.current.contacts = JSON.parse(stringJson);
        });

        getStudentGroups(tx, optionsRef.current.id, groups => {
          let stringJson = JSON.stringify(groups);
          currentDataRef.current.groups = JSON.parse(stringJson);
          valuesStorageRef.current.groups = JSON.parse(stringJson);
          setLoading(false);
        });
      }
    });
  }, []);

  const removeCard = useCallback(async () => {
    await deleteStudent(optionsRef.current.id);
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
      {/* слайдер страниц */}
      <PagerView
        style={{flex: 1}}
        initialPage={0}
        ref={pageViewerRef}
        onPageSelected={e => setSelectedPageIndex(e.nativeEvent.position)}>
        {sections.map(item => {
          const assignData = {
            ...defaultDataRef.current[item.name],
            ...sectionsDataRef.current[item.id],
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
          navigation.push('Student', {
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
