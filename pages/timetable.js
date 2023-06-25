import React, {Component} from 'react';
import {Text, View, ScrollView, Alert, TouchableOpacity} from 'react-native';
import Dropdown from '../components/form/dropdown';
import {setUserSetting} from '../actions/userSettings';
import RowSwitcher from '../components/elements/switcherInLine';
import ListCards from '../components/listCards';
import {deleteTimetable} from '../actions/actinonsDB';

export default class TimetableWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultData: [],
      dataFiltered: [],
      selectDay: 'all',
      itemsDays: [
        {name: 'Все дни', id: 'all', defaultName: 'Все дни'},
        {name: 'Понедельник', id: 'mon', defaultName: 'Понедельник'},
        {name: 'Вторник', id: 'tue', defaultName: 'Вторник'},
        {name: 'Среда', id: 'wen', defaultName: 'Среда'},
        {name: 'Четверг', id: 'thu', defaultName: 'Четверг'},
        {name: 'Пятница', id: 'fri', defaultName: 'Пятница'},
        {name: 'Суббота', id: 'sat', defaultName: 'Суббота'},
        {name: 'Воскресенье', id: 'sun', defaultName: 'Воскресенье'},
      ],
      // флаг больших карточек
      bigSizeCards: userSettings.bigCardTimetable,
      loading: true,
    };
  }

  componentDidMount() {
    // сброс фильтра
    let resetFilters = false;
    // когда было нажатие на кнопку в меню - флаг сброса фильтра активируется
    this.props.navigation.getParent('mainTab').addListener('tabPress', () => {
      resetFilters = true;
    });
    // событие при фокусировке на экране
    this.props.navigation.addListener('focus', () => {
      this.setState({bigSizeCards: userSettings.bigCardTimetable});
      if (resetFilters) {
        // сбрасываем фильтры и открытые вкладки
        this.setState({
          dataFiltered: [...this.state.defaultData],
          loading: true,
          selectDay: 'all',
        });
        // возвращаем флаг в исходное положение
        resetFilters = false;
      }
      // делаем запрос в базу, для полученяи списка учеников
      this.getData();
    });
  }

  getData() {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT df.ID, df.date, df.type_client, df.id_client, 
            df.LeftBot, df.LeftTop,
            ct.id as RightTop_id, ct.name AS RightTop, 
            dg.id as RightBot_id, dg.name AS RightBot,
            tp.id as id_template, tp.name as template
        FROM (
          SELECT tt.id as ID, tt.time AS LeftTop, tt.date, 
            tt.type_client, tt.id_client, st.name || ' ' || st.surname AS LeftBot, 
            st.id_category, st.id_diagnos, st.id_template
          FROM Timetable AS tt
          LEFT JOIN Students AS st ON st.id = tt.id_client
          WHERE tt.type_client = "s"
          UNION
          SELECT tt.id AS id_note, tt.time AS LeftTop, tt.date, 
            tt.type_client, tt.id_client AS id, gp.name AS LeftBot, 
            gp.id_category, gp.id_diagnos, gp.id_template
          FROM Timetable AS tt
          LEFT JOIN Groups AS gp ON gp.id = tt.id_client
          WHERE tt.type_client = "g"
        ) AS df
        LEFT JOIN Diagnosis AS dg ON df.id_diagnos = dg.id
        LEFT JOIN Categories AS ct ON df.id_category = ct.id
        LEFT JOIN Templates AS tp ON tp.id = df.id_template
        `,
        [],
        (_, {rows}) => {
          let data = rows.raw();
          // заполняем данные
          this.setState({
            defaultData: [...data],
            loading: false,
          });
          // заполняем количество записей на каждый день
          this.updateCounter(data);
          // стартуем фильтрацию
          this.setFilters(this.state.selectDay);
        },
        err => console.log('error timetable get data', err),
      );
    });
  }

  setFilter(day) {
    this.state.selectDay = day;

    if (day === 'all') {
      this.setState({dataFiltered: [...this.state.defaultData]});
    } else {
      this.setState({
        dataFiltered: [
          ...this.state.defaultData.filter(item => item.date === day),
        ],
      });
    }
  }

  // обновление счетчиков в dropdown
  updateCounter(data) {
    let counter = {
      all: 0,
      mon: 0,
      tue: 0,
      wen: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };
    data.forEach(item => {
      counter.all += 1;
      counter[item.date] += 1;
    });
    this.state.itemsDays.forEach(item => {
      item.name = item.defaultName + ` (${counter[item.id]})`;
    });
  }

  // удаление записей
  async removeCard(currentList) {
    // удаляем каждый id
    await currentList.forEach(id => deleteTimetable(id));

    // удаляем id из основного списка
    this.state.defaultData = this.state.defaultData.filter(item => {
      return !currentList.includes(item.ID);
    });

    this.updateCounter(this.state.defaultData);

    // фильтруем повторно, т.к. данные изменились
    this.setFilter(this.state.selectDay);
  }

  render() {
    if (this.state.loading) {
      return;
    }
    return (
      <View style={Styles.container}>
        <View style={{gap: 15, marginBottom: 30}}>
          <Dropdown
            data={this.state.itemsDays}
            value={this.state.selectDay}
            placeholder="Выберите день недели"
            editing={true}
            onChange={id => this.setFilter(id)}
          />
          {userSettings.sizeCardAll.length == 2 ? (
            <RowSwitcher
              label="Расширенные карточки"
              currentValue={this.state.bigSizeCards}
              onCallBack={val => {
                setUserSetting('bigCardTimetable', val);
                this.setState({bigSizeCards: val});
              }}
            />
          ) : null}
        </View>
        <ListCards
          onCallDeleteData={currentList => this.removeCard(currentList)}
          data={this.state.dataFiltered}
          bigSizeCards={this.state.bigSizeCards}
          typeData={'Timetable'}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
