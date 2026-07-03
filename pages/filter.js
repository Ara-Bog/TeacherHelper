import React, {useState, useRef, useReducer, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView, Text} from 'react-native';
import DropdownLabel from '../components/elements/dropdownLabel';
import Checkbox from '../components/form/checkbox';
import {
  getFilterCategories,
  getFilterTemplates,
  getFilterDiagnoses,
} from '../database/repositories/filterRepo';
import {getDB} from '../database/connection';

export default function FilterPage({route, navigation}) {
  const params = {...route.params};

  const [listChecked, setListChecked] = useState(params.currentFilter);
  const [data, setData] = useState({});
  const showLabelsRef = useRef([...params.showLabels]);
  const listCheckedRef = useRef(params.currentFilter);
  const pageBack = params.pageBack;

  // Keep ref in sync
  listCheckedRef.current = listChecked;

  useEffect(() => {
    const db = getDB();
    let newData = {};
    db.transaction(tx => {
      getFilterCategories(tx, result => {
        newData = {...newData, ['Возрастная группа']: result};
      });
      getFilterTemplates(tx, result => {
        newData = {...newData, ['Шаблон']: result};
      });
      getFilterDiagnoses(tx, result => {
        newData = {...newData, ['Заключение ЦПМПК']: result};
        setData(newData);
      });
    });
  }, []);

  const selectVal = (label, val) => {
    let currentList = listCheckedRef.current[label];
    let indexVal = currentList.indexOf(val);

    if (indexVal >= 0) {
      currentList.splice(indexVal, 1);
    } else {
      currentList.push(val);
    }

    listCheckedRef.current[label] = currentList;
  };

  const labelAction = val => {
    let currentList = [...showLabelsRef.current];
    let indexVal = currentList.indexOf(val);

    if (indexVal >= 0) {
      currentList.splice(indexVal, 1);
    } else {
      currentList.push(val);
    }

    showLabelsRef.current = currentList;
  };

  return (
    <>
      <View style={Styles.seqLineHeader}></View>
      <View style={{...Styles.container, backgroundColor: '#fff'}}>
        <ScrollView contentContainerStyle={{gap: 15}}>
          {Object.keys(data).map((label, index) => (
            <DropdownLabel
              key={index}
              id={index}
              label={label}
              data={data[label]}
              show={showLabelsRef.current.includes(index)}
              editing={true}
              setCheck={() => labelAction(index)}>
              <Checkbox
                onCallBack={val => selectVal(label, val)}
                isSelected={val =>
                  listCheckedRef.current[label].includes(val)
                }
              />
            </DropdownLabel>
          ))}
          <View style={Styles.crutch}></View>
        </ScrollView>
        <View style={Styles.filterButtons}>
          <TouchableOpacity
            style={Styles.buttonRed}
            onPress={() => {
              const reset = {
                'Возрастная группа': [],
                Шаблон: [],
                'Заключение ЦПМПК': [],
              };
              listCheckedRef.current = reset;
              setListChecked(reset);
            }}>
            <Text style={Styles.buttonRedText}>Сбросить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.submitBtn}
            onPress={() => {
              navigation.navigate(pageBack, {
                listChecked: listCheckedRef.current,
                showLabels: showLabelsRef.current,
              });
            }}>
            <Text style={Styles.submitBtnText}>Применить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
