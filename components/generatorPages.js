import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import SymptomsForm from './form/radioBlock';
import TableSounds from '../components/elements/tableSounds';
import RadioBlock from './form/radioBlock';
// блоки редактирования
import InputView from '../components/form/inputView';
import Dropdown from './form/dropdown';
import BirhdayView from './form/birthday';
import ViewLinks from './form/viewLinks';
import Textarea from './form/textarea';
import DynamicBlock from './form/dynamicBlock';
import PhoneView from './form/phoneView';

// типы полей:
// +-- viewLinks
// +-- textarea
// +-- inputView
// =-- phone
// +-- dateTime
// =-- dynamicBlock
// +-- droplist
// -- label
// -- checker_only
// -- radio
// -- table
// -- checkbox
// -- custom
// -- check_labels

function getComponent({
  data,
  indexParent,
  currentVals,
  callback,
  addPlus,
  navigation,
}) {
  // общее хранилище элементов
  let massObjects = [];
  // хранилище последних элементов страницы
  let massLastObjects = [];
  // флаг проверки, что начались объекты по умолчанию
  let isNumber = true;
  // обход переданных полей
  Object.keys(data).forEach((key, indexEl) => {
    // когда ключ будет не число - флаг сниматеся
    if (isNaN(Number(key))) {
      isNumber = false;
    }
    // копирование объекта
    const curObj = data[key];
    // приведение индекса к дереву
    const index = [indexParent, indexEl].join('.');
    // пропсы по умолчанию
    let defData = {
      key: index,
      // обязательность поля
      requared: curObj.requared || false,
      // заголовок поля
      label: curObj.label,
      // колбэк на изменение значения в поле
      onChange: val => callback(key, val),
    };

    // ссылка на текущий массив
    let currMass;
    // когда у объекта стоит флаг last<Bool> или ключ этого объекта число
    // он будет добавлен в массив последних элементов
    if (curObj.last || isNumber) {
      currMass = massLastObjects;
    } else {
      currMass = massObjects;
    }

    // получение постфикса для реализации доп функционала
    let postfix;
    if (curObj.type.startsWith('dateTime')) {
      postfix = curObj.type.split('-')[1];
      curObj.type = 'dateTime';
    }

    // хранилище дочерних элементов
    let storageChildrens = {};
    // когда элемент является dynamicBlock необходимо вернуть callback,
    // что нужно добавить кнопку add в панель управления
    if (curObj.type === 'dynamicBlock') {
      let includeValues = currentVals[key];
      // создаем блоки с дочерними элементами по значениям
      Object.keys(currentVals[key]).forEach(indexEl => {
        let item = currentVals[key][indexEl];
        storageChildrens[indexEl] = getComponent({
          data: curObj.childrens,
          indexParent: [index, indexEl].join('.'),
          currentVals: item,
          callback: (keyChild, val) => {
            includeValues[indexEl][keyChild] ??= undefined;
            includeValues[indexEl][keyChild] = val;
            callback(key, includeValues);
          },
        });
      });
    } else if (curObj.childrens != undefined) {
      // asd = getComponent({
      //   data: curObj.childrens,
      //   indexParent: index,
      //   currentVals: currentVals,
      //   callback: callback,
      //   nasting: true,
      // });
    }

    // добавляем в массив объект ключа(по которому смотрятся значения) и функцию рендера
    // режим редактирования -- curEditing: Bool
    // значение (может быть массив) -- value: String || Int || Array<Object>
    // функция колбэка для телефона -- addedAction: Function
    // добавочное значение для отслеживания изменений в родителе -- addedValue: String || Int || Array<Object>
    currMass.push({
      key: key,
      render: (curEditing, value, addedAction, addedValue) => {
        switch (curObj.type) {
          case 'inputView':
            return (
              <InputView
                {...defData}
                value={value}
                editing={curEditing}
                addedValue={addedValue}
              />
            );
            break;
          case 'droplist':
            return (
              <Dropdown
                {...defData}
                editing={curEditing}
                value={value}
                // датасет для списка
                data={curObj.values}
              />
            );
            break;
          case 'dateTime':
            // ПЕРЕДЕЛАТЬ
            return (
              <BirhdayView
                {...defData}
                editing={curEditing}
                value={value}
                // тип пикера
                type={postfix}
                // заголовок при редактировании
                labelEdit={curObj.labelEdit}
              />
            );
            break;
          case 'textarea':
            return <Textarea {...defData} value={value} editing={curEditing} />;
            break;
          // DEV УДАЛЕНИЕ
          case 'dynamicBlock':
            return (
              <DynamicBlock
                {...defData}
                editing={curEditing}
                value={value}
                childrens={storageChildrens}
                getElements={(indexEl, vals) => {
                  return getComponent({
                    data: curObj.childrens,
                    indexParent: [index, indexEl].join('.'),
                    currentVals: {},
                    callback: (keyChild, val) => {
                      vals[indexEl][keyChild] ??= undefined;
                      vals[indexEl][keyChild] = val;
                      callback(key, vals);
                    },
                  });
                }}
                funcAdd={increment =>
                  addPlus(vals =>
                    callback(key, {
                      ...vals[key],
                      [increment++]: Object.assign(
                        {},
                        ...Object.keys(curObj.childrens).map(item => {
                          return {[item]: undefined};
                        }),
                      ),
                    }),
                  )
                }
              />
            );
            break;
          case 'viewLinks':
            return (
              <ViewLinks
                {...defData}
                editing={curEditing}
                value={value}
                navigate={curId =>
                  navigation.navigate('Group', {type: 'view', id: curId})
                }
              />
            );
            break;
          case 'phone':
            return (
              <PhoneView
                {...defData}
                editing={curEditing}
                value={value}
                callAction={val => addedAction(val)}
              />
            );
            break;
          // ЗАГЛУШКА
          default:
            return (
              <Text key={defData.key} style={{color: '#04021D', fontSize: 16}}>
                ЗАГЛУШКА
              </Text>
            );
            break;
        }
      },
    });
  });

  return [...massObjects, ...massLastObjects];
}

export default class SubTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSrtuct: JSON.parse(JSON.stringify(this.props.data)),
      defContent: [],
      mainContent: [],
      editing: this.props.editing,
      indexParent: this.props.indexParent,
    };

    if (this.state.defaultSrtuct != undefined) {
      this.state.defContent = getComponent({
        data: this.state.defaultSrtuct,
        indexParent: this.state.indexParent,
        currentVals: this.props.currentData,
        callback: (key, val) => {
          this.props.currentData[key] = val;
        },
        addPlus: func => this.props.useDynamic(func),
        navigation: this.props.navigation,
      });
    }
  }

  componentDidMount() {
    if (this.state.defContent.length == 0) {
      return false;
    }
  }

  render() {
    if (this.state.editing != this.props.editing) {
      this.state.editing = this.props.editing;
    }

    return (
      <View
        style={{
          ...Styles.container,
          backgroundColor: '#fff',
        }}>
        <ScrollView contentContainerStyle={{gap: 25}}>
          {this.props.lable === null ? null : <Text>{this.props.lable}</Text>}
          {this.state.defContent.map(item => {
            return item.render(
              this.state.editing,
              this.props.currentData[item.key],
            );
          })}
          {/* пустое пространство */}
          <View style={Styles.crutch}></View>
        </ScrollView>
      </View>
    );
  }
}
