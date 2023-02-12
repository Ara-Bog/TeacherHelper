import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
} from 'react-native';
import ButtonEdit from '../components/buttonEdit';
import SubTab from '../components/generatorPages';
import EmptyData from '../components/emptyDataList';
import PagerView from 'react-native-pager-view';
import NavPage from '../components/navPage';
import HeaderTitle from '../components/elements/headerTitle';

// import {TabView, SceneMap} from 'react-native-tab-view';

// форматирование данных симптоматики и знеачений с базы
function destructStudentCardData(data) {
  // новый стэш данных
  let newData = {};
  // обходим строки данных
  data.forEach(item => {
    // создаем новую секицию
    newData[item.id_section] ??= {};

    // определяем к какой симптоматике будет обращение
    selectIndex = item.id_parent != null ? item.id_parent : item.id_symptom;

    // определяем ссылку на объект для изменения
    currentObject = newData[item.id_section][selectIndex];

    // создаем пустую структуру при ее отсутствии
    currentObject ??= {
      // заголовок симптоматики
      label: '',
      // значения текущей симптоматики
      values: [],
      // тип поля
      type: '',
    };

    if (item.id_parent != null) {
      // создаем поле дочерних для родителя
      currentObject.childrens ??= {};
      // создаем структуру для дочернего при отсутствии
      currentObject.childrens[item.id_symptom] ??= {
        label: item.symptom,
        type: item.typeSym,
        values: [],
      };
      // вносим новое значение для дочернего
      currentObject.childrens[item.id_symptom].values.push({
        id: item.id_symptomsValue,
        label: item.value,
        type: item.typeVal,
      });
    } else {
      // данные для симптоматики
      currentObject.label = item.symptom;
      currentObject.type = item.typeSym;
      // чтобы не создавать null индекс значения для заголовка
      if (item.typeSym != 'label') {
        currentObject.values.push({
          id: item.id_symptomsValue,
          label: item.value,
          type: item.typeVal,
        });
      }
    }
    newData[item.id_section][selectIndex] = currentObject;
  });
  return newData;
}

export default class StudentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // переданные параметры
      options: this.props.route.params,
      // состояние редактирования
      editing: false,
      // хранение экземпляра страниц
      pageViewer: undefined,
      // поля по умолчанию для основной страницы
      default_main: {
        surname: {
          value: '',
          label: 'Фамилия',
          requared: true,
          type: 'inputView',
        },
        mame: {value: '', label: 'Имя', requared: true, type: 'inputView'},
        midname: {value: '', label: 'Отчество', type: 'inputView'},
        // date_bd: {
        //   value: '',
        //   label: 'Возраст',
        //   labelEdit: 'Дата рождения',
        //   type: 'dateTime',
        // },
        // group_org: {value: '', label: 'Группа в организации', type: 'inputView'},
        // category: {
        //   value: '',
        //   label: 'Возрастная группа',
        //   requared: true,
        //   type: 'droplist',
        // },
        // group: {value: '', label: 'Группа', type: 'droplist'},
        // diagnos: {
        //   value: '',
        //   label: 'Заключение ЦПМПК',
        //   requared: true,
        //   type: 'droplist',
        // },
      },
      // секции страницы
      sections: [],
      // текущий индекс страницы
      selectedPageIndex: 0,
      // данные для секций по id
      sectionsData: {},
      // список групп
      listGroups: [],
      // текущие данные ученика
      dataClient: {},
    };
    // способ открытия страницы
    currentType = this.state.options.type;
    db.transaction(tx => {
      // получение сортированных секций
      tx.executeSql(
        `SELECT id, name, show_label FROM Sections WHERE id_template = ? ORDER BY "orderBy"`,
        [this.state.options.template[0]],
        (_, {rows}) => this.setState({sections: rows.raw()}),
      );
      // запрос получения всех значений по каждой симптоматике с указанием
      // типа поля (как имя) и соответствующей секции
      // по конкретному шаблону
      tx.executeSql(
        `SELECT 
          data.id_section, data.id_symptom, 
          data.id_symptomsValue, data.id_parent, 
          data.symptom, data.value, type.name AS typeVal, 
          data.typeSym
        FROM 
          (SELECT 
              sym.id_section, sym.id as id_symptom, 
              symVal.id as id_symptomsValue, sym.id_parent, 
              sym.symptom, symVal.value, 
              symVal.type as typeVal,sym.typeSym
          FROM
            (SELECT 
                sym.id, sym.id_section, sym.name as symptom, 
                sym.id_parent, type.name as typeSym
            FROM
              (SELECT 
                  sym.* 
              FROM 
                  Sections as sect 
              LEFT JOIN 
                  Symptoms as sym ON sym.id_section = sect.id
              WHERE 
                  sect.id_template = ? AND sym.id_section IS NOT NULL
              ORDER BY 
                  sect.orderBy, sym.id) as sym
            LEFT JOIN 
                TypesField as type ON sym.type = type.id) as sym
          LEFT JOIN 
              SymptomsValues as symVal ON sym.id = symVal.id_symptom) AS data
        LEFT JOIN 
            TypesField as type ON data.typeVal = type.id`,
        [this.state.options.template[0]],
        (_, {rows}) =>
          this.setState({sectionsData: destructStudentCardData(rows.raw())}),
      );
    });

    switch (currentType) {
      case 'view':
        this.props.navigation.setOptions({
          headerTitle: props => (
            <HeaderTitle
              mainTitle="Карточка ученика"
              addedTitle={this.state.options.template[1]}
            />
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Icons.Feather name="edit" size={24} color="#554AF0" />
            </TouchableOpacity>
          ),
        });
        break;
      case 'add':
        this.props.navigation.setOptions({
          headerTitle: props => (
            <HeaderTitle
              mainTitle="Новая ученика"
              addedTitle={this.state.options.template[1]}
            />
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Icons.Feather name="trash" size={24} color="#DC5F5A" />
            </TouchableOpacity>
          ),
        });
        break;
      case 'copy':
        this.props.navigation.setOptions({
          headerTitle: props => (
            <HeaderTitle
              mainTitle="Копия карточки"
              addedTitle={this.state.options.template[1]}
            />
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Icons.Feather name="trash" size={24} color="#DC5F5A" />
            </TouchableOpacity>
          ),
        });
        break;
    }

    // if (currentType == 'view') {
    //   db.transaction(tx => {
    //     tx.executeSql(
    //       'SELECT * FROM Students WHERE id = ?',
    //       [this.state.options.id],
    //       (_, {rows}) =>
    //       {let data = rows.raw();

    //         this.setState({
    //           currentDataClient: data,
    //           clientAge: Math.round(
    //             (new Date().getTime() - new Date(data.data_bd)) /
    //               (24 * 3600 * 365.25 * 1000),
    //           ),
    //           dataClient: data,
    //         })},
    //       (_, err) => console.log('error - ', err),
    //     );
    //   });
    //   this.props.navigation.setOptions({title: 'Карточка ученика'});
    //   // headerTitle: (
    //   //     <View>
    //   //       <Text>{navigation.getParam('client')}</Text>
    //   //       <Text>{navigation.getParam('ref')}</Text>
    //   //     </View>
    //   //   )
    // } else if (currentType == 'add') {
    //   this.state.currentSymptoms = {};
    //   this.state.currentSounds = {};
    //   this.props.navigation.setOptions({title: 'Добавление ученика'});
    //   this.state.editing = true;
    // } else if (currentType == 'copy') {
    //   console.log('test copy')
    // }
  }

  // checkData() {
  //   for (let nameCol of this.state.requiredData) {
  //     if (
  //       this.state.currentDataClient[nameCol] == '' ||
  //       this.state.currentDataClient[nameCol] == undefined
  //     ) {
  //       this.setState({editing: !this.state.editing});
  //       Alert.alert(
  //         'Ошибка ввода',
  //         `Поля со звездочкой должны быть обязательно заполненны`,
  //         [{text: 'Да', style: 'destructive'}],
  //       );
  //       return;
  //     }
  //   }
  //   {
  //     this.state.options.type == 'add'
  //       ? (this.addBase(),
  //         db.transaction(tx => {
  //           tx.executeSql(
  //             'SELECT max(id) as lastID FROM Students',
  //             [],
  //             (_, {rows: {_array}}) =>
  //               this.setState({
  //                 currentDataClient: {
  //                   ...this.state.currentDataClient,
  //                   ID: _array[0]['lastID'],
  //                 },
  //               }),
  //             (_, err) => (
  //               Alert.alert('Произошла какая-то ошибка'),
  //               console.log('error getID - ', err)
  //             ),
  //           );
  //         }),
  //         this.setState({options: {...this.state.options, type: 'view'}}),
  //         this.props.navigation.setOptions({headerTitle: 'Карточка ученика'}))
  //       : this.updateBase();
  //   }
  // }

  // addBase() {
  //   const data = this.state.currentDataClient;
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'INSERT INTO students (Surname, Name, Midname, Group_name, Subgroup_id, DateBD, Categori_id, Diagnos_id, violations, symptoms, sound, note) ' +
  //         'VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
  //       [
  //         data.Surname,
  //         data.Name,
  //         data.Midname || null,
  //         data.Group_name,
  //         data.Subgroup_id || null,
  //         data.DateBD,
  //         data.Categori_id,
  //         data.Diagnos_id,
  //         data.Violations || null,
  //         data.Symptoms || null,
  //         data.Sound || null,
  //         data.Note || null,
  //       ],
  //       () => Alert.alert('Данные успешно добавленны'),
  //       (_, err) => (
  //         Alert.alert('Произошла какая-то ошибка'),
  //         console.log('error updateBase - ', err)
  //       ),
  //     );
  //   });
  // }

  // updateDateBD(val) {
  //   if (val != undefined) {
  //     this.setState({
  //       currentDataClient: {
  //         ...this.state.currentDataClient,
  //         DateBD: val.toISOString().slice(0, 10),
  //       },
  //     });
  //   }
  //   this.setState({
  //     timePickerOpen: false,
  //   });
  // }

  // updateBase() {
  //   const data = this.state.currentDataClient;
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'UPDATE Students ' +
  //         'SET surname=?, name=?, midname=?, group_name=?, subgroup_id=?, DateBD=?, categori_id=?, diagnos_id=?, violations=?, symptoms=?, sound=?, note=? ' +
  //         'WHERE ID=?',
  //       [
  //         data.Surname,
  //         data.Name,
  //         data.Midname,
  //         data.Group_name,
  //         data.Subgroup_id,
  //         data.DateBD,
  //         data.Categori_id,
  //         data.Diagnos_id,
  //         data.Violations,
  //         data.Symptoms,
  //         data.Sound,
  //         data.Note,
  //         data.ID,
  //       ],
  //       () => (
  //         Alert.alert('Данные успешно обновленны'),
  //         this.setState({
  //           clientAge: Math.round(
  //             (new Date().getTime() -
  //               new Date(this.state.currentDataClient.DateBD)) /
  //               (24 * 3600 * 365.25 * 1000),
  //           ),
  //         })
  //       ),
  //       (_, err) => (
  //         Alert.alert('Произошла какая-то ошибка'),
  //         console.log('error updateBase - ', err)
  //       ),
  //     );
  //   });
  //   this.setState({dataClient: this.state.currentDataClient});
  // }

  // formatDateBD() {
  //   if (this.state.currentDataClient.DateBD != undefined) {
  //     const currentDate = new Date(this.state.currentDataClient.DateBD);
  //     return currentDate
  //       .toISOString()
  //       .slice(0, 10)
  //       .split('-')
  //       .reverse()
  //       .join('.');
  //   } else {
  //     return 'Выберите дату';
  //   }
  // }

  // violationSelected(check_id) {
  //   const arrBoxes = this.state.checkedViolations;
  //   const indexChecker = arrBoxes.indexOf(check_id);
  //   if (indexChecker != -1) {
  //     arrBoxes.splice(indexChecker, 1);
  //   } else {
  //     arrBoxes.push(check_id);
  //   }
  //   arrBoxes.sort(function (a, b) {
  //     return b - a;
  //   });
  //   this.setState({
  //     currentDataClient: {
  //       ...this.state.currentDataClient,
  //       Violations: arrBoxes.join('/'),
  //     },
  //   });
  // }

  // symptomsSelected(newSympt) {
  //   this.setState({
  //     currentSymptoms: newSympt,
  //     currentDataClient: {
  //       ...this.state.currentDataClient,
  //       Symptoms: JSON.stringify(newSympt),
  //     },
  //   });
  // }

  // soundsSelected(newSound) {
  //   this.setState({
  //     currentSounds: newSound,
  //     currentDataClient: {
  //       ...this.state.currentDataClient,
  //       Sound: JSON.stringify(newSound),
  //     },
  //   });
  // }

  // undoActions() {
  //   this.state.options.type == 'view'
  //     ? this.setState({
  //         currentDataClient: this.state.dataClient,
  //         currentSymptoms:
  //           this.state.dataClient.Symptoms != null
  //             ? JSON.parse(this.state.dataClient.Symptoms)
  //             : {},
  //         currentSounds:
  //           this.state.dataClient.Sound != null
  //             ? JSON.parse(this.state.dataClient.Sound)
  //             : {},
  //         checkedViolations:
  //           this.state.dataClient.Violations != null
  //             ? this.state.dataClient.Violations.split('/')
  //             : [],
  //       })
  //     : this.props.navigation.goBack();
  // }

  // removeStudentConfirm() {
  //   const student = this.state.currentDataClient;
  //   Alert.alert(
  //     'Подтвердите удаление',
  //     `Вы действительно хотите удалить карточку для ${student.Surname} ${
  //       student.Name
  //     } ${
  //       student.Midname || ''
  //     } ?\nЭто также удалит связанные с ней записи в расписании.`,
  //     [
  //       {
  //         text: 'Да',
  //         onPress: () => this.removeStudent(student.ID),
  //         style: 'destructive',
  //       },
  //       {text: 'Отмена', style: 'cancel'},
  //     ],
  //     {cancelable: true},
  //   );
  // }

  // removeStudent(id_client) {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       "DELETE FROM timetable WHERE Client_id = ? AND Type = 's'",
  //       [id_client],
  //       () => null,
  //       (_, err) => console.log('error removeStudent (timetable) - ', err),
  //     );
  //     tx.executeSql(
  //       'DELETE FROM students WHERE id = ?',
  //       [id_client],
  //       () => Alert.alert('Карточка успешно удаленна'),
  //       (_, err) => (
  //         Alert.alert('Произошла какая-то ошибка'),
  //         console.log('error removeStudent (students) - ', err)
  //       ),
  //     );
  //   });
  //   this.props.navigation.goBack();
  // }

  // renderScene = ({route}) => {
  //   switch (route.key) {
  //     case 'first':
  //       // return <SubTab hui="qwe" />;
  //       return <View style={{flex: 1}} />;
  //     case 'second':
  //       return <View style={{flex: 1}} />;
  //     case '3':
  //       // return <SubTab hui="qwe" />;
  //       return <View style={{flex: 1}} />;
  //     case '4':
  //       return <View style={{flex: 1}} />;
  //     case '5':
  //       // return <SubTab hui="qwe" />;
  //       return <View style={{flex: 1}} />;
  //     case '6':
  //       return <View style={{flex: 1}} />;
  //     default:
  //       return null;
  //   }
  // };

  render() {
    return (
      <>
        <View style={Styles.seqLineHeader}></View>
        <NavPage
          values={this.state.sections}
          selected={this.state.selectedPageIndex}
          onSelect={index => this.state.pageViewer.setPage(index)}
        />
        <PagerView
          style={{flex: 1}}
          initialPage={0}
          ref={pager => (this.state.pageViewer = pager)}
          onPageSelected={e =>
            this.setState({selectedPageIndex: e.nativeEvent.position})
          }>
          {this.state.sections.map(item => {
            return (
              <SubTab
                key={item.id}
                showLabel={item.showLabel != null}
                lable={item.name}
                hui={item.name}
              />
            );
          })}
        </PagerView>
        {/* <ButtonEdit
          // changeState={() =>
          //   this.setState({
          //     editing: !this.state.editing,
          //     dropDownsOpen: {subgroup: false, categori: false, diagnos: false},
          //   })
          // }
          editing={this.state.editing}
          // confirm={feedback => {
          //   feedback ? this.checkData() : this.undoActions();
          // }}
        /> */}
        {/* <InputView
        value="Петров Петров Петров Петров Петров"
        editing={true}
        label="ФамилияФамилия Фамилия Фамилия Фамилия"
        requared={true}
        onChange={val => console.log('test - ', val)}
      /> */}
      </>
    );
  }
}
