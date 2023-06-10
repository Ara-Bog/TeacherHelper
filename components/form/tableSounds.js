import React, {Component, useState, useMemo} from 'react';
import {Text, View, TouchableOpacity, FlatList, Alert} from 'react-native';
import Modal from 'react-native-modal';

// НУЖНАЯ ОПТИМИЗАЦИЯ ЗВУКОВ

function ModalMainCol({label, values, callback}) {
  // Модельное представление ввода основных данных строки
  // props:
  // - label: String -- заголовок блока
  // - values: Object -- структура блока
  // props-functions:
  // - callback (data: object, continueEdit: bool) -- возврат объекта с новыми данными и флагом продолжения редактирования

  // текущее состояние значений
  const [currentVals, setVals] = useState([]);

  // обработка нажатия чекера
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
    // ошибка отправки
    if (!currentVals.length) {
      Alert.alert(
        'Ошибка',
        'Чтобы выполнить действие - необходимо выбрать минимум 1 звук',
      );
      return;
    }
    // объект на вывод
    outList = Object.assign(...currentVals.map(e => Object({[e]: []})));
    //  возврат значений
    callback(outList, flag);
  };

  // элемент списка
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
        {/* список значений */}
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
  // Модельное представление ввода не основных данных строки
  // props:
  // - data: Array <Object> -- структура блоков с элементами
  // - values: Object -- текущие значения для каждой строки
  // props-functions:
  // - callback (data: object) -- возврат объекта с новыми данными

  // оптимизация повторного вызова
  const structVals = useMemo(() => {
    return Object.assign(
      ...data.map(e => Object({[e.id]: Object.keys(e.values)})),
    );
  });

  // состояние текущих значений
  // в редактирование можно зайти, если все элементы одной структуры или он в принципе 1
  const [currentVals, setVals] = useState(
    Object.assign(
      // обходим переданную структуру
      ...Object.keys(structVals).map(key =>
        // возвращаеем объект где ключ - блок (симптоматика); значение - выбранные данные для блока
        Object({
          [key]:
            (Object.values(values)[0] || []).filter(v =>
              structVals[key].includes(v),
            ) || [],
        }),
      ),
    ),
  );

  // объект блоков с блокирующими значениями (в частности для checker_only)
  // ключ - блок, значение - список id's тип которых checker_only
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

  // обработка выбора значения
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

  // блок списка
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

  // элемент блока
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

export default class TableDefault extends Component {
  // ОписаниеОбъекта
  // props (ТОЛЬКО ИСПОЛЬЗУЕМЫЕ!):
  // - childrenElements: type -- описание
  // - value: Array<Array> -- текущие значения блока
  // - editing: bool -- описание
  // props-functions:
  // - onChange (values: Array<Array>) -- возврат массива списков значения

  constructor(props) {
    super(props);
    this.state = {
      // данные индексируемой колонки
      mainCol: {},
      // данные остальных колонок
      subCols: [],
      // текущие значения
      values: [],
      // состояние выбора
      onSelect: false,
      // выбранные строки
      selected: [],
      // статус эквивалентности строк (для множественного редактирования)
      equalsSelected: false,
      // флаг открытия выбора значения индексируемой колонки
      showMainModal: false,
      // флаг открытия выбора значений для остальных колонок
      showSubModal: false,
      // редактируемая строка (временныое хранилище)
      editingRow: {},
    };

    // заполнение state
    // обход всех колонок таблицы
    Object.keys(props.childrenElements).forEach(keyItem => {
      // копируем текущий элемент
      var curElem = Object.assign({}, props.childrenElements[keyItem]);
      // преобразовываем values колонки из Array в Object
      var newVals = {};
      curElem.values.forEach(item => {
        newVals[item.id] = {label: item.label, type: item.type};
      });
      curElem.values = newVals;
      // сохраняем ключ элемента
      curElem.id = keyItem;
      // отдельная обработка для индексируемой колонки
      if (curElem.type === 'table_col_main') {
        this.state.mainCol = curElem;
        var rowsKeys = Object.keys(newVals);
        // заполняем значения в виде Object <Array> (изначально это Array <Array>)
        for (let arr of props.value) {
          // преобразовываем числа к строке
          arr = arr.map(String);
          // ищем ключ, который является значением основной колонки
          findEl = arr.findIndex(el => rowsKeys.includes(el));
          this.state.values[arr.splice(findEl, 1)] = arr;
        }
      } else {
        this.state.subCols.push(curElem);
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let flagChange = false;
    if (this.props.value.length != nextProps.length) {
      flagChange = true;
    } else {
      for (let [item, index] of nextProps.value.entries()) {
        let curItem = this.props.value;
        if (item.length != curItem[index].length || flagChange) {
          console.log('gg');
          flagChange = true;
          break;
        }
        flagChange = item.evey(el => curItem.includes(String(el)));
      }
    }

    if (flagChange) {
      this.state.values = {};

      var rowsKeys = Object.keys(this.state.mainCol.values);
      // заполняем значения в виде Object <Array> (изначально это Array <Array>)
      for (let arr of nextProps.value) {
        // преобразовываем числа к строке
        arr = arr.map(String);
        // ищем ключ, который является значением основной колонки
        findEl = arr.findIndex(el => rowsKeys.includes(el));
        this.state.values[arr.splice(findEl, 1)] = arr;
      }
    }
    return true;
  }

  // проверка эквивалентности строки с первой
  checkEquals(key) {
    // сначала проверяем на размерность (если отличается, то строки очевидно отличаются)
    if (
      this.state.values[this.state.selected[0]].length !==
      this.state.values[key].length
    ) {
      return false;
    }
    // возвращаем истинку, если все значения рассматриваемой строки содержаться в первой строке
    return this.state.values[this.state.selected[0]].every(el =>
      this.state.values[key].includes(el),
    );
  }

  // алгоритм выбора строк
  selectRow(key) {
    // при первом выборе строки
    if (!this.state.onSelect) {
      this.setState({onSelect: true, equalsSelected: true, selected: [key]});
      return;
    }

    // проверяем, строка уже выбрана или нет
    let curPos = this.state.selected.indexOf(key);
    if (curPos === -1) {
      // проверяем на эквивалентность, если мы ее отслеживаем
      if (this.state.equalsSelected) {
        this.state.equalsSelected = this.checkEquals(key);
      }
      this.state.selected.push(key);
      this.state.onSelect = true;
    } else {
      // снимаем выделение строки
      this.state.selected.splice(curPos, 1);
      // если выбрана только 1 строка, то эквивалентность = истина
      if (this.state.selected.length == 1) {
        this.state.equalsSelected = true;
      } else if (this.state.selected.length == 0) {
        // выделение снято со всех строк
        this.state.onSelect = false;
        this.state.equalsSelected = false;
      } else {
        // нужно проверить каждый элемент (кроме первого) на эквивалентность
        let equals = true;
        for (let item of this.state.selected.slice(
          1,
          this.state.selected.length,
        )) {
          equals = this.checkEquals(item);
          if (!equals) {
            break;
          }
        }
        this.state.equalsSelected = equals;
      }
    }

    this.forceUpdate();
  }

  // удаление выбранных строк
  async removeRow() {
    let confirmAction = new Promise((resolve, reject) => {
      Alert.alert(
        'Подтвердите действие',
        'Вы действительно хотите удалить выделенные данные из таблиц?',
        [
          {
            text: 'Да',
            onPress: () => resolve(),
          },
          {
            text: 'Нет',
            onPress: () => reject(),
            style: 'cancel',
          },
        ],
      );
    });

    confirmAction.then(() => {
      let newValues = Object.fromEntries(
        Object.entries(this.state.values).filter(
          ([key, item]) => !this.state.selected.includes(key),
        ),
      );
      this.updateValues(newValues);
    });
  }

  // редактирование строк(-и)
  changeValues(listKeys) {
    this.setState({
      editingRow: Object.assign(
        ...listKeys.map(key => Object({[key]: this.state.values[key]})),
      ),
      showSubModal: true,
    });
  }

  // обновление текущих значений
  updateValues(newValues) {
    // отправляем callback в виде Array<Array>
    this.props.onChange(
      Object.keys(newValues).map(key => [key, ...newValues[key]]),
    );
    // обновляем состояния
    this.setState({
      showMainModal: false,
      showSubModal: false,
      editingRow: {},
      values: newValues,
      onSelect: false,
      selected: [],
      equalsSelected: false,
    });
  }

  render() {
    return (
      <>
        {/* table  */}
        <View style={Styles.tableWrap}>
          {/* header table */}
          <View style={Styles.table_header}>
            <Text key={0} style={Styles.table_headerText}>
              {this.state.mainCol.label}
            </Text>
            {this.state.subCols.map((item, index) => {
              return (
                <Text key={index + 1} style={Styles.table_headerText}>
                  {item.label}
                </Text>
              );
            })}
          </View>
          {/* content */}
          {Object.keys(this.state.values).map(key => {
            // значение основной колонки строки
            var mainVal = this.state.mainCol.values[key];
            // значения остальных колонок по строке
            var subVals = this.state.subCols.map(subItem => {
              mainKey = this.state.values[key]
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
                disabled={!this.props.editing}
                onLongPress={() => this.selectRow(key)}
                onPress={() =>
                  this.state.onSelect
                    ? this.selectRow(key)
                    : this.changeValues([key])
                }
                key={key}
                style={[
                  Styles.table_row,
                  this.state.selected.includes(key)
                    ? {backgroundColor: '#EEEDFE'}
                    : null,
                ]}>
                {/* основной столбец */}
                <View style={{flex: 1}}>
                  <Text
                    style={[
                      Styles.table_rowText,
                      this.state.selected.includes(key)
                        ? {backgroundColor: '#554AF0', color: '#FFF'} // строка выбрана
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
                          this.state.selected.includes(key)
                            ? {backgroundColor: '#554AF0', color: '#FFF'} // строка выбрана
                            : null,
                          subItem.label.length === 0
                            ? {
                                color: this.state.selected.includes(key)
                                  ? '#554AF0'
                                  : '#9B9AA5',
                                backgroundColor: 'transparent',
                              } // в столбце пусто
                            : null,
                        ]}>
                        {/* доп обработка для множественного выбора (берется 1 символ в верхнем регистре) */}
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
          {Object.keys(this.state.values).length === 0 ? (
            <View style={Styles.table_row}>
              <Text style={Styles.table_empty}>Таблица не заполненна</Text>
            </View>
          ) : null}
        </View>
        {/* actions */}
        {this.props.editing ? (
          <View style={{gap: 15, flexDirection: 'row'}}>
            {this.state.onSelect ? (
              <>
                {this.state.equalsSelected ? (
                  <TouchableOpacity
                    style={[Styles.opacityButton, {flex: 1}]}
                    onPress={() => this.changeValues(this.state.selected)}>
                    <Text style={Styles.opacityButtonText}>Редактировать</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[Styles.buttonRed, {flex: 1}]}
                  onPress={() => this.removeRow()}>
                  <Text style={Styles.buttonRedText}>Удалить</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[Styles.opacityButton, {flex: 1}]}
                onPress={() => this.setState({showMainModal: true})}>
                <Text style={Styles.opacityButtonText}>Добавить</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
        {/* модалка выбора значения основной колонки */}
        <Modal
          isVisible={this.state.showMainModal}
          onBackButtonPress={() => this.setState({showMainModal: false})}
          onBackdropPress={() => this.setState({showMainModal: false})}>
          <ModalMainCol
            label={this.state.mainCol.label}
            values={this.state.mainCol.values}
            callback={(val, flagContinue) => {
              flagContinue
                ? this.setState({
                    showMainModal: false,
                    showSubModal: true,
                    editingRow: val,
                  })
                : this.updateValues({...this.state.values, ...val});
            }}
          />
        </Modal>
        {/* модалка выбора значений остальных колонок */}
        <Modal
          isVisible={this.state.showSubModal}
          onBackButtonPress={() => this.setState({showSubModal: false})}
          onBackdropPress={() => this.setState({showSubModal: false})}>
          <ModalSubCols
            data={this.state.subCols}
            values={this.state.editingRow}
            callback={val => {
              this.updateValues({...this.state.values, ...val});
            }}
          />
        </Modal>
      </>
    );
  }
}
