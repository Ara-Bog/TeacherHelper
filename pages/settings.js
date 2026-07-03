import React, {useState, useReducer, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import {
  pick,
  keepLocalCopy,
  types,
  errorCodes,
  isErrorWithCode,
} from '@react-native-documents/picker';
import Modal from '../components/elements/AppModal';

// компоненты
import SelectedList from '../components/form/selectedInList';
import RowSwitcher from '../components/elements/switcherInLine';
import LoadModal from '../components/loadingModal';
import Dropdown from '../components/form/dropdown';
import Slider from '../tutorial/Slider';

// внешние действия
import {importFromJson, clearData} from '../actions/importDB';
import {exportToJson} from '../actions/exportDB';
import {setUserSetting} from '../actions/userSettings';

const SCREENS = [
  {name: 'Расписание', id: 'timetable'},
  {name: 'Ученики', id: 'students'},
  {name: 'Группы', id: 'groups'},
  {name: 'Настройки', id: 'settings'},
];

const GROUP_BY = [
  {name: 'Без группировки', id: 'without'},
  {name: 'Возрастная группа', id: 'LeftBot'},
  {name: 'Шаблон', id: 'RightTop'},
  {name: 'Заключение ЦПМПК', id: 'RightBot'},
];

export default function Settings() {
  const [, forceRender] = useReducer(x => x + 1, 0);
  const [temporaryTemplates, setTemporaryTemplates] = useState([...userSettings.templates]);
  const [modalTemplates, setModalTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalTutorial, setModalTutorial] = useState(false);

  const saveSettings = useCallback((key, val) => {
    setUserSetting(key, val);
    if (key == 'sizeCardAll') {
      if (val.length == 1) {
        if (val[0] == 'big') {
          setUserSetting('bigCardStudent', true);
          setUserSetting('bigCardGroup', true);
          setUserSetting('bigCardTimetable', true);
        } else {
          setUserSetting('bigCardStudent', false);
          setUserSetting('bigCardGroup', false);
          setUserSetting('bigCardTimetable', false);
        }
      }
    }
    forceRender();
  }, []);

  const changeSizeCards = useCallback((val) => {
    let currentVals = [...userSettings.sizeCardAll];
    let findVal = currentVals.indexOf(val);
    if (findVal >= 0) {
      currentVals.splice(findVal, 1);
    } else {
      currentVals.push(val);
    }
    if (currentVals.length != 0) {
      saveSettings('sizeCardAll', currentVals);
    }
  }, [saveSettings]);

  const importDataBase = useCallback(async () => {
    let localUri;
    try {
      const [picked] = await pick({type: [types.json, types.allFiles]});

      if (!(picked.name || '').toLowerCase().endsWith('.json')) {
        Alert.alert('Ошибка загрузки', 'Файл должен иметь расширение .json!');
        return;
      }

      // Materialise a local copy so RNFS can read it (op-sqlite-agnostic).
      const [copy] = await keepLocalCopy({
        files: [{uri: picked.uri, fileName: picked.name ?? 'import.json'}],
        destination: 'cachesDirectory',
      });
      if (copy.status !== 'success') {
        Alert.alert('Ошибка загрузки', 'Не удалось прочитать файл.');
        return;
      }
      localUri = copy.localUri;
    } catch (e) {
      // User dismissing the picker is not an error.
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert('Ошибка загрузки', 'Не удалось выбрать файл.');
      return;
    }

    let saveCurrentData = new Promise((resolve, reject) => {
      Alert.alert(
        'Подтвердите действие',
        'При загрузке новых данных - старые будут удалены. Вы действительно хотите загрузить ?',
        [
          {
            text: 'Да',
            onPress: () => resolve(false),
          },
          {
            text: 'Отмена',
            onPress: () => reject(),
            style: 'cancel',
          },
        ],
      );
    });

    saveCurrentData.then(
      res => {
        setLoading(true);
        let loadingData = importFromJson(localUri, res);
        loadingData
          .then(() => {
            setLoading(false);
            Alert.alert('Данные успешно загружены!');
          })
          .catch(err => {
            clearData().then(() => {
              setLoading(false);
              Alert.alert('Произошла ошибка загрузки файла :(', err.message);
            });
          });
      },
      () => {},
    );
  }, []);

  const exportDataBase = useCallback(async () => {
    setLoading(true);
    let [exportBase, fileName] = await exportToJson();
    exportBase
      .then(res => {
        setLoading(false);
        Alert.alert(
          'Данные успешно выгруженны!',
          'Данные сохраненны в файл ' + fileName,
        );
      })
      .catch(() => {
        setLoading(false);
        Alert.alert('Произошла непредвиденная ошибки.');
      });
  }, []);

  const clearDataBase = useCallback(async () => {
    let confirmAction = new Promise((resolve, reject) => {
      Alert.alert(
        'Подтвердите действие',
        'Вы действительно хотите очистить ваши данные?',
        [
          {
            text: 'Да',
            onPress: () => resolve(),
          },
          {
            text: 'Нет',
            onPress: () => reject(),
            style: 'cancel',
          },
        ],
      );
    });

    confirmAction.then(() => {
      setLoading(true);
      let actionCleaning = clearData();
      actionCleaning
        .then(() => {
          setLoading(false);
          Alert.alert('Данные успешно очищены!');
        })
        .catch(() => {
          setLoading(false);
          Alert.alert('Произошла непредвиденная ошибки.');
        });
    });
  }, []);

  const templatesModalExit = useCallback(() => {
    setModalTemplates(false);
    setTemporaryTemplates([...userSettings.templates]);
  }, []);

  return (
    <View style={Styles.container}>
      <ScrollView
        overScrollMode={'always'}
        nestedScrollEnabled={true}
        contentContainerStyle={{gap: 25, flexGrow: 1}}>
        {/* Обучалка */}
        <View style={Styles.divDefault__edit}>
          <TouchableOpacity
            style={Styles.buttonDefault}
            onPress={() => setModalTutorial(true)}>
            <Text style={Styles.buttonDefaultText}>Посмотреть обучение</Text>
          </TouchableOpacity>
        </View>
        {/* первый экран */}
        <Dropdown
          data={SCREENS}
          value={userSettings.firstScreen}
          editing={true}
          label={'Первый экран'}
          onChange={id => saveSettings('firstScreen', id)}
        />
        {/* Группировка учеников */}
        <Dropdown
          data={GROUP_BY}
          value={userSettings.groupBy_Student}
          editing={true}
          label={'Группировка списка учеников'}
          onChange={id => saveSettings('groupBy_Student', id)}
        />
        {/* Группировка групп */}
        <Dropdown
          data={GROUP_BY}
          value={userSettings.groupBy_Group}
          editing={true}
          label={'Группировка списка групп'}
          onChange={id => saveSettings('groupBy_Group', id)}
        />
        {/* шаблоны */}
        <View style={Styles.divDefault__edit}>
          <Text style={Styles.divDefaultLabel__edit}>Шаблоны</Text>
          <TouchableOpacity
            style={Styles.buttonDefault}
            onPress={() => setModalTemplates(true)}>
            <Icons.Entypo name="documents" size={20} color={'#554AF0'} />
            <Text style={Styles.buttonDefaultText}>
              Изменить список шаблонов
            </Text>
          </TouchableOpacity>
        </View>
        {/* размер карточек */}
        <View style={Styles.divDefault__edit}>
          <Text style={Styles.divDefaultLabel__edit}>Размер карточек</Text>
          <TouchableOpacity
            onPress={() => changeSizeCards('small')}
            style={
              userSettings.sizeCardAll.includes('small')
                ? Styles.skeletonCard__active
                : Styles.skeletonCard
            }>
            <View
              style={
                userSettings.sizeCardAll.includes('small')
                  ? Styles.skeletonCardContentActive
                  : Styles.skeletonCardContent
              }>
              <View style={Styles.skeletonCardRow}>
                <View
                  style={{...Styles.skeletonCardEl, flex: 1, marginRight: 15}}
                />
                <View style={{...Styles.skeletonCardEl, flex: 3}} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeSizeCards('big')}
            style={
              userSettings.sizeCardAll.includes('big')
                ? Styles.skeletonCard__active
                : Styles.skeletonCard
            }>
            <View
              style={
                userSettings.sizeCardAll.includes('big')
                  ? Styles.skeletonCardContentActive
                  : Styles.skeletonCardContent
              }>
              <View style={Styles.skeletonCardRow}>
                <View
                  style={{...Styles.skeletonCardEl, flex: 1, marginRight: 15}}
                />
                <View style={{...Styles.skeletonCardEl, flex: 3}} />
              </View>
              <View style={{...Styles.skeletonCardRow, marginTop: 20}}>
                <View
                  style={{...Styles.skeletonCardEl, flex: 1, marginRight: 15}}
                />
                <View style={{...Styles.skeletonCardEl, flex: 1}} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Расскрытие категорий и подкатегорий */}
        <View style={Styles.divDefault__edit}>
          <Text style={Styles.divDefaultLabel__edit}>Карточка ученика</Text>
          <RowSwitcher
            label="Раскрывать категории"
            currentValue={userSettings.showCategories}
            onCallBack={val => saveSettings('showCategories', val)}
          />
          <RowSwitcher
            label="Раскрывать подкатегории"
            currentValue={userSettings.showSubCategories}
            onCallBack={val => saveSettings('showSubCategories', val)}
          />
        </View>
        {/* импорт/экспорт/очистка базы */}
        <View style={Styles.divDefault__edit}>
          <Text style={Styles.divDefaultLabel__edit}>
            Действия с данными приложения
          </Text>
          {/* экспорт */}
          <TouchableOpacity
            style={Styles.buttonDefault}
            onPress={() => exportDataBase()}>
            <Icons.AntDesign name="upload" size={20} color="#554AF0" />
            <Text style={Styles.buttonDefaultText}>Выгрузить данные</Text>
          </TouchableOpacity>
          {/* импорт */}
          <TouchableOpacity
            style={Styles.buttonDefault}
            onPress={() => importDataBase()}>
            <Icons.AntDesign name="download" size={20} color="#554AF0" />
            <Text style={Styles.buttonDefaultText}>Загрузить данные</Text>
          </TouchableOpacity>
          {/* очистка */}
          <TouchableOpacity
            style={Styles.buttonDefault}
            onPress={() => clearDataBase()}>
            <Icons.AntDesign name="delete" size={20} color="#DC5F5A" />
            <Text style={{...Styles.buttonDefaultText, color: '#DC5F5A'}}>
              Очистить данные
            </Text>
          </TouchableOpacity>
        </View>
        {/* пустое пространство */}
        <View style={Styles.crutch}></View>
      </ScrollView>
      {/* модалка для шаблонов */}
      <Modal
        style={{marginBottom: 0, marginLeft: 0, marginRight: 0}}
        isVisible={modalTemplates}
        onBackButtonPress={() => templatesModalExit()}
        onBackdropPress={() => templatesModalExit()}>
        <View style={Styles.modalDownWrap}>
          <SelectedList
            currentValues={userSettings.templates}
            sqlText={`SELECT id, name
              FROM Templates
              WHERE id NOT IN (${'?,'
                .repeat(temporaryTemplates.length)
                .slice(0, -1)})`}
            sqlArgs={temporaryTemplates.map(item => item.id)}
            labelCurrent="Выбранные шаблоны"
            labelPossible="Доступные шаблоны"
            onChange={data => setTemporaryTemplates(data)}
            editing={true}
          />
          <TouchableOpacity
            style={Styles.submitBtn}
            onPress={() => {
              saveSettings('templates', temporaryTemplates);
              setModalTemplates(false);
            }}>
            <Text style={Styles.submitBtnText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal style={{margin: 0}} isVisible={modalTutorial}>
        <View
          style={{width: '100%', height: '100%', backgroundColor: '#fff'}}>
          <Slider onClose={() => setModalTutorial(false)} />
        </View>
      </Modal>
      {/* заглушка фоновой загрузки */}
      <LoadModal status={loading} />
    </View>
  );
}
