import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AddingButton from '../components/elements/buttonAdd';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
import EmptyData from '../components/emptyDataList';

DropDownPicker.setLanguage('RU');

export default class TimetableWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFormProp: {
        Client_id: '',
        Day: '',
        Time: '',
        Type: '',
        ID: '',
      },
      dataToDay: [],
      editing: false,
      openSelectDays: false,
      selectDay: '',
      modalVisible: false,
      changedItem: null,
      itemsDays: [
        {label: 'Понедельник', value: 'mon'},
        {label: 'Вторник', value: 'tue'},
        {label: 'Среда', value: 'wen'},
        {label: 'Четверг', value: 'thu'},
        {label: 'Пятница', value: 'fri'},
        {label: 'Четверг', value: 'sat'},
        {label: 'Пятница', value: 'sun'},
      ],
    };
    this.setValue = this.setValue.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setItems = this.setItems.bind(this);

    // добавить куда-нибудь
    // // тестовая выборка
    // let asd = [
    //   {date: '01/23/2023', id: 1},
    //   {date: '01/24/2023', id: 2},
    //   {date: '01/25/2023', id: 3},
    //   {date: '01/26/2023', id: 4},
    //   {date: '01/27/2023', id: 5},
    //   {date: '01/28/2023', id: 6},
    //   {date: '01/29/2023', id: 7},
    //   {date: '01/23/2023', id: 8},
    //   {date: '01/24/2023', id: 9},
    //   {date: '01/25/2023', id: 10},
    //   {date: '01/26/2023', id: 11},
    //   {date: '01/27/2023', id: 12},
    //   {date: '01/28/2023', id: 13},
    //   {date: '01/29/2023', id: 14},
    // ];
    // // новый список
    // let newList = {};
    // // форматер даты к виду заголовков
    // let formater = new Intl.DateTimeFormat('ru-RU', {
    //   weekday: 'long',
    //   month: 'long',
    //   day: 'numeric',
    // });
    // // перебор тестовой выборки
    // asd.forEach(item => {
    // // создание новой даты по объектам из выборки
    //   let newDate = new Date(item.date);
    // // применение форматера
    //   let formatedDate = formater.format(newDate);
    // // костыль, чтобы первая буква была в верхнем регистре
    //   formatedDate = formatedDate[0].toUpperCase() + formatedDate.slice(1);
    // // если ключ еще не создан = создаст с пустым массивом
    //   newList[formatedDate] ??= [];
    // // добавления объекта в соответствующую дату
    //   newList[formatedDate].push(item);
    // });
  }

  // componentDidMount() {
  //     this.props.navigation.addListener('focus', () => this.getData(this.state.selectDay));
  // }

  setOpen(open) {
    this.setState({
      openSelectDays: open,
    });
  }

  setValue(callback) {
    this.setState(state => ({
      selectDay: callback(state.value),
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      itemsDays: callback(state.items),
    }));
  }

  // getData(selectDay) {
  //     db.transaction((tx) => {
  //         tx.executeSql(
  //         "SELECT tt.id, tt.time, gr.name, dg.name as Diagnos, ct.name as Categori, 'g' as Type, tt.client_id as Client_id "
  //         +"FROM Timetable as tt, Diagnosis as dg, Categories as ct "
  //         +"INNER JOIN Groups as gr On gr.id = tt.client_id AND gr.diagnos_id = dg.id WHERE tt.Type = 'g' AND gr.categori_id = ct.id AND tt.day = ? "
  //         +"UNION "
  //         +"SELECT tt.id, tt.time, st.name || ' ' || st.surname as name, dg.name as Diagnos, ct.name as Categori, 's' as Type, tt.client_id as Client_id "
  //         +"FROM Timetable as tt, Diagnosis as dg, Categories as ct "
  //         +"INNER JOIN students as st On st.id = tt.client_id AND st.diagnos_id = dg.id WHERE tt.Type = 's' AND st.categori_id = ct.id AND tt.day = ?",
  //         [selectDay, selectDay],
  //         (_, {rows:{_array}}) => this.setState({dataToDay: _array}),
  //         (_, err) => console.log('error getData - ', err));
  //     });
  // };

  removeClientConfirm(id_client, name, time) {
    Alert.alert(
      'Подтвердите удаление',
      `Вы действительно хотите удалить запись для ${name} на ${time} ?`,
      [
        {
          text: 'Да',
          onPress: () => this.removeClient(id_client),
          style: 'destructive',
        },
        {text: 'Отмена', style: 'cancel'},
      ],
      {cancelable: true},
    );
  }

  removeClient(id_client) {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM timetable WHERE id = ?',
        [id_client],
        () => Alert.alert('Запись успешно удалена'),
        (_, err) => (
          Alert.alert('Произошла какая-то ошибка'),
          console.log('error removeClient - ', err)
        ),
      );
    });
    this.getData(this.state.selectDay);
  }

  getCurrentClient(id) {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Timetable WHERE id = ?',
        [id],
        (_, {rows: {_array}}) => (
          this.setState({dataFormProp: _array[0]}),
          this.props.navigation.navigate('TimetableForm', {
            dataForm: this.state.dataFormProp,
          })
        ),
      ),
        (_, err) => console.log('error getCurrentClient - ', err);
    });
  }

  NavigatePage(ID, Type) {
    let way = '';
    {
      Type == 's' ? (way = 'Student') : (way = 'Group');
    }
    this.props.navigation.navigate(way, {type: 'view', id: ID});
  }

  render() {
    this.state.dataToDay.sort((a, b) => (a.Time > b.Time ? 1 : -1));
    return (
      <View style={Styles.container}>
        <DropDownPicker
          placeholder="Выберите день недели"
          textStyle={{fontSize: 14, fontFamily: 'sf_regular'}}
          open={this.state.openSelectDays}
          value={this.state.selectDay}
          items={this.state.itemsDays}
          setOpen={this.setOpen}
          setValue={this.setValue}
          setItems={this.setItems}
          onSelectItem={item => this.getData(item.value)}
          style={Styles.dropDown}
          dropDownContainerStyle={Styles.dropDownBox}
        />
        <View style={Styles.rowSwitch}>
          <Switch
            value={this.state.editing}
            trackColor={{true: '#554AF0', false: '#EBEBEB'}}
            thumbColor={'#FFFFFF'}
            onValueChange={check => this.setState({editing: check})}
          />
          <Text
            style={{
              ...Styles.rowSwitchText,
              color: this.state.editing ? '#554AF0' : '#04021D',
            }}>
            Редактировать
          </Text>
        </View>
        {this.state.dataToDay.length != 0 || this.state.selectDay != '' ? (
          <ScrollView style={Styles.containerCard}>
            {this.state.dataToDay.map(item => (
              <View style={Styles.cardDays} key={item.ID}>
                <View style={Styles.cardDaysRow}>
                  <View style={Styles.cardDaysRowTime}>
                    {/* <MaterialCommunityIcons name="clock-outline" size={16} color="#B1B1B1" style={{marginRight: 8}} /> */}
                    <Text style={Styles.cardDaysRowTimeText}>{item.Time}</Text>
                  </View>
                  <Text style={Styles.cardDaysRowTitle}>{item.Categori}</Text>
                </View>
                <View style={Styles.cardDaysRowLine}></View>
                <View style={Styles.cardDaysRow}>
                  <Text style={Styles.cardDaysRowText}>{item.Name}</Text>
                  <Text style={Styles.cardDaysRowText}>{item.Diagnos}</Text>
                </View>
                <View style={Styles.cardDaysBtns}>
                  {this.state.editing ? (
                    <>
                      <TouchableOpacity
                        style={Styles.cardDaysEdit}
                        onPress={() => this.getCurrentClient(item.ID)}>
                        {/* <Feather name="edit-3" size={16} color="#554AF0" style={{marginRight: 8}}/> */}
                        <Text style={Styles.cardDaysEditText}>Изменить</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={Styles.cardDaysRemove}
                        onPress={() =>
                          this.removeClientConfirm(
                            item.ID,
                            item.Name,
                            item.Time,
                          )
                        }>
                        {/* <Feather name="trash" size={16} color="#DC5F5A" style={{marginRight: 8}}/> */}
                        <Text style={Styles.cardDaysRemoveText}>Удалить</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={Styles.cardDaysGoTo}
                      onPress={() =>
                        this.NavigatePage(item.Client_id, item.Type)
                      }>
                      <Text style={Styles.cardDaysGoToText}>
                        Перейти к карточке
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <View style={Styles.crutch}></View>
          </ScrollView>
        ) : (
          <EmptyData typeField={'t'} />
        )}
        <ButtonAdd
          execute={() =>
            this.props.navigation.navigate('TimetableForm', {dataForm: {}})
          }
        />
      </View>
    );
  }
}
