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

// типы полей:
// =-- viewLinks
// +-- textarea
// +-- inputView
// -- phone
// +-- dateTime
// -- dynamicBlock
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
  nasting = false,
  addPlus,
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
    const curObj = JSON.parse(JSON.stringify(data[key]));
    // приведение индекса к дереву
    const index = [indexParent, indexEl].join('.');
    // пропсы по умолчанию
    let defData = {
      key: index,
      // текущее значение поля
      value: currentVals[key],
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

    // КОСТЫЛЬ
    // когда элемент является dynamicBlock необходимо вернуть callback,
    // что нужно добавить кнопку add в панель управления
    if (curObj.type === 'dynamicBlock') {
      addPlus();
    }

    let asd;
    if (curObj.childrens != undefined) {
      asd = getComponent({
        data: curObj.childrens,
        indexParent: index,
        currentVals: currentVals,
        callback: callback,
        nasting: true,
      });
    }

    console.log('test lab', curObj.label);
    console.log('test asd', asd);

    // добавляем в массив функции параметром
    // режим редактирования -- curEditing: Bool
    currMass.push(curEditing => {
      switch (curObj.type) {
        case 'inputView':
          return <InputView {...defData} editing={curEditing} />;
          break;
        case 'droplist':
          return (
            <Dropdown
              {...defData}
              editing={curEditing}
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
              // тип пикера
              type={postfix}
              // заголовок при редактировании
              labelEdit={curObj.labelEdit}
            />
          );
          break;
        case 'textarea':
          // {
          //   data,
          //   indexParent,
          //   currentVals,
          //   callback,
          //   nasting = false,
          //   addPlus,
          // }
          return <Textarea {...defData} editing={curEditing} />;
          break;
        case 'dynamicBlock':
          return (
            <DynamicBlock {...defData} editing={curEditing} childrens={asd} />
          );
          break;
        // ЖДЕМ ДИЗАЙН
        // case 'viewLinks':
        //   return (
        //     <ViewLinks {...defData} editing={curEditing} />
        //   );
        //   break;
        // ЗАГЛУШКА
        default:
          return (
            <Text key={defData.key} style={{color: '#04021D'}}>
              {defData.label}
            </Text>
          );
          break;
      }
    });
  });
  return [...massObjects, ...massLastObjects];
}

export default class SubTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSrtuct: JSON.parse(JSON.stringify(this.props.data)),
      defaultData: JSON.parse(JSON.stringify(this.props.currentData)),
      currentData: JSON.parse(JSON.stringify(this.props.currentData)),
      defContent: [],
      mainContent: [],
      editing: this.props.editing,
      indexParent: this.props.indexParent,
    };

    if (this.state.defaultSrtuct != undefined) {
      this.state.defContent = getComponent({
        data: this.state.defaultSrtuct,
        indexParent: this.state.indexParent,
        currentVals: this.state.defaultData,
        callback: (key, val) => {
          this.state.defaultData[key] = val;
        },
        addPlus: () => this.props.useDynamic(),
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
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{gap: 25}}>
          {this.props.lable === null ? null : <Text>{this.props.lable}</Text>}
          {this.state.defContent.map(item => {
            return item(this.state.editing);
          })}
          {/* пустое пространство */}
          <View style={Styles.crutch}></View>
        </ScrollView>
      </View>
    );
  }
}
