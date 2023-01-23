import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';

export default class SelectedInList extends Component {
  // получает:
  // - массив выбранных значений -- currentValues: Array[Object]
  // - sql запрос для получения возможных значений -- sqlText: String
  // - массив аргументов для sql -- sqlArgs: Array[Any]
  // - заголовок текущих значений -- labelCurrent: String
  // - заголовок доступных -- labelPossible: String
  // --
  // возврат:
  // - массив выбранных значений -- onReturnData(data: Array[Object])
  constructor(props) {
    super(props);
    this.state = {
      currentValues: [...this.props.currentValues],
      possibleValues: [],
    };

    // получение данных с базы по переданному sql
    db.transaction(tx => {
      tx.executeSql(
        this.props.sqlText,
        this.props.sqlArgs,
        (_, {rows}) => this.setState({possibleValues: rows.raw()}),
        er => console.log('error getPossibleValues - ', er),
      );
    });
  }

  // добавление/удаление выбранных значений с возвратом родительскому компоненту
  changedList(ID_onList, adding) {
    let addingList, removingList;

    if (adding) {
      addingList = this.state.currentValues;
      removingList = this.state.possibleValues;
    } else {
      removingList = this.state.currentValues;
      addingList = this.state.possibleValues;
    }

    addingList.push(removingList.splice(ID_onList, 1)[0]);
    this.props.onReturnData(this.state.currentValues);
  }

  render() {
    return (
      <>
        <View>
          <Text style={Styles.cardBlockTitle}>{this.props.labelCurrent}</Text>
          <ScrollView style={Styles.selectedList} contentContainerStyle={{}}>
            {this.state.currentValues.length != 0 ? (
              this.state.currentValues.map((item, indexItem) => (
                <View style={Styles.selectedListRow} key={item.id}>
                  <Text style={Styles.selectedListRowText}>{item.name}</Text>
                  <TouchableOpacity
                    style={{
                      ...Styles.selectedListRowBtn,
                      backgroundColor: '#fcefef',
                    }}
                    onPress={() => this.changedList(indexItem, false)}>
                    <Icons.Feather name="minus" size={16} color="#DC5F5A" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text
                style={{
                  ...Styles.emptyValue,
                  marginBottom: 25,
                  marginLeft: 0,
                  width: '100%',
                }}>
                Ничего не выбранно
              </Text>
            )}
          </ScrollView>
        </View>
        <View>
          <Text style={Styles.cardBlockTitle}>{this.props.labelPossible}</Text>
          <ScrollView style={Styles.selectedList} contentContainerStyle={{}}>
            {this.state.possibleValues.length != 0 ? (
              this.state.possibleValues.map((item, indexItem) => (
                <View style={Styles.selectedListRow} key={item.id}>
                  <Text style={Styles.selectedListRowText}>{item.name}</Text>
                  <TouchableOpacity
                    style={{
                      ...Styles.selectedListRowBtn,
                      backgroundColor: '#EEEDFE',
                    }}
                    onPress={() => this.changedList(indexItem, true)}>
                    <Icons.Feather name="plus" size={16} color="#554AF0" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text
                style={{...Styles.emptyValue, marginBottom: 25, marginLeft: 0}}>
                Список пуст
              </Text>
            )}
          </ScrollView>
        </View>
      </>
    );
  }
}
