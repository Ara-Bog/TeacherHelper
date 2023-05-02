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
import AddingButton from './elements/buttonAdd';

// блоки редактирования
import InputView from '../components/form/inputView';
import Dropdown from './form/dropdown';
import BirhdayView from './form/birthday';
import ViewLinks from './form/viewLinks';
import Textarea from './form/textarea';
import DynamicBlock from './form/dynamicBlock';
import PhoneView from './form/phoneView';
import CheckLabels from './form/checkLabels';

// типы полей {
// +-- viewLinks
// +-- textarea
// +-- inputView
// +-- phone
// +-- dateTime
// +-- dynamicBlock
// +-- droplist
// -- label
// -- checker_only
// -- radio
// -- table
// -- checkbox
// -- custom
// +-- check_labels
// }

// function getComponent({
//   data,
//   indexParent,
//   currentVals,
//   callback,
//   addPlus,
//   navigation,
//   nasting = false,
// }) {
//   // общее хранилище элементов
//   let massObjects = [];
//   // хранилище последних элементов страницы
//   let massLastObjects = [];
//   // флаг проверки, что начались объекты по умолчанию
//   let isNumber = true;
//   // хранилище списка значений
//   let values;
//   // экзэмпляр функции
//   let onChange;
//   // обход переданных полей
//   Object.keys(data).forEach((key, indexEl) => {
//     // когда ключ будет не число - флаг сниматеся
//     if (isNaN(Number(key))) {
//       isNumber = false;
//       values = currentVals[key];
//       onChange = val => callback(key, val);
//     } else {
//       onChange = val => callback(key, val, true);
//       values = currentVals.symptoms[key];
//     }
//     // копирование объекта
//     const curObj = data[key];
//     // приведение индекса к дереву
//     const index = [indexParent, indexEl].join('.');
//     // пропсы по умолчанию
//     let defData = {
//       key: index,
//       // обязательность поля
//       requared: curObj.requared || false,
//       // заголовок поля
//       label: curObj.label,
//       // колбэк на изменение значения в поле
//       onChange: onChange,
//       // значения заполнения
//       data: JSON.parse(JSON.stringify(curObj.values || [])),
//     };

//     // ссылка на текущий массив
//     let currMass;
//     // когда у объекта стоит флаг last<Bool> или ключ этого объекта число
//     // он будет добавлен в массив последних элементов
//     if (curObj.last || isNumber) {
//       currMass = massLastObjects;
//     } else {
//       currMass = massObjects;
//     }

//     // получение постфикса для реализации доп функционала блока dateTime
//     let postfix;
//     if (curObj.type.startsWith('dateTime')) {
//       postfix = curObj.type.split('-')[1];
//       curObj.type = 'dateTime';
//     }

//     // хранилище дочерних элементов
//     let storageChildrens = {};
//     // когда элемент является dynamicBlock необходимо вернуть callback,
//     // что нужно добавить кнопку add в панель управления
//     if (curObj.type === 'dynamicBlock') {
//       // создаем блоки с дочерними элементами по значениям
//       Object.keys(values).forEach(indexEl => {
//         let item = values[indexEl];
//         storageChildrens[indexEl] = getComponent({
//           data: curObj.childrens,
//           indexParent: [index, indexEl].join('.'),
//           currentVals: item,
//           callback: (keyChild, val) => {
//             values[indexEl][keyChild] ??= undefined;
//             values[indexEl][keyChild] = val;
//             callback(key, values, isNumber);
//           },
//         });
//       });
//     } else if (curObj.type === 'table') {
//       // отдельное поведение для таблицы
//     } else if (curObj.childrens != undefined) {
//       // console.log('test', curObj.childrens);
//     }

//     // добавляем в массив объект ключа(по которому смотрятся значения) и функцию рендера
//     // режим редактирования -- curEditing: Bool
//     // значение (может быть массив) -- value: String || Int || Array<Object>
//     // функция колбэка для телефона -- addedAction: Function
//     // добавочное значение для отслеживания изменений в родителе -- addedValue: String || Int || Array<Object>
//     currMass.push({
//       key: key,
//       render: (curEditing, value, addedAction, addedValue) => {
//         switch (curObj.type) {
//           case 'inputView':
//             return (
//               <InputView
//                 {...defData}
//                 value={value}
//                 editing={curEditing}
//                 addedValue={addedValue}
//               />
//             );
//             break;
//           case 'droplist':
//             return <Dropdown {...defData} editing={curEditing} value={value} />;
//             break;
//           case 'dateTime':
//             // ПЕРЕДЕЛАТЬ
//             return (
//               <BirhdayView
//                 {...defData}
//                 editing={curEditing}
//                 value={value}
//                 // тип пикера
//                 type={postfix}
//                 // заголовок при редактировании
//                 labelEdit={curObj.labelEdit}
//               />
//             );
//             break;
//           case 'textarea':
//             return <Textarea {...defData} value={value} editing={curEditing} />;
//             break;
//           case 'dynamicBlock':
//             return (
//               <DynamicBlock
//                 {...defData}
//                 editing={curEditing}
//                 value={value}
//                 childrens={storageChildrens}
//                 getElements={(indexEl, vals) => {
//                   return getComponent({
//                     data: curObj.childrens,
//                     indexParent: [index, indexEl].join('.'),
//                     currentVals: {},
//                     callback: (keyChild, val) => {
//                       vals[indexEl][keyChild] ??= undefined;
//                       vals[indexEl][keyChild] = val;
//                       callback(key, vals);
//                     },
//                   });
//                 }}
//                 funcAdd={increment =>
//                   addPlus(vals =>
//                     callback(key, {
//                       ...vals[key],
//                       [increment++]: Object.assign(
//                         {},
//                         ...Object.keys(curObj.childrens).map(item => {
//                           return {[item]: undefined};
//                         }),
//                       ),
//                     }),
//                   )
//                 }
//               />
//             );
//             break;
//           case 'viewLinks':
//             return (
//               <ViewLinks
//                 {...defData}
//                 editing={curEditing}
//                 value={value}
//                 navigate={curId =>
//                   navigation.navigate('Group', {type: 'view', id: curId})
//                 }
//               />
//             );
//             break;
//           case 'phone':
//             return (
//               <PhoneView
//                 {...defData}
//                 editing={curEditing}
//                 value={value}
//                 callAction={val => addedAction(val)}
//               />
//             );
//             break;
//           case 'check_labels':
//             return (
//               <CheckLabels {...defData} value={value} editing={curEditing} />
//             );
//             break;
//           // ЗАГЛУШКА
//           default:
//             return (
//               <Text key={defData.key} style={{color: '#04021D', fontSize: 16}}>
//                 ЗАГЛУШКА
//               </Text>
//             );
//             break;
//         }
//       },
//     });
//   });

//   return [...massObjects, ...massLastObjects];
// }

function getComponent({
  data,
  indexParent,
  currentVals,
  callback,
  addPlus,
  navigation,
  nasting = false,
}) {
  // общее хранилище элементов
  let massObjects = [];
  // хранилище последних элементов страницы
  let massLastObjects = [];
  // флаг проверки, что начались объекты по умолчанию
  let isNumber = true;
  // хранилище списка значений
  let values;
  // экзэмпляр функции
  let onChange;
  // обход переданных полей
  Object.keys(data).forEach((key, indexEl) => {
    // когда ключ будет не число - флаг сниматеся
    if (isNaN(Number(key))) {
      isNumber = false;
      values = currentVals[key];
      onChange = val => callback(key, val);
    } else {
      isNumber = true;
      values = currentVals.symptoms[key];
      onChange = val => callback(key, val, true);
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
      onChange: onChange,
      // значения заполнения
      data: JSON.parse(JSON.stringify(curObj.values || [])),
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

    // получение постфикса для реализации доп функционала блока dateTime
    let postfix;
    if (curObj.type.startsWith('dateTime')) {
      postfix = curObj.type.split('-')[1];
      curObj.type = 'dateTime';
    }

    // добавляем в массив объект ключа(по которому смотрятся значения) и функцию рендера
    let element;
    switch (curObj.type) {
      case 'inputView':
        element = <InputView {...defData} />;
        break;
      case 'droplist':
        element = <Dropdown {...defData} />;
        break;
      case 'dateTime':
        // ПЕРЕДЕЛАТЬ
        element = (
          <BirhdayView
            {...defData}
            // тип пикера
            type={postfix}
            // заголовок при редактировании
            labelEdit={curObj.labelEdit}
          />
        );
        break;
      case 'textarea':
        element = <Textarea {...defData} />;
        break;
      case 'viewLinks':
        element = (
          <ViewLinks
            {...defData}
            navigate={curId =>
              navigation.navigate('Group', {type: 'view', id: curId})
            }
          />
        );
        break;
      case 'phone':
        element = <PhoneView {...defData} />;
        break;
      case 'check_labels':
        element = <CheckLabels {...defData} />;
        break;
      case 'dynamicBlock':
        element = (
          <DynamicBlock
            key={index}
            element={curObj.element}
            onChange={vals => {
              callback(key, vals, isNumber);
            }}
            funcAdd={increment =>
              addPlus(vals =>
                callback(key, {
                  ...vals[key],
                  [increment++]: Object.assign(
                    {},
                    ...Object.keys(curObj.defStruct).map(item => {
                      return {[item]: undefined};
                    }),
                  ),
                }),
              )
            }
          />
        );
        break;
      default:
        // ЗАГЛУШКА
        element = (
          <Text key={defData.key} style={{color: '#04021D', fontSize: 16}}>
            ЗАГЛУШКА
          </Text>
        );
        break;
    }
    currMass.push({
      key: key,
      element: element,
    });
  });

  return [...massObjects, ...massLastObjects];
}

export default class SubTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defContent: [], // хранилище элементов рендеринга
      addPlus: undefined, // функция добавления нового элемента
    };

    // получаем элементы рендера в виде элементов
    if (this.props.data != undefined) {
      this.state.defContent = getComponent({
        // структура страницы
        data: this.props.data,
        // индекс родителя (для корректного определения key)
        indexParent: this.props.indexParent,
        // текущие значения блоков
        currentVals: this.props.currentData,
        // колбэк на смену значений
        callback: (key, val, isNumber) => {
          isNumber
            ? (this.props.currentData.symptoms[key] = val)
            : (this.props.currentData[key] = val);
        },
        // добавление функции в состояние для добавления новых блоков в страницу
        addPlus: func => {
          this.state.addPlus = func;
        },
        // родительская навигация
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
    return (
      <View
        style={{
          ...Styles.container,
          backgroundColor: '#fff',
        }}>
        <ScrollView contentContainerStyle={{gap: 25}}>
          {this.props.lable === null ? null : <Text>{this.props.lable}</Text>}
          {this.state.defContent.map(item => {
            return React.cloneElement(item.element, {
              editing: this.props.editing,
              value: isNaN(Number(item.key))
                ? this.props.currentData[item.key]
                : this.props.currentData.symptoms[item.key],
            });
          })}
          {/* пустое пространство */}
          <View style={Styles.crutch}></View>
        </ScrollView>
        {/* кнопка добавления для динамических страниц */}
        {this.state.addPlus != undefined && this.props.editing ? (
          <AddingButton
            onPress={() => {
              this.state.addPlus(this.props.currentData);
              this.forceUpdate();
            }}
          />
        ) : null}
      </View>
    );
  }
}
