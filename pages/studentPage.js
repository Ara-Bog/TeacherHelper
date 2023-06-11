import React, {Component} from 'react';
import {Alert, BackHandler} from 'react-native';
import SubTab from '../components/generatorPages';
import PagerView from 'react-native-pager-view';
import NavPage from '../components/elements/navPage';
import setHeaderNavigation from '../actions/changeHeader';
import {insertInto} from '../actions/sqlGenerator';
import SQLite from 'react-native-sqlite-storage';
import MenuActions from '../components/menuActions';
import {deleteUser} from '../actions/actinonsDB';
import {
  saveConfirm,
  removeConfirm,
  undoConfirm,
  undoCreate,
} from '../actions/confirmAction';

SQLite.enablePromise(true);

// форматирование данных симптоматики и значений с базы
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
          groups: {
            label: 'Группы',
            type: 'viewLinks',
            last: true,
            template: this.props.route.params.template,
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
      },

      // данные для секций по id
      sectionsData: {},

      // текущие данные ученика
      currentData: {contacts: {}, symptoms: {}, groups: []},

      // состояние загрузки данных с бд
      loading: true,

      // временное хранилище значений
      valuesStorage: {contacts: {}, symptoms: {}, groups: []},

      // состояние меню
      menuShow: false,
    };
    // способ открытия страницы
    currentType = this.state.options.type;
    // флаг, для запроса данных ученика
    getStudent = currentType == 'add' ? false : true;
    // для уменьшения количества рендеров
    // данные обновляются без setState
    // в последней транзакции 2-х блоков меняется флаг загрузки
    db.transaction(tx => {
      // получение сортированных секций
      tx.executeSql(
        `SELECT id, name, show_label, tab_name, footer FROM Sections WHERE id_template = ? ORDER BY "orderBy"`,
        [this.state.options.template.id],
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
        [this.state.options.template.id],
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
        [this.state.options.template.id],
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
            cur.id_symptomsValue as id, cur.id_symptom, cur.id_group 
          FROM 
            CurrentSymptoms as cur
          WHERE cur.id_student = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            let data = rows.raw();
            let newData = {};
            data.forEach(item => {
              newData[item.id_symptom] ??= [];
              // отдельная логика для сгруппированных блоков
              if (item.id_group === null) {
                // блок без группировки - значения = id's
                newData[item.id_symptom].push(item.id);
              } else {
                // блок с группировкой - значение = списки id's
                newData[item.id_symptom][item.id_group - 1] ??= [];
                newData[item.id_symptom][item.id_group - 1].push(item.id);
              }
            });
            let stringJson = JSON.stringify(newData);
            this.state.currentData.symptoms = JSON.parse(stringJson);
            this.state.valuesStorage.symptoms = JSON.parse(stringJson);
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
            let stringJson = JSON.stringify(rows.raw()[0]);
            this.state.currentData = {
              ...this.state.currentData,
              ...JSON.parse(stringJson),
            };
            this.state.valuesStorage = {
              ...this.state.valuesStorage,
              ...JSON.parse(stringJson),
            };
          },
          err => console.log('error studentPage get student', err),
        );

        // получение данных родителей
        tx.executeSql(
          `
          SELECT id, name, type, phone
          FROM ParentsStudent
          WHERE id_student = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            let data = rows.raw();
            let stringJson = JSON.stringify(
              Object.assign(
                {},
                ...data.map((item, idnex) => {
                  return {[idnex + 1]: item};
                }),
              ),
            );

            this.state.currentData.contacts = JSON.parse(stringJson);
            this.state.valuesStorage.contacts = JSON.parse(stringJson);
          },
          err => console.log('error studentPage get parents', err),
        );

        // получение групп ученика
        tx.executeSql(
          `
          SELECT g.id, g.name
          FROM ListStudentsGroup as lsg
          LEFT JOIN Groups as g ON lsg.id_group = g.id
          WHERE lsg.id_student = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            let stringJson = JSON.stringify(rows.raw());
            this.state.currentData.groups = JSON.parse(stringJson);
            this.state.valuesStorage.groups = JSON.parse(stringJson);
            this.setState({loading: false});
          },
          err => console.log('error studentPage get ListStudentsGroup', err),
        );
      }
    });

    this.setNavView = () =>
      setHeaderNavigation({
        mainTitle: 'Карточка ученика',
        addedTitle: this.state.options.template.name,
        onPressRight: () => {
          this.setState({menuShow: true});
        },
        navigation: this.props.navigation,
        mode: 'menu',
      });

    this.setNavChange = () =>
      setHeaderNavigation({
        mainTitle: 'Редактирование карточки',
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
          mainTitle: 'Новая карточка',
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
          mainTitle: 'Копия карточки',
          addedTitle: this.state.options.template.name,
          onPressRight: () => saveConfirm(() => this.confirmEdit()),
          onPressLeft: () => undoCreate(() => this.props.navigation.goBack()),
          navigation: this.props.navigation,
          mode: 'edit',
        });
        break;
    }
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

  // подтверждение изменений
  confirmEdit() {
    // флаг ошибки проверки
    let flagError = false;
    // проверка обязательных полей данных по умолчанию
    for (const key of Object.keys(this.state.defaultData.default_main)) {
      if (this.state.defaultData.default_main[key].requared) {
        if (this.state.valuesStorage[key] == undefined) {
          flagError = true;
          break;
        }
      }
    }

    // проверка обязательных полей в контактах
    if (!flagError) {
      // хранилище обязательных ключей
      let massRequired = [];
      // поля ввода контактов
      let fields = this.state.defaultData.default_contacts.contacts.defStruct;
      // добавляем обязательные поля ввода в массив
      Object.keys(fields).forEach(keyItem => {
        if (fields[keyItem]) {
          massRequired.push(keyItem);
        }
      });
      // проверка обязательных полей контактов
      Object.values(this.state.valuesStorage.contacts).forEach(block => {
        massRequired.forEach(itemReq => {
          if (block[itemReq] == undefined) {
            flagError = true;
            return;
          }
          if (flagError) return;
        });
      });
    }

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

    // проверка пройдена - обновляем текущие данные
    this.setState({
      currentData: JSON.parse(JSON.stringify(this.state.valuesStorage)),
    });

    this.updateBase();
  }

  // обновление данных
  async updateBase() {
    // для удобства
    const data = this.state.currentData;

    if (this.state.options.type != 'view') {
      dataStudent = {
        surname: data.surname || null,
        name: data.name || null,
        midname: data.midname || null,
        group_org: data.group_org || null,
        date_bd: data.date_bd || null,
        id_diagnos: data.diagnos || null,
        id_category: data.category || null,
        note: data.note || null,
        id_template: this.state.options.template.id,
      };
      newId = await insertInto([dataStudent], 'Students', true);
      this.state.options.id = newId;
      this.state.options.type = 'view';
    } else {
      await db.transaction(tx => {
        // данные пользователя
        tx.executeSql(
          `
          UPDATE Students
          SET surname = ?,
              name = ?,
              midname = ?,
              group_org = ?,
              date_bd = ?,
              id_diagnos = ?,
              id_category = ?,
              note = ?
          WHERE id = ?
          `,
          [
            data.surname || null,
            data.name || null,
            data.midname || null,
            data.group_org || null,
            data.date_bd || null,
            data.diagnos || null,
            data.category || null,
            data.note || null,
            this.state.options.id,
          ],
          null,
          err => (
            Alert.alert('Произошла ошибка!'),
            console.log('error studentPage updateBase', err)
          ),
        );

        // удаляем данные родителей
        tx.executeSql(
          `
          DELETE FROM ParentsStudent
          WHERE id_student = ?
          `,
          [this.state.options.id],
          null,
          err => (
            Alert.alert('Произошла ошибка!'),
            console.log('error studentPage parents', err)
          ),
        );
        // удаляем симптоматику
        tx.executeSql(
          `
          DELETE FROM CurrentSymptoms
          WHERE id_student = ?
          `,
          [this.state.options.id],
          null,
          err => (
            Alert.alert('Произошла ошибка!'),
            console.log('error studentPage symptoms', err)
          ),
        );
      });
    }

    this.addNewData(this.state.options.id);
  }

  // добавление новых записей в дб
  async addNewData(id) {
    await insertInto(
      Object.values(this.state.currentData.contacts).map(item =>
        Object.fromEntries([
          ['id_student', id],
          ...Object.entries(item).filter(el => el[0] != 'id'),
        ]),
      ),
      'ParentsStudent',
    );
    let newData = [];

    for (let key of Object.keys(this.state.currentData.symptoms)) {
      for (let [index, item] of this.state.currentData.symptoms[
        key
      ].entries()) {
        if (Array.isArray(item)) {
          let subData = [];
          item.forEach(subItem => {
            subData.push({
              id_symptomsValue: subItem,
              id_symptom: key,
              id_group: index + 1,
              id_student: id,
            });
          });
          await insertInto(subData, 'CurrentSymptoms');
          continue;
        }
        newData.push({id_symptomsValue: item, id_symptom: key, id_student: id});
      }
    }

    await insertInto(newData, 'CurrentSymptoms');

    Alert.alert('Данные успешно обновленны!');
    // возвращаем заголовки
    this.setNavView();
    this.setState({editing: false});
  }

  async removeCard() {
    await deleteUser(this.state.options.id);
    Alert.alert('Карточка успешно удалена!');

    this.props.navigation.pop();
  }

  render() {
    // КОСТЫЛЬ МБ ПОМЕНЯТЬ (уменьшает нагрузку рендер страниц)
    if (this.state.loading) {
      return <></>;
    }
    return (
      <>
        {/* верхняя навигация подстраниц */}
        <NavPage
          values={this.state.sections}
          selected={this.state.selectedPageIndex}
          onSelect={index => this.state.pageViewer.setPage(index)}
        />
        {/* слайдер страниц */}
        <PagerView
          style={{flex: 1}}
          initialPage={0}
          ref={pager => {
            this.state.pageViewer = pager;
          }}
          onPageSelected={e =>
            this.setState({selectedPageIndex: e.nativeEvent.position})
          }>
          {this.state.sections.map(item => {
            const assignData = {
              ...this.state.defaultData[item.name],
              ...this.state.sectionsData[item.id],
            };
            // сгенерированные страницы
            return (
              <SubTab
                key={item.id}
                footer={Boolean(item.footer)}
                lable={item.show_label ? item.name : null}
                data={assignData}
                currentData={this.state.valuesStorage}
                editing={this.state.editing}
                indexParent={item.id}
                navigation={this.props.navigation}
              />
            );
          })}
        </PagerView>
        {/* меню действий с карточкой */}
        <MenuActions
          visible={this.state.menuShow}
          callClose={() => this.setState({menuShow: false})}
          callCopy={() => {
            this.props.navigation.push('Student', {
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
      </>
    );
  }
}
