import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import ListCards from '../components/listCards';
import CheckBoxList from '../components/form/checkBoxList';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export default class ListStudentsWrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataStudents: [],
      dataType: 'Student',
      saveData: [],
      testData: {},
      testCurentValues: {},
    };

    // ПЕРЕНЕСТИ В ФИЛЬТРЫ
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Categories`,
        [],
        (_, {rows}) => {
          this.state.testData['Возрастная группа'] = rows.raw();
        },
        (_, err) =>
          console.log('error testGetFiltersField (Categories) - ', err),
      );
      tx.executeSql(
        `SELECT * FROM Templates`,
        [],
        (_, {rows}) => {
          this.state.testData['Шаблон'] = rows.raw();
        },
        (_, err) =>
          console.log('error testGetFiltersField (Templates) - ', err),
      );
      tx.executeSql(
        `SELECT * FROM Diagnosis`,
        [],
        (_, {rows}) => {
          this.state.testData['Заключение ЦПМПК'] = rows.raw();
        },
        (_, err) =>
          console.log('error testGetFiltersField (Diagnosis) - ', err),
      );
    });
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => this.getData());
  }

  // удаление пользователя с подтверждением
  deleteUser(currentList) {
    db.transaction(tx => {
      currentList.map(id => {
        tx.executeSql(
          "DELETE FROM Timetable WHERE id_client = ? AND type_client = 's'",
          [id],
          () => null,
          (_, err) => (
            Alert.alert('Произошла непредвиденная ошибка!'),
            console.log('error removeStudent (timetable) - ', err)
          ),
        );
        tx.executeSql(
          'DELETE FROM CurrentSymptoms WHERE id_student = ?',
          [id],
          () => null,
          (_, err) => (
            Alert.alert('Произошла непредвиденная ошибка!'),
            console.log('error removeStudent (CurrentSymptoms) - ', err)
          ),
        );
        tx.executeSql(
          'DELETE FROM students WHERE id = ?',
          [id],
          () => Alert.alert('Карточка успешно удаленна'),
          (_, err) => (
            Alert.alert('Произошла непредвиденная ошибка!'),
            console.log('error removeStudent (students) - ', err)
          ),
        );
      });
    });
    this.getData();
  }

  // запрос списка учеников
  getData() {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT st.id as ID, ct.name as LeftBot, dg.name as RightBot, 
                st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as LeftTop 
        FROM Students as st 
        INNER JOIN Diagnosis as dg ON st.id_diagnos = dg.id
        INNER JOIN Categories as ct ON st.id_category = ct.id`,
        [],
        (_, {rows}) => {
          let qwe = rows.raw();
          this.setState({dataStudents: qwe, saveData: qwe});
          this.props.navigation.setOptions({
            title: `Ученики (${this.state.dataStudents.length})`,
          });
        },
        (_, err) => console.log('error getData - ', err),
      );
    });
  }

  render() {
    return (
      <View style={Styles.container}>
        {/* <ListCards
          onCallDeleteData={currentList => this.deleteUser(currentList)}
          data={this.state.dataStudents}
          typeData={'Student'}
          navigation={this.props.navigation}
        /> */}
        <CheckBoxList
          data={this.state.testData}
          currentValues={this.state.testCurentValues}
        />
      </View>
    );
  }
}
