import React, {Component} from 'react';
import {Alert, BackHandler} from 'react-native';
import SubTab from '../components/generatorPages';
import PagerView from 'react-native-pager-view';
import NavPage from '../components/elements/navPage';
import setHeaderNavigation from '../actions/changeHeader';
import {insertInto} from '../actions/sqlGenerator';
import SQLite from 'react-native-sqlite-storage';
import MenuActions from '../components/menuActions';
import {deleteGroup} from '../actions/actinonsDB';
import {
  saveConfirm,
  removeConfirm,
  undoConfirm,
  undoCreate,
} from '../actions/confirmAction';

SQLite.enablePromise(true);

export default class GroupPage extends Component {
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
      sections: [
        {
          id: 1,
          name: 'default_main',
          show_label: null,
          tab_name: 'Общие сведения',
          footer: null,
        },
        {
          id: 2,
          name: 'default_list',
          show_label: null,
          tab_name: 'Состав',
          footer: null,
        },
      ],

      // поля по умолчанию для основной страницы с данными выбора (если есть)
      defaultData: {
        default_main: {
          name: {
            label: 'Название',
            requared: true,
            type: 'inputView',
          },
          category: {
            label: 'Возрастная группа',
            requared: true,
            type: 'droplist',
          },
          diagnos: {
            label: 'Заключение ЦПМПК',
            requared: true,
            type: 'droplist',
          },
        },
        default_list: {
          list: {
            label: '',
            type: 'selectedInList',
            props: {
              sqlText: `
              SELECT st.id,
                  st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as name
              FROM Students as st
              WHERE st.id NOT IN (?) AND id_template = ?
              `,
              sqlArgs: ['', this.props.route.params.template.id],
              labelCurrent: 'Выбранные ученики',
              labelPossible: 'Общий список учеников',
            },
          },
        },
      },

      // данные для секций по id
      sectionsData: {},

      // текущие данные группы
      currentData: {list: []},

      // состояние загрузки данных с бд
      loading: true,

      // временное хранилище значений
      valuesStorage: {list: []},

      // состояние меню
      menuShow: false,
    };

    // способ открытия страницы
    currentType = this.state.options.type;
    // флаг, для запроса данных группы
    getGroup = currentType == 'add' ? false : true;
    // для уменьшения количества рендеров
    // данные обновляются без setState
    // в последней транзакции 2-х блоков меняется флаг загрузки

    // получение данных
    db.transaction(tx => {
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
        err => console.log('error groupPage get Diagnosis', err),
      );

      // получение категорий
      tx.executeSql(
        `
        SELECT *
        FROM Categories
        `,
        [],
        (_, {rows}) => {
          this.state.defaultData.default_main.category.values = rows.raw();
          if (!getGroup) {
            this.setState({loading: false});
          }
        },
        err => console.log('error groupPage get Categories', err),
      );

      // получение данных группы
      if (getGroup) {
        // ученики в группе
        tx.executeSql(
          `
          SELECT st.id, 
            st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as name
          FROM ListStudentsGroup as lsg
          LEFT JOIN Students as st ON st.id = lsg.id_student
          WHERE id_group = ?
          `,
          [this.state.options.id],
          (_, {rows}) => {
            let dataString = JSON.stringify(rows.raw());
            this.state.currentData.list = JSON.parse(dataString);
            this.state.valuesStorage.list = JSON.parse(dataString);
            this.state.defaultData.default_list.list.props.sqlArgs[0] =
              JSON.parse(dataString)
                .map(item => item.id)
                .join(', ');
          },
          err => console.log('error gropPage get cur students', err),
        );

        // данные группы
        tx.executeSql(
          `
          SELECT name, 
            id_diagnos as diagnos,
            id_category as category 
          FROM Groups
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
            this.setState({loading: false});
          },
          err => console.log('error groupPage get group', err),
        );
      }
    });

    this.setNavView = () =>
      setHeaderNavigation({
        mainTitle: 'Карточка группы',
        addedTitle: this.state.options.template.name,
        onPressRight: () => {
          this.setState({menuShow: true});
        },
        navigation: this.props.navigation,
        mode: 'menu',
      });

    this.setNavChange = () =>
      setHeaderNavigation({
        mainTitle: 'Редактирование группы',
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
          mainTitle: 'Новая группа',
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
          mainTitle: 'Копия группы',
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
        name: data.name,
        id_diagnos: data.diagnos,
        id_category: data.category,
        id_template: this.state.options.template.id,
      };
      newId = await insertInto([dataStudent], 'Groups', true);
      this.state.options.id = newId;
      this.state.options.type = 'view';
    } else {
      await db.transaction(tx => {
        // обновление данных группы
        tx.executeSql(
          `
          UPDATE Groups
          SET name = ?,
              id_diagnos = ?,
              id_category = ?
          WHERE id = ?
          `,
          [data.name, data.diagnos, data.category, this.state.options.id],
          null,
          err => (
            Alert.alert('Произошла ошибка!'),
            console.log('error groupPage updateBase', err)
          ),
        );

        // удаляем связей группы с учениками
        tx.executeSql(
          `
          DELETE FROM ListStudentsGroup
          WHERE id_group = ?
          `,
          [this.state.options.id],
          null,
          err => (
            Alert.alert('Произошла ошибка!'),
            console.log('error groupPage ListStudentsGroup', err)
          ),
        );
      });
    }

    this.addNewData(this.state.options.id);
  }

  // добавление новых записей в дб
  async addNewData(id) {
    await insertInto(
      this.state.currentData.list.map(item =>
        Object({id_group: id, id_student: item.id}),
      ),
      'ListStudentsGroup',
    );

    Alert.alert('Данные успешно обновлены!');
    // возвращаем заголовки
    this.setNavView();
    this.setState({editing: false});
  }

  async removeCard() {
    deleteGroup(this.state.options.id);
    Alert.alert('Карточка успешно удалена!');

    this.props.navigation.pop();
  }

  render() {
    // КОСТЫЛЬ МБ ПОМЕНЯТЬ (уменьшает нагрузку рендер страниц)
    if (this.state.loading) {
      return;
    }
    return (
      <>
        {/* верхняя навигация подстраниц */}
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
            this.props.navigation.pop();
            this.props.navigation.push('Group', {
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
