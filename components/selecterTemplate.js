import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Text, View, ScrollView} from 'react-native';
import RadioBlock from './form/radioBlock';
import {getDB} from '../database/connection';

export default function SelectorTemplates({selectTemp, goSettings}) {
  const [selectValue, setSelectValue] = useState(null);
  const [selectId, setSelectId] = useState(null);
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    if (userSettings.templates.length > 1) {
      setDataset(userSettings.templates);
    } else {
      const db = getDB();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT id, name as label FROM Templates',
          [],
          (_, {rows}) => setDataset(rows.raw()),
        );
      });
    }
  }, []);

  return (
    <View style={{justifyContent: 'space-between', flex: 1}}>
      <View style={{gap: 20}}>
        <Text style={Styles.cardBlockTitle}>Выберите шаблон</Text>
        <ScrollView
          style={{...Styles.cardBlock, height: 200}}
          contentContainerStyle={{gap: 15}}>
          <RadioBlock
            values={[null]}
            data={dataset}
            editing={true}
            onCallBack={(key, val) => {
              setSelectId(key);
              setSelectValue(val);
            }}
            required={true}
          />
        </ScrollView>
      </View>
      <View style={{gap: 15}}>
        <TouchableOpacity style={Styles.opacityButton} onPress={goSettings}>
          <Text style={Styles.opacityButtonText}>Настройки</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.submitBtn}
          onPress={() => selectTemp(selectId, selectValue)}>
          <Text style={Styles.submitBtnText}>Подтвердить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
