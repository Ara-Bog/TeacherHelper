import React, {Component} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import ListCards from '../components/listCards';
import SQLite from 'react-native-sqlite-storage';
import SearchBar from '../components/elements/searchBar';
import {setUserSetting} from '../actions/userSettings';
import RowSwitcher from '../components/elements/switcherInLine';
import {deleteUser} from '../actions/actinonsDB';

SQLite.enablePromise(true);

export default class ListStudentsWrap extends Component {
  // главная страница блока "ученики"
  constructor(props) {
    super(props);
    this.state = {
      // текущие данные учеников
      dataStudents: [],
      // все данные учеников
      defaultData: [],
      // отфильтрованные данные учеников
      filterData: [],
      // флаг использования фильтра
      filterUsed: false,
      // тип данных (страница)
      dataType: 'Student',
      // текст поиска
      currentSearch: '',
      // последние сохраненные состояния раскрывающихся списков фильтра
      showLabels: [],
      // текущие параметры отбора
      currentFilter: {
        'Возрастная группа': [],
        Шаблон: [],
        'Заключение ЦПМПК': [],
      },
      // флаг больших карточек
      bigSizeCards: userSettings.bigCardStudent,
      loading: true,
    };
    // добавление кнопки фильтра (фильтр идет страницей в стаке в App)
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Filter', {
              currentFilter: this.state.currentFilter,
              showLabels: this.state.showLabels,
              pageBack: 'ListStudents',
            })
          }>
          <Icons.Ionicons name="filter" color="#554AF0" size={25} />
        </TouchableOpacity>
      ),
    });
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
      this.setState({bigSizeCards: userSettings.bigCardStudent});
      if (resetFilters) {
        // сбрасываем фараметры, чтобы setFilters не запускался
        this.props.route.params = undefined;
        // сбрасываем фильтры и открытые вкладки
        this.setState({
          filterData: [...this.state.dataStudents],
          showLabels: [],
          filterUsed: false,
          currentSearch: '',
          currentFilter: {
            'Возрастная группа': [],
            Шаблон: [],
            'Заключение ЦПМПК': [],
          },
          loading: true,
        });
        // возвращаем флаг в исходное положение
        resetFilters = false;
      }
      // делаем запрос в базу, для полученяи списка учеников
      this.getData();
    });
  }

  // удаление ученика
  async removeCard(currentList) {
    // удаляем каждый id
    await currentList.forEach(id => deleteUser(id));

    // удаляем id из основного списка
    this.state.defaultData = this.state.defaultData.filter(item => {
      return !currentList.includes(item.ID);
    });

    // фильтруем повторно, т.к. данные изменились
    this.setFilters();
  }

  // запрос списка учеников
  getData() {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT st.id as ID, ct.name as LeftBot, ct.id as LeftBot_id, 
                dg.name as RightBot, dg.id as RightBot_id, 
                st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as LeftTop,
                tp.name as RightTop, tp.id as RightTop_id,
                tp.name as template, tp.id as id_template
        FROM Students as st 
        LEFT JOIN Templates as tp ON st.id_template = tp.id
        LEFT JOIN Diagnosis as dg ON st.id_diagnos = dg.id
        LEFT JOIN Categories as ct ON st.id_category = ct.id`,
        [],
        (_, {rows}) => {
          let data = rows.raw();
          // сохраняем данные в 2 переменны, чтобы для фильтрации брать один и сохранять в другой
          this.setState({
            dataStudents: data,
            defaultData: data,
            filterData: data,
            loading: false,
          });
          // меняем заголовок, добавляем количество записей
          this.props.navigation.setOptions({
            title: `Ученики (${data.length})`,
          });
          // стартуем фильтрацию
          this.setFilters();
        },
        (_, err) => console.log('error getData - ', err),
      );
    });
  }

  // фильтрация карточек
  setFilters() {
    // фильтры не были переданы
    if (this.props.route.params === undefined) {
      // параметров нет - фильтрации нет, устанавливает список по умолчанию
      this.setState({filterData: [...this.state.defaultData]});
      // вызываем поиск (т.к. фильтр мог установится после ввода)
      this.search(this.state.currentSearch);
      return;
    }

    // ссылка на текущие значения с фильтра
    let currentValues = this.props.route.params.listChecked;
    // для хранения новых данных по ученикам
    let newData;
    // распаковываем подмасивы и смотрим количество значений
    // когда 0 - фильтр сбрасывается
    if (Object.values(currentValues).flat().length > 0) {
      // фильтруем учеников на соответсвие выходных данных фильтра
      newData = this.state.defaultData.filter(
        item =>
          currentValues['Возрастная группа'].includes(item.LeftBot_id) ||
          currentValues['Шаблон'].includes(item.RightTop_id) ||
          currentValues['Заключение ЦПМПК'].includes(item.RightBot_id),
      );
      // фильтр используется
      this.setState({filterUsed: true});
    } else {
      // возвращаем данные из второго хранилища
      newData = [...this.state.defaultData];
      // фильтр больше не используется
      this.setState({filterUsed: false});
    }

    // устанавливаем все новые значения
    this.setState({
      filterData: newData,
      showLabels: [...this.props.route.params.showLabels],
      currentFilter: currentValues,
      dataStudents: newData,
    });

    // вызываем поиск (т.к. фильтр мог установится после ввода)
    this.search(this.state.currentSearch);
  }

  // поиск учеников
  search(val) {
    // для хранения новых данных по ученикам
    let newData;

    if (val.length > 0) {
      // ищем по отфильтрованным данным учеников
      newData = this.state.filterData.filter(
        item => item.LeftTop.toLowerCase().indexOf(val.toLowerCase()) != -1,
      );

      // сколько из скольки выведено
      tempTitle = `Ученики (${newData.length}/${this.state.defaultData.length})`;
    } else {
      // возвращаем данные из хранилища фильтра
      newData = [...this.state.filterData];

      // когда фильтр активны - оставляем "сколько из скольки"
      if (this.state.filterUsed) {
        tempTitle = `Ученики (${newData.length}/${this.state.defaultData.length})`;
      } else {
        // сбрасываем на "сколько всего"
        tempTitle = `Ученики (${this.state.defaultData.length})`;
      }
    }

    // обновляем текущие данные
    this.setState({dataStudents: newData});

    // установка титульника
    this.props.navigation.setOptions({
      title: tempTitle,
    });
  }

  render() {
    if (this.state.loading) {
      return;
    }

    return (
      <View style={Styles.container}>
        <View style={{gap: 10, marginBottom: 30}}>
          <SearchBar
            value={this.state.currentSearch}
            onChange={val => {
              this.setState({currentSearch: val});
              this.search(val);
            }}
          />
          {userSettings.sizeCardAll.length === 2 ? (
            <RowSwitcher
              label="Расширенные карточки"
              currentValue={this.state.bigSizeCards}
              onCallBack={val => {
                setUserSetting('bigCardStudent', val);
                this.setState({bigSizeCards: val});
              }}
            />
          ) : null}
        </View>
        <ListCards
          onCallDeleteData={currentList => this.removeCard(currentList)}
          data={this.state.dataStudents}
          bigSizeCards={this.state.bigSizeCards}
          typeData={'Student'}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}
