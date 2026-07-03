import React, {useState, useEffect, useReducer} from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {getDB} from '../../database/connection';

export default function SelectedInList({
  currentValues: initialValues,
  sqlText,
  sqlArgs,
  labelCurrent,
  labelPossible,
  editing,
  onChange,
}) {
  const [, forceRender] = useReducer(x => x + 1, 0);
  const [currentValues] = useState([...initialValues]);
  const [possibleValues, setPossibleValues] = useState([]);

  useEffect(() => {
    const db = getDB();
    db.transaction(tx => {
      tx.executeSql(
        sqlText,
        sqlArgs,
        (_, {rows}) => setPossibleValues(rows.raw()),
        er => console.log('error getPossibleValues - ', er),
      );
    });
  }, []);

  const changedList = (idOnList, adding) => {
    let addingList, removingList;

    if (adding) {
      addingList = currentValues;
      removingList = possibleValues;
    } else {
      removingList = currentValues;
      addingList = possibleValues;
    }

    addingList.push(removingList.splice(idOnList, 1)[0]);
    onChange(currentValues);
    forceRender();
  };

  const EmptyVal = label => (
    <Text style={{...Styles.emptyValue, marginBottom: 25}}>{label}</Text>
  );

  return (
    <View style={{gap: 30}}>
      {editing ? (
        <>
          <View style={Styles.cardBlock}>
            <Text style={Styles.cardBlockTitle}>{labelCurrent}</Text>
            <ScrollView
              style={Styles.selectedList}
              contentContainerStyle={{gap: 15}}>
              {currentValues.length != 0
                ? currentValues.map((item, indexItem) => (
                    <View style={Styles.selectedListRow} key={item.id}>
                      <Text style={Styles.selectedListRowText}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          ...Styles.selectedListRowBtn,
                          backgroundColor: '#fcefef',
                        }}
                        onPress={() => changedList(indexItem, false)}>
                        <Icons.Feather
                          name="minus"
                          size={16}
                          color="#DC5F5A"
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                : EmptyVal('Ничего не выбранно')}
            </ScrollView>
          </View>
          <View style={Styles.cardBlock}>
            <Text style={Styles.cardBlockTitle}>{labelPossible}</Text>
            <ScrollView
              style={Styles.selectedList}
              contentContainerStyle={{gap: 15}}>
              {possibleValues.length != 0
                ? possibleValues.map((item, indexItem) => (
                    <View style={Styles.selectedListRow} key={item.id}>
                      <Text style={Styles.selectedListRowText}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        style={{
                          ...Styles.selectedListRowBtn,
                          backgroundColor: '#EEEDFE',
                        }}
                        onPress={() => changedList(indexItem, true)}>
                        <Icons.Feather
                          name="plus"
                          size={16}
                          color="#554AF0"
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                : EmptyVal('Список пуст')}
            </ScrollView>
          </View>
        </>
      ) : currentValues.length != 0 ? (
        currentValues.map(item => (
          <View style={Styles.selectedListRow} key={item.id}>
            <Text style={Styles.selectedListRowText}>{item.name}</Text>
          </View>
        ))
      ) : (
        EmptyVal('Список пуст')
      )}
    </View>
  );
}
