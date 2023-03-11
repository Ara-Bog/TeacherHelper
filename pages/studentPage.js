import React, {Component} from 'react';
import {Text, View, ScrollView, Alert, TouchableOpacity} from 'react-native';
import ButtonEdit from '../components/buttonEdit';
import SubTab from '../components/generatorPages';
import EmptyData from '../components/emptyDataList';
import PagerView from 'react-native-pager-view';
import NavPage from '../components/navPage';
import HeaderTitle from '../components/elements/headerTitle';

// import {TabView, SceneMap} from 'react-native-tab-view';

// форматирование данных симптоматики и знеачений с базы
function destructStudentCardData(data) {
  // data - массив объектов
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
      // текущий индекс страницы
      selectedPageIndex: 0,

      // секции страницы
      sections: [],

      // поля по умолчанию для основной страницы с данными выбора (если есть)
      defaultData: {
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
          group: {label: 'Группы', type: 'viewLinks', last: true},
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
            childrens: {
              1: {label: 'ФИО', type: 'inputView', requared: true},
              2: {label: 'Телефон', type: 'phone', requared: true},
              3: {label: 'Кем приходится', type: 'inputView'},
            },
          },
        },
      },
      // данные для секций по id
      sectionsData: {},

      // текущие данные ученика
      currentData: {},

      // состояние загрузки данных с бд
      loading: true,

      funcAdd: [],
    };

    // способ открытия страницы
    currentType = this.state.options.type;
    // флаг, для запроса данных ученика
    getStudent = currentType == 'add' ? false : true;
    // для уменьшения количества рендеров
    // данные обновляются без setState
    // в последней транзакции 2-х блоков меняется флаг загрузки
    // ДОРАБОТАТЬ ЛОГИКУ copy и add
    db.transaction(tx => {
      // получение сортированных секций
      tx.executeSql(
        `SELECT id, name, show_label, tab_name FROM Sections WHERE id_template = ? ORDER BY "orderBy"`,
        [this.state.options.template[0]],
        (_, {rows}) => {
          this.state.sections = rows.raw();
        },
      );
      // запрос получения всех значений по каждой симптоматике с указанием
      // типа поля (как имя) и соответствующей секции
      // по конкретному шаблону
      tx.executeSql(
        `
        SELECT sym.id_section, sym.id as id_symptom, 
          symVal.id as id_symptomsValue, sym.id_parent, 
          sym.symptom, symVal.value, sym.typeSym, type.name AS typeVal
        FROM (
          SELECT 
            sym.id, sym.id_section, sym.name as symptom, 
            sym.id_parent, type.name as typeSym
          FROM 
            Sections as sect 
          LEFT JOIN 
            Symptoms as sym ON sym.id_section = sect.id
          LEFT JOIN 
            TypesField as type ON sym.type = type.id
          WHERE 
            sect.id_template = ? AND sym.id_section IS NOT NULL
          ORDER BY 
            sect.orderBy, sym.id
          ) as sym
        LEFT JOIN 
          SymptomsValues as symVal ON sym.id = symVal.id_symptom
        LEFT JOIN 
          TypesField as type ON symVal.type = type.id
        `,
        [this.state.options.template[0]],
        (_, {rows}) =>
          (this.state.sectionsData = {
            ...this.state.sectionsData,
            ...destructStudentCardData(rows.raw()),
          }),
        err => console.log('error studentPage get all symptoms', err),
      );

      // получение диагнозов
      tx.executeSql(
        `
        SELECT id, name
        FROM Diagnosis
        WHERE id_template IS NULL OR id_template = ?
        `,
        [this.state.options.template[0]],
        (_, {rows}) =>
          (this.state.defaultData.default_main.diagnos.values = rows.raw()),
        err => console.log('error studentPage get Diagnosis', err),
      );

      // получение категорий
      tx.executeSql(
        `
        SELECT *
        FROM Categories
        WHERE id <> 0
        `,
        [],
        (_, {rows}) => {
          this.state.defaultData.default_main.category.values = rows.raw();
          if (!getStudent) {
            this.setState({loading: false});
          }
        },
        err => console.log('error studentPage get Categories', err),
      );

      // получение текущих данных студента
      if (getStudent) {
        // симптоматика ученика
        tx.executeSql(
          `
          SELECT 
            cur.id_symptomsValue as id, symVal.id_symptom 
          FROM 
            CurrentSymptoms as cur
          LEFT JOIN
            SymptomsValues as symVal ON symVal.id = cur.id_symptomsValue
          WHERE cur.id_student = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            let data = rows.raw();
            let newData = {};
            data.forEach(item => {
              newData[item.id_symptom] ??= [];
              newData[item.id_symptom].push(item.id);
            });
            this.state.currentData.symptoms = newData;
          },
          err => console.log('error studentPage get cur symptoms', err),
        );

        // данные об ученике
        tx.executeSql(
          `
          SELECT surname, name, midname, 
              group_org, date_bd, note,
              id_diagnos as diagnos,
              id_category as category
          FROM Students
          WHERE id = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            this.state.currentData = {
              ...this.state.currentData,
              ...rows.raw()[0],
            };
          },
          err => console.log('error studentPage get student', err),
        );

        // получение данных родителей
        tx.executeSql(
          `
          SELECT *
          FROM ParentsStudent
          WHERE id_student = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            this.state.currentData.contacts = rows.raw();
          },
          err => console.log('error studentPage get parents', err),
        );

        // получение групп ученика
        tx.executeSql(
          `
          SELECT lsg.id, g.name as 'group'
          FROM ListStudentsGroup as lsg
          LEFT JOIN Groups as g ON lsg.id_group = g.id
          WHERE lsg.id_student = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            this.state.currentData.groups = rows.raw();
            this.setState({loading: false});
          },
          err => console.log('error studentPage get ListStudentsGroup', err),
        );
      }
    });
    // установка заголовка и соответствующей иконки вверху справа
    switch (currentType) {
      case 'view':
        this.props.navigation.setOptions({
          headerTitle: () => (
            <HeaderTitle
              mainTitle="Карточка ученика"
              addedTitle={this.state.options.template[1]}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => this.setState({editing: !this.state.editing})}>
              <Icons.Feather name="edit" size={24} color="#554AF0" />
            </TouchableOpacity>
          ),
        });
        break;
      case 'add':
        this.state.editing = true;
        this.props.navigation.setOptions({
          headerTitle: () => (
            <HeaderTitle
              mainTitle="Новая карточка"
              addedTitle={this.state.options.template[1]}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log('remove card')}>
              <Icons.Feather name="trash" size={24} color="#DC5F5A" />
            </TouchableOpacity>
          ),
        });
        break;
      case 'copy':
        this.state.editing = true;
        this.props.navigation.setOptions({
          headerTitle: () => (
            <HeaderTitle
              mainTitle="Копия карточки"
              addedTitle={this.state.options.template[1]}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => console.log('remove card')}>
              <Icons.Feather name="trash" size={24} color="#DC5F5A" />
            </TouchableOpacity>
          ),
        });
        break;
    }
  }

  render() {
    // КОСТЫЛЬ МБ ПОМЕНЯТЬ (уменьшает нагрузку рендер страниц)
    if (this.state.loading) {
      return <></>;
    }

    return (
      <>
        <NavPage
          values={this.state.sections}
          selected={this.state.selectedPageIndex}
          onSelect={index => this.state.pageViewer.setPage(index)}
        />
        <PagerView
          style={{flex: 1}}
          initialPage={0}
          ref={pager => {
            this.state.pageViewer = pager;
          }}
          onPageSelected={e =>
            this.setState({selectedPageIndex: e.nativeEvent.position})
          }>
          {this.state.sections.map((item, index) => {
            const assignData = {
              ...this.state.defaultData[item.name],
              ...this.state.sectionsData[item.id],
            };
            return (
              <SubTab
                key={item.id}
                lable={item.show_label ? item.name : null}
                data={assignData}
                currentData={this.state.currentData}
                editing={this.state.editing}
                indexParent={item.id}
                useDynamic={() => this.state.funcAdd.push(index)}
              />
            );
          })}
        </PagerView>
        {console.log('test state', this.state.funcAdd)}
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
      </>
    );
  }
}
