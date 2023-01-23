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
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
// настройки пользователя
import {setUserSetting} from '../actions/userSettings';
import SelectedList from '../components/elements/modalSelectedInList';
import Modal from 'react-native-modal';
import RowSwitcher from '../components/elements/switcherInLine';

//
import {importFromJson} from '../actions/importDB';
import {exportToJson} from '../actions/exportDB';

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
        {label: 'Расписание', value: 'timetable'},
        {label: 'Ученики', value: 'students'},
        {label: 'Группы', value: 'groups'},
        {label: 'Настройки', value: 'settings'},
      ],
      temporaryTemplates: [...userSettings.templates],
      typesSchedule: [
        {label: 'Календарное', value: 'calendar'},
        {label: 'Еженедельное', value: 'week'},
      ],
      modalTemplates: false,
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

  exportDataBase() {
    exportToJson();
  }

  async importDataBase() {
    const pickerResult = await DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
    });

    saveCurrentData = new Promise((resolve, reject) => {
      Alert.alert('Выберите действие', 'Что делать с текущими данными?', [
        {
          text: 'Оставить',
          onPress: () => resolve(true),
        },
        {
          text: 'Удалить',
          onPress: () => resolve(false),
        },
        {
          text: 'Отмена',
          onPress: () => reject(),
          style: 'cancel',
        },
      ]);
    });
    saveCurrentData.then(
      res => importFromJson(pickerResult.fileCopyUri, res),
      () => console.log('Canceled'),
    );
  }

  // закрытие модалки шаблонов и сброс параметров
  templatesModalExit() {
    this.setState({modalTemplates: false});
    this.setState({temporaryTemplates: [...userSettings.templates]});
  }

  // сохранение настроек
  saveSettings(key, val) {
    userSettings[key] = val;
    setUserSetting(key, val);
    this.forceUpdate();
  }

  // генерация добавочного sql
  getAddedSql() {
    let val = '(';
    if (this.state.temporaryTemplates.length === 0) {
      return '';
    }
    this.state.temporaryTemplates.forEach((item, index) => {
      val += item.id + ',';
    });

    return 'WHERE id NOT IN' + val.slice(0, -1) + ')';
  }

  // изменение вида карточек
  changeSizeCards(val) {
    let currentVals = [...userSettings.sizeCardAll];
    findVal = currentVals.indexOf(val);
    if (findVal >= 0) {
      currentVals.splice(findVal, 1);
    } else {
      currentVals.push(val);
    }
    if (currentVals.length != 0) {
      this.saveSettings('sizeCardAll', currentVals);
    }
  }

  render() {
    return (
      <View style={Styles.container}>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}>
          {/* баннер */}
          <TouchableOpacity
            style={{
              marginBottom: 20,
            }}
            onPress={() =>
              Linking.openURL('https://github.com/Ara-Bog?tab=repositories')
            }>
            <Image source={require('../assets/baner.png')} />
          </TouchableOpacity>
          {/* первый экран */}
          <View style={Styles.cardDefaultRow_edit}>
            <Text style={Styles.cardDefaultLabel}>Первый экран</Text>
            <DropDownPicker
              zIndex={12}
              open={this.state.dropDownsOpen.firstScreen}
              value={userSettings.firstScreen}
              items={this.state.screens}
              setOpen={val => this.closeOtherDropDown('firstScreen', val)}
              setValue={callback => saveSettings('firstScreen', callback())}
              listMode="SCROLLVIEW"
              style={Styles.dropDown}
              dropDownContainerStyle={Styles.dropDownBox}
            />
          </View>
          {/* шаблоны */}
          <View style={Styles.cardDefaultRow_edit}>
            <Text style={Styles.cardDefaultLabel}>Шаблоны</Text>
            <TouchableOpacity
              style={Styles.buttonDefault}
              onPress={() => this.setState({modalTemplates: true})}>
              <Icons.Entypo
                name="documents"
                size={20}
                color={'#554AF0'}
                style={{marginRight: 15}}
              />
              <Text style={Styles.buttonDefaultText}>
                Изменить список шаблонов
              </Text>
            </TouchableOpacity>
          </View>
          {/* вид расписания */}
          <View style={Styles.cardDefaultRow_edit}>
            <Text style={Styles.cardDefaultLabel}>Вид расписания</Text>
            <DropDownPicker
              zIndex={11}
              open={this.state.dropDownsOpen.typeSchedule}
              value={userSettings.typeSchedule}
              items={this.state.typesSchedule}
              setOpen={val => this.closeOtherDropDown('typeSchedule', val)}
              setValue={callback => saveSettings('typeSchedule', callback())}
              listMode="SCROLLVIEW"
              style={Styles.dropDown}
              dropDownContainerStyle={Styles.dropDownBox}
            />
          </View>
          {/* размер карточек */}
          <View style={Styles.cardDefaultRow_edit}>
            <Text style={Styles.cardDefaultLabel}>Размер карточек</Text>
            <TouchableOpacity
              onPress={() => this.changeSizeCards('small')}
              style={
                userSettings.sizeCardAll.includes('small')
                  ? Styles.SkeletonCardActive
                  : Styles.SkeletonCard
              }>
              <View
                style={
                  userSettings.sizeCardAll.includes('small')
                    ? Styles.SkeletonCardContentActive
                    : Styles.SkeletonCardContent
                }>
                <View style={Styles.SkeletonCardRow}>
                  <View
                    style={{...Styles.SkeletonCardEl, flex: 1, marginRight: 15}}
                  />
                  <View style={{...Styles.SkeletonCardEl, flex: 3}} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.changeSizeCards('big')}
              style={
                userSettings.sizeCardAll.includes('big')
                  ? Styles.SkeletonCardActive
                  : Styles.SkeletonCard
              }>
              <View
                style={
                  userSettings.sizeCardAll.includes('big')
                    ? Styles.SkeletonCardContentActive
                    : Styles.SkeletonCardContent
                }>
                <View style={Styles.SkeletonCardRow}>
                  <View
                    style={{...Styles.SkeletonCardEl, flex: 1, marginRight: 15}}
                  />
                  <View style={{...Styles.SkeletonCardEl, flex: 3}} />
                </View>
                <View style={{...Styles.SkeletonCardRow, marginTop: 20}}>
                  <View
                    style={{...Styles.SkeletonCardEl, flex: 1, marginRight: 15}}
                  />
                  <View style={{...Styles.SkeletonCardEl, flex: 1}} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* Расскрытие категорий и подкатегорий */}
          <View style={Styles.cardDefaultRow_edit}>
            <Text style={Styles.cardDefaultLabel}>Карточка ученика</Text>
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
          {/* импорт/экспорт базы */}
          <View style={Styles.cardDefaultRow_edit}>
            <Text style={Styles.cardDefaultLabel}>
              Действия с данными приложения
            </Text>
            <TouchableOpacity onPress={() => this.exportDataBase()}>
              <Text>ЭКСПОРТ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.importDataBase()}>
              <Text>ИМПОРТ</Text>
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
          <View style={Styles.ModalDownWrap}>
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
      </View>
    );
  }
}
