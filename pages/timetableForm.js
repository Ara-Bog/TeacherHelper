import React, {Component} from 'react';
import {View, Alert, BackHandler, Text} from 'react-native';
import Styles from '../styleGlobal.js';

import {TimePicker} from '../components/form/datetimePicker';
import Dropdown from '../components/form/dropdown';
import Textarea from '../components/form/textarea.js';
import setHeaderNavigation from '../actions/changeHeader.js';
import {ScrollView} from 'react-native';
import MenuActions from '../components/menuActions.js';
import {DivDefaultRow} from '../components/elements/divDefault.js';
import {deleteTimetable} from '../actions/actinonsDB.js';
import {
  saveConfirm,
  removeConfirm,
  undoConfirm,
  undoCreate,
} from '../actions/confirmAction';
import {insertInto} from '../actions/sqlGenerator';

export default class TimetableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.route.params,
      itemsDays: [
        {name: 'Каждый день', id: 'all'},
        {name: 'Понедельник', id: 'mon'},
        {name: 'Вторник', id: 'tue'},
        {name: 'Среда', id: 'wen'},
        {name: 'Четверг', id: 'thu'},
        {name: 'Пятница', id: 'fri'},
        {name: 'Суббота', id: 'sat'},
        {name: 'Воскресенье', id: 'sun'},
      ],
      itemsType: [
        {name: 'Групповое', id: 'g'},
        {name: 'Индивидуальное', id: 's'},
      ],
      listStudents: [],
      listGroups: [],
      clintsList: [],
      valuesStorage: {},
      currentData: {},
      editing: false,
      loading: true,
      // костыль
      flagTypeChange: false,
    };
    // способ открытия страницы
    currentType = this.state.options.type;

    this.setNavView = () =>
      setHeaderNavigation({
        mainTitle: 'Запись расписания',
        addedTitle: this.state.options.template.name,
        onPressRight: () => {
          this.setState({menuShow: true});
        },
        navigation: this.props.navigation,
        mode: 'menu',
      });

    this.setNavChange = () =>
      setHeaderNavigation({
        mainTitle: 'Редактирование записи',
        addedTitle: this.state.options.template.name,
        onPressRight: () => {
          saveConfirm(() => this.confirmEdit());
        },
        onPressLeft: () => {
          undoConfirm(() => {
            this.state.valuesStorage = JSON.parse(
              JSON.stringify(this.state.currentData),
            );
            this.setState({
              editing: false,
            });
            this.setNavView();
          });
        },
        navigation: this.props.navigation,
        mode: 'edit',
      });

    // установка заголовка и кнопок в header
    switch (currentType) {
      case 'view':
        this.setNavView();
        break;
      case 'add':
        this.state.editing = true;
        setHeaderNavigation({
          mainTitle: 'Новая запись',
          addedTitle: this.state.options.template.name,
          onPressRight: () => saveConfirm(() => this.confirmEdit()),
          onPressLeft: () => undoCreate(() => this.props.navigation.goBack()),
          navigation: this.props.navigation,
          mode: 'edit',
        });
        break;
      case 'copy':
        this.state.editing = true;
        setHeaderNavigation({
          mainTitle: 'Копия записи',
          addedTitle: this.state.options.template.name,
          onPressRight: () => saveConfirm(() => this.confirmEdit()),
          onPressLeft: () => undoCreate(() => this.props.navigation.goBack()),
          navigation: this.props.navigation,
          mode: 'edit',
        });
        break;
    }
    db.transaction(tx => {
      // получение данных записи
      if (currentType !== 'add') {
        tx.executeSql(
          `
          SELECT df.id, df.time, df.date, df.id_client, 
                df.type_client, dg.name AS diagnos, ct.name AS category
          FROM (
            SELECT tt.*, 
              CASE tt.type_client
                WHEN "s" THEN st.id_category
                WHEN "g" THEN gp.id_category
                ELSE NULL
              END AS id_category,
              CASE tt.type_client
                WHEN "s" THEN st.id_diagnos
                WHEN "g" THEN gp.id_diagnos
                ELSE NULL
              END AS id_diagnos
            FROM Timetable AS tt
            LEFT JOIN Students AS st ON tt.type_client = "s" AND tt.id_client = st.id
            LEFT JOIN Groups AS gp ON tt.type_client = "g" AND tt.id_client = gp.id
            WHERE tt.id = ?
          ) AS df
          LEFT JOIN Diagnosis AS dg ON dg.id = df.id_diagnos
          LEFT JOIN Categories AS ct ON ct.id = df.id_diagnos
          `,
          [this.state.options.id],
          (_, {rows}) => {
            let data = JSON.stringify(rows.raw()[0]);
            this.state.valuesStorage = JSON.parse(data);
            this.state.currentData = JSON.parse(data);
          },
          err => console.log('error запись расписания', err),
        );
      }
      // списки учеников и групп
      tx.executeSql(
        `
        SELECT st.id, st.surname || ' ' || st.name AS name, ct.name AS category, dg.name AS diagnos
        FROM Students AS st
        LEFT JOIN Diagnosis AS dg ON dg.id = st.id_diagnos
        LEFT JOIN Categories AS ct ON ct.id = st.id_category
        WHERE st.id_template = ?
        `,
        [this.state.options.template.id],
        (_, {rows}) => (this.state.listStudents = rows.raw()),
        err => console.log('error timetable from get students', err),
      );
      tx.executeSql(
        `
        SELECT gp.id, gp.name, ct.name AS category, dg.name AS diagnos
        FROM Groups AS gp
        LEFT JOIN Diagnosis AS dg ON dg.id = gp.id_diagnos
        LEFT JOIN Categories AS ct ON ct.id = gp.id_diagnos
        WHERE gp.id_template = ?
        `,
        [this.state.options.template.id],
        (_, {rows}) => this.setState({listGroups: rows.raw(), loading: false}),
        err => console.log('error timetable from get groups', err),
      );
    });
  }

  // когда мы в режиме редактирования добавляем алерт при аппаратному "назад"
  backAction = () => {
    if (this.state.options.type === 'view') {
      undoConfirm(() => {
        this.setState({
          valuesStorage: JSON.parse(JSON.stringify(this.state.currentData)),
          editing: false,
        });
        this.setNavView();
      });
    } else {
      undoCreate(() => {});
    }
    return true;
  };

  // устанавливаем прослушку на кнопку назад (аппаратную)
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  // прослушка должна устанавливатся только когда мы в режиме редактирования
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.editing) {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.backAction,
      );
    } else {
      this.backHandler.remove();
    }
    return true;
  }

  // убираем прослушку
  componentWillUnmount() {
    this.backHandler.remove();
  }

  // удаление записи
  async removeCard() {
    await deleteTimetable(this.state.options.id);
    Alert.alert('Карточка успешно удалена!');

    this.props.navigation.pop();
  }

  // подтверждение изменений
  confirmEdit() {
    // флаг ошибки проверки
    let flagError = false;

    Object.keys(this.state.valuesStorage).forEach(key => {
      if (!['note', 'category', 'diagnos'].includes(key)) {
        if (!this.state.valuesStorage[key]) {
          flagError = true;
        }
      }
    });

    // есть не заполненные обязательные поля
    if (flagError) {
      Alert.alert(
        'Ошибка ввода',
        `Поля со звездочкой должны быть обязательно заполненны`,
        [{text: 'Ок', style: 'destructive'}],
        {cancelable: true},
      );
      return;
    }

    this.updateBase();
  }

  // обновление данных записи
  async updateBase() {
    let data = this.state.valuesStorage;

    if (this.state.valuesStorage.date === 'all') {
      Alert.alert(
        'Уведомление',
        `Вы указали запись на каждый день.\n
      Будет созданы 7 записей и вы автоматически будете перемещены на запись понедельника!`,
      );
    }
    if (data.date === 'all') {
      data.date = 'mon';
      this.allDaysInsert(data.date);
    }

    if (this.state.options.type != 'view') {
      dataTimetable = {
        time: data.time || null,
        date: data.date || null,
        id_client: data.id_client || null,
        type_client: data.type_client || null,
        note: data.note || null,
      };
      newId = await insertInto([dataTimetable], 'Timetable', true);
      this.state.options.id = newId;
      this.state.options.type = 'view';
    } else {
      await db.transaction(tx => {
        tx.executeSql(
          `
          UPDATE Timetable
          SET time = ?,
              date = ?,
              id_client = ?,
              type_client = ?,
              note = ?
          WHERE id = ?
          `,
          [
            data.time || null,
            data.date || null,
            data.id_client || null,
            data.type_client || null,
            data.note || null,
            this.state.options.id,
          ],
          null,
          err => (
            Alert.alert('Произошла ошибка!'),
            console.log('error studentPage updateBase', err)
          ),
        );
      });
    }

    Alert.alert('Данные успешно обновленны!');

    // проверка пройдена - обновляем текущие данные
    this.setState({
      currentData: JSON.parse(JSON.stringify(this.state.valuesStorage)),
    });

    // возвращаем заголовки
    this.setNavView();
    this.setState({editing: false});
  }

  async allDaysInsert(withoutDay) {
    const data = this.state.valuesStorage;
    for (let item of this.state.itemsDays) {
      if (['all', withoutDay].includes(item.id)) {
        continue;
      }
      dataTimetable = {
        time: data.time || null,
        date: item.id || null,
        id_client: data.id_client || null,
        type_client: data.type_client || null,
        note: data.note || null,
      };
      await insertInto([dataTimetable], 'Timetable');
    }
  }

  // изменение данных по ключу
  changeValue(key, val) {
    this.setState({valuesStorage: {...this.state.valuesStorage, [key]: val}});
  }

  render() {
    if (this.state.loading) {
      return;
    }
    let currListCliens =
      this.state.valuesStorage.type_client === 'g'
        ? this.state.listGroups
        : this.state.listStudents;
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
            <Dropdown
              data={this.state.itemsDays}
              value={this.state.valuesStorage.date}
              editing={this.state.editing}
              label={'День недели'}
              requared={true}
              onChange={val => this.changeValue('date', val)}
            />
            {/* Время */}
            <TimePicker
              value={this.state.valuesStorage.time}
              editing={this.state.editing}
              label={'Время'}
              labelEdit={'Время'}
              requared={true}
              onChange={val => this.changeValue('time', val)}
            />
            {/* Тип занятия */}
            <Dropdown
              data={this.state.itemsType}
              value={this.state.valuesStorage.type_client}
              editing={this.state.editing}
              label={'Тип занятия'}
              requared={true}
              onChange={val => {
                this.setState({
                  flagTypeChange: !this.state.flagTypeChange,
                  valuesStorage: {
                    ...this.state.valuesStorage,
                    id_client: null,
                    type_client: val,
                  },
                });
              }}
            />
            {/* Клиент */}
            {this.state.valuesStorage.type_client ? (
              <Dropdown
                data={currListCliens}
                value={this.state.valuesStorage.id_client}
                editing={this.state.editing}
                label={'С кем будет занятие'}
                requared={true}
                flagUpdate={this.state.flagTypeChange}
                onChange={val => {
                  let item = currListCliens.find(el => el.id == val);
                  this.setState({
                    valuesStorage: {
                      ...this.state.valuesStorage,
                      id_client: val,
                      diagnos: item.diagnos,
                      category: item.category,
                    },
                  });
                }}
              />
            ) : null}
            {/* Статичные данные только отображение */}
            {!this.state.editing ? (
              <>
                <DivDefaultRow
                  label={'Возрастная группа'}
                  value={this.state.valuesStorage.category}
                />
                <DivDefaultRow
                  label={'Заключение ЦПМПК'}
                  value={this.state.valuesStorage.diagnos}
                />
              </>
            ) : null}
            <View style={Styles.seqLineHeader}></View>
            {/* Заметки */}
            <Textarea
              editing={this.state.editing}
              value={this.state.valuesStorage.note}
              label={'Заметки'}
              onChange={id => this.changeValue('note', id)}
            />
          </ScrollView>
          <MenuActions
            visible={this.state.menuShow}
            callClose={() => this.setState({menuShow: false})}
            callCopy={() => {
              this.props.navigation.push('Timetable', {
                type: 'copy',
                id: this.state.options.id,
                template: this.state.options.template,
              });
            }}
            callDelete={() => removeConfirm(() => this.removeCard())}
            callChange={() => {
              this.setState({editing: true});
              this.setNavChange();
            }}
            onCard={true}
          />
        </View>
      </>
    );
  }
}
