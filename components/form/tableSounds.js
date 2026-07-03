import React, {useState, useRef, useReducer, useMemo} from 'react';
import {Text, View, TouchableOpacity, FlatList, Alert} from 'react-native';
import Modal from '../elements/AppModal';

// НУЖНАЯ ОПТИМИЗАЦИЯ ЗВУКОВ

function ModalMainCol({label, values, callback}) {
  const [currentVals, setVals] = useState([]);

  const handleVal = val => {
    let posVal = currentVals.indexOf(val);
    if (posVal == -1) {
      currentVals.push(val);
    } else {
      currentVals.splice(posVal, 1);
    }
    setVals([...currentVals]);
  };

  const prevCallback = flag => {
    if (!currentVals.length) {
      Alert.alert(
        'Ошибка',
        'Чтобы выполнить действие - необходимо выбрать минимум 1 звук',
      );
      return;
    }
    let outList = Object.assign(...currentVals.map(e => Object({[e]: []})));
    callback(outList, flag);
  };

  const itemList = ({item}) => {
    return (
      <TouchableOpacity
        key={item[0]}
        onPress={() => handleVal(item[0])}
        style={[
          Styles.table_modal_item,
          currentVals.includes(item[0]) ? {backgroundColor: '#554af01a'} : null,
        ]}>
        <Text
          style={[
            Styles.table_modal_itemText,
            currentVals.includes(item[0]) ? {color: '#554AF0'} : null,
          ]}>
          {item[1].label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.table_modalWrap}>
      <View style={{gap: 10}}>
        <Text style={Styles.table_modalTitle}>{label}</Text>
        <FlatList
          columnWrapperStyle={{gap: 5}}
          data={Object.entries(values)}
          renderItem={itemList}
          keyExtractor={item => item[0]}
          ItemSeparatorComponent={() => <View style={{height: 5}} />}
          numColumns={4}
        />
      </View>
      <View style={{flexDirection: 'row', gap: 5}}>
        <TouchableOpacity
          style={[Styles.opacityButton, {flex: 1}]}
          onPress={() => prevCallback(false)}>
          <Text style={Styles.opacityButtonText}>Сохранить</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[Styles.submitBtn, {flex: 1}]}
          onPress={() => prevCallback(true)}>
          <Text style={Styles.submitBtnText}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ModalSubCols({data, callback, values}) {
  const structVals = useMemo(() => {
    return Object.assign(
      ...data.map(e => Object({[e.id]: Object.keys(e.values)})),
    );
  });

  const [currentVals, setVals] = useState(
    Object.assign(
      ...Object.keys(structVals).map(key =>
        Object({
          [key]:
            (Object.values(values)[0] || []).filter(v =>
              structVals[key].includes(v),
            ) || [],
        }),
      ),
    ),
  );

  const [disabledOther, setDisabled] = useState(
    Object.assign(
      ...data.map(e =>
        Object({
          [e.id]:
            Object.keys(e.values).find(
              key => e.values[key].type === 'checker_only',
            ) || null,
        }),
      ),
    ),
  );

  const handleVal = (key, val, type) => {
    let posVal;
    switch (type) {
      case 'checkbox':
        posVal = currentVals[key].indexOf(val);
        if (posVal === -1) {
          currentVals[key].push(val);
        } else {
          currentVals[key].splice(posVal, 1);
        }
        break;
      case 'radio':
        currentVals[key] = [val];
        break;
      case 'checker_only':
        posVal = currentVals[key].indexOf(val);
        if (posVal === -1) {
          currentVals[key] = [val];
        } else {
          currentVals[key] = [];
        }
        break;
    }
    setVals({...currentVals});
  };

  const prevCallback = () => {
    let allCurrentVals = Object.values(currentVals).flat();

    let outputData = Object.assign(
      ...Object.keys(values).map(e => Object({[e]: allCurrentVals})),
    );
    callback(outputData);
  };

  const itemBlock = ({item}) => {
    return (
      <View style={{gap: 10}}>
        <Text style={Styles.table_modalTitle}>{item.label}</Text>
        <FlatList
          columnWrapperStyle={{gap: 5}}
          data={Object.entries(item.values)}
          renderItem={elem => itemList(elem, item.id)}
          keyExtractor={elem => elem[0]}
          extraData={currentVals[item.id]}
          ItemSeparatorComponent={() => <View style={{height: 5}} />}
          numColumns={2}
        />
      </View>
    );
  };

  const itemList = ({item}, key) => {
    return (
      <TouchableOpacity
        key={item[0]}
        onPress={() => handleVal(key, item[0], item[1].type)}
        disabled={
          currentVals[key].includes(disabledOther[key]) &&
          disabledOther[key] !== item[0]
        }
        style={[
          Styles.table_modal_item,
          {paddingVertical: 8, flex: 1},
          currentVals[key].includes(disabledOther[key]) &&
          disabledOther[key] !== item[0]
            ? {opacity: 0.3}
            : null,
          currentVals[key].includes(item[0])
            ? {backgroundColor: '#554af01a'}
            : null,
        ]}>
        <Text
          style={[
            Styles.table_modal_itemText,
            currentVals[key].includes(item[0]) ? {color: '#554AF0'} : null,
          ]}>
          {item[1].label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.table_modalWrap}>
      <FlatList
        data={data}
        renderItem={itemBlock}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View
            style={{height: 1, marginVertical: 20, backgroundColor: '#EBEBEB'}}
          />
        )}
      />
      <View style={{flexDirection: 'row', gap: 5}}>
        <TouchableOpacity
          style={[Styles.submitBtn, {flex: 1}]}
          onPress={() => prevCallback()}>
          <Text style={Styles.submitBtnText}>Сохранить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function parseInitialValues(childrenElements, value) {
  let mainCol = {};
  let subCols = [];
  let values = {};

  Object.keys(childrenElements).forEach(keyItem => {
    let curElem = Object.assign({}, childrenElements[keyItem]);
    let newVals = {};
    curElem.values.forEach(item => {
      newVals[item.id] = {label: item.label, type: item.type};
    });
    curElem.values = newVals;
    curElem.id = keyItem;

    if (curElem.type === 'table_col_main') {
      mainCol = curElem;
      let rowsKeys = Object.keys(newVals);
      for (let arr of value) {
        arr = arr.map(String);
        let findEl = arr.findIndex(el => rowsKeys.includes(el));
        values[arr.splice(findEl, 1)] = arr;
      }
    } else {
      subCols.push(curElem);
    }
  });

  return {mainCol, subCols, values};
}

export default function TableDefault({
  childrenElements,
  value,
  editing,
  onChange,
}) {
  const [, forceRender] = useReducer(x => x + 1, 0);

  const parsedRef = useRef(null);
  if (parsedRef.current === null) {
    parsedRef.current = parseInitialValues(childrenElements, value || []);
  }

  const mainCol = parsedRef.current.mainCol;
  const subCols = parsedRef.current.subCols;

  const [tableValues, setTableValues] = useState(parsedRef.current.values);
  const [onSelect, setOnSelect] = useState(false);
  const [selected, setSelected] = useState([]);
  const [equalsSelected, setEqualsSelected] = useState(false);
  const [showMainModal, setShowMainModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [editingRow, setEditingRow] = useState({});

  const checkEquals = (key, sel, vals) => {
    const selKeys = sel || selected;
    const curVals = vals || tableValues;
    if (curVals[selKeys[0]].length !== curVals[key].length) {
      return false;
    }
    return curVals[selKeys[0]].every(el => curVals[key].includes(el));
  };

  const selectRow = key => {
    if (!onSelect) {
      setOnSelect(true);
      setEqualsSelected(true);
      setSelected([key]);
      return;
    }

    let newSelected = [...selected];
    let curPos = newSelected.indexOf(key);
    let newEquals = equalsSelected;

    if (curPos === -1) {
      if (newEquals) {
        newEquals = checkEquals(key, newSelected, tableValues);
      }
      newSelected.push(key);
    } else {
      newSelected.splice(curPos, 1);
      if (newSelected.length == 1) {
        newEquals = true;
      } else if (newSelected.length == 0) {
        setOnSelect(false);
        setEqualsSelected(false);
        setSelected([]);
        return;
      } else {
        let equals = true;
        for (let item of newSelected.slice(1)) {
          equals = checkEquals(item, newSelected, tableValues);
          if (!equals) break;
        }
        newEquals = equals;
      }
    }

    setSelected(newSelected);
    setEqualsSelected(newEquals);
  };

  const removeRow = () => {
    let confirmAction = new Promise((resolve, reject) => {
      Alert.alert(
        'Подтвердите действие',
        'Вы действительно хотите удалить выделенные данные из таблиц?',
        [
          {text: 'Да', onPress: () => resolve()},
          {text: 'Нет', onPress: () => reject(), style: 'cancel'},
        ],
      );
    });

    confirmAction.then(() => {
      let newValues = Object.fromEntries(
        Object.entries(tableValues).filter(
          ([key]) => !selected.includes(key),
        ),
      );
      updateValues(newValues);
    });
  };

  const changeValues = listKeys => {
    setEditingRow(
      Object.assign(
        ...listKeys.map(key => Object({[key]: tableValues[key]})),
      ),
    );
    setShowSubModal(true);
  };

  const updateValues = newValues => {
    onChange(
      Object.keys(newValues).map(key => [key, ...newValues[key]]),
    );
    setTableValues(newValues);
    setShowMainModal(false);
    setShowSubModal(false);
    setEditingRow({});
    setOnSelect(false);
    setSelected([]);
    setEqualsSelected(false);
  };

  return (
    <>
      {/* table  */}
      <View style={Styles.tableWrap}>
        {/* header table */}
        <View style={Styles.table_header}>
          <Text key={0} style={Styles.table_headerText}>
            {mainCol.label}
          </Text>
          {subCols.map((item, index) => {
            return (
              <Text key={index + 1} style={Styles.table_headerText}>
                {item.label}
              </Text>
            );
          })}
        </View>
        {/* content */}
        {Object.keys(tableValues).map(key => {
          let mainVal = mainCol.values[key];
          let subVals = subCols.map(subItem => {
            let mainKey = tableValues[key]
              .sort()
              .filter(e => subItem.values[e]);
            return {
              id: subItem.id,
              key: mainKey,
              label: mainKey
                ? mainKey.map(el => subItem.values[el].label)
                : [],
            };
          });

          return (
            <TouchableOpacity
              disabled={!editing}
              onLongPress={() => selectRow(key)}
              onPress={() =>
                onSelect ? selectRow(key) : changeValues([key])
              }
              key={key}
              style={[
                Styles.table_row,
                selected.includes(key)
                  ? {backgroundColor: '#EEEDFE'}
                  : null,
              ]}>
              {/* основной столбец */}
              <View style={{flex: 1}}>
                <Text
                  style={[
                    Styles.table_rowText,
                    selected.includes(key)
                      ? {backgroundColor: '#554AF0', color: '#FFF'}
                      : null,
                  ]}>
                  {mainVal.label}
                </Text>
              </View>
              {/* остальные столбцы */}
              {subVals.map(subItem => {
                return (
                  <View key={subItem.id} style={{flex: 1}}>
                    <Text
                      style={[
                        Styles.table_rowText,
                        selected.includes(key)
                          ? {backgroundColor: '#554AF0', color: '#FFF'}
                          : null,
                        subItem.label.length === 0
                          ? {
                              color: selected.includes(key)
                                ? '#554AF0'
                                : '#9B9AA5',
                              backgroundColor: 'transparent',
                            }
                          : null,
                      ]}>
                      {subItem.label.length > 1
                        ? subItem.label
                            .map(el => el.charAt(0).toUpperCase())
                            .join(' + ')
                        : subItem.label.length == 1
                        ? subItem.label
                        : 'Не указано'}
                    </Text>
                  </View>
                );
              })}
            </TouchableOpacity>
          );
        })}
        {/* empty content */}
        {Object.keys(tableValues).length === 0 ? (
          <View style={Styles.table_row}>
            <Text style={Styles.table_empty}>Таблица не заполненна</Text>
          </View>
        ) : null}
      </View>
      {/* actions */}
      {editing ? (
        <View style={{gap: 15, flexDirection: 'row'}}>
          {onSelect ? (
            <>
              {equalsSelected ? (
                <TouchableOpacity
                  style={[Styles.opacityButton, {flex: 1}]}
                  onPress={() => changeValues(selected)}>
                  <Text style={Styles.opacityButtonText}>Редактировать</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[Styles.buttonRed, {flex: 1}]}
                onPress={() => removeRow()}>
                <Text style={Styles.buttonRedText}>Удалить</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[Styles.opacityButton, {flex: 1}]}
              onPress={() => setShowMainModal(true)}>
              <Text style={Styles.opacityButtonText}>Добавить</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
      {/* модалка выбора значения основной колонки */}
      <Modal
        isVisible={showMainModal}
        onBackButtonPress={() => setShowMainModal(false)}
        onBackdropPress={() => setShowMainModal(false)}>
        <ModalMainCol
          label={mainCol.label}
          values={mainCol.values}
          callback={(val, flagContinue) => {
            flagContinue
              ? (() => {
                  setShowMainModal(false);
                  setShowSubModal(true);
                  setEditingRow(val);
                })()
              : updateValues({...tableValues, ...val});
          }}
        />
      </Modal>
      {/* модалка выбора значений остальных колонок */}
      <Modal
        isVisible={showSubModal}
        onBackButtonPress={() => setShowSubModal(false)}
        onBackdropPress={() => setShowSubModal(false)}>
        <ModalSubCols
          data={subCols}
          values={editingRow}
          callback={val => {
            updateValues({...tableValues, ...val});
          }}
        />
      </Modal>
    </>
  );
}
