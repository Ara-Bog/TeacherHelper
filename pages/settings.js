import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';

// компоненты
import SelectedList from '../components/selectedInList';
import RowSwitcher from '../components/elements/switcherInLine';
import LoadModal from '../components/loadingModal';
import Dropdown from '../components/form/dropdown';

// внешние действия
import {importFromJson, clearData} from '../actions/importDB';
import {exportToJson} from '../actions/exportDB';
import {setUserSetting} from '../actions/userSettings';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownsOpen: {
        firstScreen: false,
        typeSchedule: false,
        typeCards: false,
      },
      screens: [
        {name: 'Расписание', id: 'timetable'},
        {name: 'Ученики', id: 'students'},
        {name: 'Группы', id: 'groups'},
        {name: 'Настройки', id: 'settings'},
      ],
      temporaryTemplates: [...userSettings.templates],
      typesSchedule: [
        {name: 'Календарное', id: 'calendar'},
        {name: 'Еженедельное', id: 'week'},
      ],
      modalTemplates: false,
      loading: false,
    };
  }

  // закрытие остальных выпадающих списков
  // - выбранный список -- selectDD:String
  // - текущее значение выбранного списка -- val:Bool
  closeOtherDropDown(selectDD, val) {
    let newOpen = Object.fromEntries(
      Object.entries(this.state.dropDownsOpen).map(([key]) => [
        key,
        key === selectDD ? val : false,
      ]),
    );

    this.setState({dropDownsOpen: newOpen});
  }

  // поведение при загрузке другой базы
  async importDataBase() {
    // пикаем файл
    let pickerResult;
    // try  т.к. при закрытии пикера - он бросает исключение
    try {
      pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });
    } catch (e) {
      // пикер был закрыт, прерываем функцию
      return;
    }

    // проверка на то, что это json
    if (pickerResult.name.split('.')[1] != 'json') {
      Alert.alert('Ошибка загрузки', 'Файл должен иметь расширение .json!');
      return;
    }

    // запрос пользователю на необходимость удалить текущие данные
    saveCurrentData = new Promise((resolve, reject) => {
      Alert.alert(
        'Подтвердите действие',
        'При загрузке новых данных - старые будут удалены. Вы действительно хотите загрузить ?',
        [
          {
            text: 'Да',
            onPress: () => resolve(false),
          },
          // Отключена возможность оставить текущие данные
          // Не получится объеденить данные в расписании, т.к. записи могут падать на одно время
          // + разные виды расписания
          // {
          //   text: 'Нет',
          //   onPress: () => resolve(true),
          // },
          {
            text: 'Отмена',
            onPress: () => reject(),
            style: 'cancel',
          },
        ],
      );
    });

    // при выборе не cancel
    saveCurrentData.then(
      res => {
        // запуск окна загрузки
        this.setState({loading: true});
        // импорт через внешний файл
        let loadingData = importFromJson(pickerResult.fileCopyUri, res);
        // окончание завершения импорта смена статуса загрузки и увемодление
        loadingData
          .then(() => {
            this.setState({loading: false});
            Alert.alert('Данные успешно загружены!');
          })
          .catch(err => {
            this.setState({loading: false});
            Alert.alert('Произошла непредвиденная ошибка :(', err);
          });
      },
      () => {},
    );
  }

  // поведение при выгрузке базы
  async exportDataBase() {
    // загрузка...
    this.setState({loading: true});

    // выполняем экспорт, на выходе получаем промис и имя файла
    let [exportBase, fileName] = await exportToJson();
    exportBase
      .then(res => {
        // сброс загрузки
        this.setState({loading: false});
        Alert.alert(
          'Данные успешно выгруженны!',
          'Данные сохраненны в файл ' + fileName,
        );
      })
      .catch(() => {
        this.setState({loading: false});
        Alert.alert('Произошла непредвиденная ошибки.');
      });
  }

  // поведение при очистке базы
  async clearDataBase() {
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
      // Загрузка...
      this.setState({loading: true});

      // Получаем промис с очистки
      let actionCleaning = clearData();
      actionCleaning
        .then(() => {
          // сброс загрузки
          this.setState({loading: false});
          Alert.alert('Данные успешно очищены!');
        })
        .catch(() => {
          this.setState({loading: false});
          Alert.alert('Произошла непредвиденная ошибки.');
        });
    });
  }

  // закрытие модалки шаблонов и сброс параметров
  templatesModalExit() {
    this.setState({modalTemplates: false});
    this.setState({temporaryTemplates: [...userSettings.templates]});
  }

  // сохранение настроек
  saveSettings(key, val) {
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

    this.forceUpdate();
  }

  // генерация добавочного sql (для формирвания списков шаблонов)
  getAddedSql() {
    let val = '';
    if (this.state.temporaryTemplates.length === 0) {
      return '';
    }
    this.state.temporaryTemplates.forEach(item => {
      val += item.id + ',';
    });

    return 'WHERE id NOT IN (' + val.slice(0, -1) + ')';
  }

  // изменение вида карточек
  changeSizeCards(val) {
    // текущий список размеров
    let currentVals = [...userSettings.sizeCardAll];
    // поиск выбранного шаблона в списке
    findVal = currentVals.indexOf(val);
    if (findVal >= 0) {
      // убераем элемент из списка
      currentVals.splice(findVal, 1);
    } else {
      // добавляем элемент в список
      currentVals.push(val);
    }

    // если список не будет пуст, то данные сохранятся
    // один шаблон должен быть всегда активен
    if (currentVals.length != 0) {
      this.saveSettings('sizeCardAll', currentVals);
    }
  }

  // изменение вида расписание
  changeTypeSchedule(val, callback) {
    // много кода потому, что имеется визуальный баг
    // значение скидывается на нулевое во время Alert

    // Сохраняем первонаальное значение настроек
    let oldVal = userSettings['typeSchedule'];

    // если значение не поменялось, то и действий никаких не надо
    if (val == oldVal) {
      callback(false);
      return true;
    }

    // меняем значение сразу (чтобы визуально отображалось новое)
    this.saveSettings('typeSchedule', val);

    // получаем промис от пользователя, что он согласен, что расписание зачистится
    Alert.alert(
      'Подтвердите действие',
      'Изменение вида приведет к очистке расписания!',
      [
        {
          text: 'Продолжить',
          onPress: () => {
            // Загрузка...
            this.setState({loading: true});

            // Получаем промис с очистки
            let actionCleaning = clearData(['Timetable']);
            actionCleaning
              .then(() => {
                // сброс загрузки
                this.setState({loading: false});
                callback(true);
                Alert.alert('Данные успешно очищены!');
              })
              .catch(er => {
                this.setState({loading: false});
                Alert.alert('Произошла непредвиденная ошибки.');
                console.log('test err', er);
                this.saveSettings('typeSchedule', oldVal);
              });
          },
        },
        {
          text: 'Отмена',
          onPress: () => {
            // пользователь не согласился - возвращаем отказ
            this.saveSettings('typeSchedule', oldVal);
          },
          style: 'cancel',
        },
      ],
    );
  }

  render() {
    return (
      <View style={Styles.container}>
        <ScrollView
          overScrollMode={'always'}
          nestedScrollEnabled={true}
          contentContainerStyle={{gap: 25, flexGrow: 1}}>
          {/* баннер */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.tinkoff.ru/cf/1uakjigjJrq')
            }>
            <Image
              style={{width: '100%'}}
              source={require('../assets/baner.png')}
            />
          </TouchableOpacity>
          {/* первый экран */}
          <Dropdown
            data={this.state.screens}
            value={userSettings.firstScreen}
            editing={true}
            label={'Первый экран'}
            onChange={id => {
              this.saveSettings('firstScreen', id);
            }}
          />
          {/* вид расписания */}
          <Dropdown
            data={this.state.typesSchedule}
            value={userSettings.typeSchedule}
            editing={true}
            label={'Вид расписания'}
            // onChange={id => {
            //   this.changeTypeSchedule(id);
            // }}
            onConfirm={(id, callback) => this.changeTypeSchedule(id, callback)}
          />
          {/* шаблоны */}
          <View style={Styles.divDefault__edit}>
            <Text style={Styles.divDefaultLabel__edit}>Шаблоны</Text>
            <TouchableOpacity
              style={Styles.buttonDefault}
              onPress={() => this.setState({modalTemplates: true})}>
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
              onPress={() => this.changeSizeCards('small')}
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
              onPress={() => this.changeSizeCards('big')}
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
              onCallBack={val => this.saveSettings('showCategories', val)}
            />
            <RowSwitcher
              label="Раскрывать подкатегории"
              currentValue={userSettings.showSubCategories}
              onCallBack={val => this.saveSettings('showSubCategories', val)}
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
              onPress={() => this.exportDataBase()}>
              <Icons.AntDesign
                name="upload"
                size={20}
                color="#554AF0"
                style={{marginRight: 15}}
              />
              <Text style={Styles.buttonDefaultText}>Выгрузить данные</Text>
            </TouchableOpacity>
            {/* импорт */}
            <TouchableOpacity
              style={Styles.buttonDefault}
              onPress={() => this.importDataBase()}>
              <Icons.AntDesign
                name="download"
                size={20}
                color="#554AF0"
                style={{marginRight: 15}}
              />
              <Text style={Styles.buttonDefaultText}>Загрузить данные</Text>
            </TouchableOpacity>
            {/* очистка */}
            <TouchableOpacity
              style={Styles.buttonDefault}
              onPress={() => this.clearDataBase()}>
              <Icons.AntDesign
                name="delete"
                size={20}
                color="#DC5F5A"
                style={{marginRight: 15}}
              />
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
          isVisible={this.state.modalTemplates}
          onBackButtonPress={() => this.templatesModalExit()}
          onBackdropPress={() => this.templatesModalExit()}>
          <View style={Styles.modalDownWrap}>
            <SelectedList
              currentValues={userSettings.templates}
              sqlText={'SELECT id, name FROM Templates ' + this.getAddedSql()}
              sqlArgs={[]}
              labelCurrent="Выбранные шаблоны"
              labelPossible="Доступные шаблоны"
              onReturnData={data => {
                this.setState({temporaryTemplates: data});
              }}
            />
            <TouchableOpacity
              style={Styles.submitBtn}
              onPress={() => {
                this.saveSettings('templates', this.state.temporaryTemplates);
                this.setState({modalTemplates: false});
              }}>
              <Text style={Styles.submitBtnText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* заглушка фоновой загрузки */}
        <LoadModal status={this.state.loading} />
      </View>
    );
  }
}
