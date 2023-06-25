import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import AddingButton from './elements/buttonAdd';

// блоки редактирования
import InputView from '../components/form/inputView';
import Dropdown from './form/dropdown';
import {BirhdayView, TimePicker} from './form/datetimePicker';
import ViewLinks from './form/viewLinks';
import Textarea from './form/textarea';
import DynamicBlock from './dynamicBlock';
import PhoneView from './form/phoneView';
import CheckLabels from './form/checkLabels';
import DropdownLabel from './elements/dropdownLabel';
import Checkbox from './form/checkbox';
import RadioBlock from './form/radioBlock';
import TableDefault from './form/tableSounds';
import MultiElements from './form/multiElements';
import SelectedInList from './form/selectedInList';

// типы полей {
// +-- viewLinks
// +-- textarea
// +-- inputView
// +-- phone
// +-- dateTime
// +-- dynamicBlock
// +-- droplist
// +-- label
// +-- radio
// +-- checkbox
// +-- custom
// +-- -- checker_only
// +-- table
// +-- check_labels
// +--- nasting
// +-- selectedInList
// }

function getComponent({
  data,
  indexParent,
  currentVals,
  addPlus,
  navigation,
  showBlocks,
  nasting = false,
}) {
  // общее хранилище элементов
  let massObjects = [];
  // хранилище последних элементов страницы
  let massLastObjects = [];
  // флаг проверки, что начались объекты по умолчанию
  let isNumber = true;
  // обход переданных полей
  Object.keys(data).forEach((key, indexEl) => {
    // ссылка на список значений
    let values;
    // экзэмпляр функции
    let onChange;
    // когда ключ будет не число - флаг сниматеся
    if (isNaN(Number(key))) {
      isNumber = false;
      values = currentVals[key];
      onChange = val => (currentVals[key] = val);
    } else {
      isNumber = true;
      currentVals.symptoms[key] ??= [];
      values = currentVals.symptoms[key];
      onChange = val => (currentVals.symptoms[key] = val);
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
      // дочерние элементы
      childrenElements: [],
      // упрощенное представление для вложенных droplabel
      simpleShow: nasting,
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

    if (curObj.type == 'table') {
      defData.childrenElements = curObj.childrens;
    } else if (curObj.childrens != undefined) {
      defData.childrenElements = getComponent({
        data: curObj.childrens,
        indexParent: index,
        currentVals: currentVals,
        addPlus: addPlus,
        navigation: navigation,
        showBlocks: showBlocks[key].childrens,
        nasting: true,
      });
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
      case 'dateTime-date':
        element = (
          <BirhdayView
            {...defData}
            // заголовок при редактировании
            labelEdit={curObj.labelEdit}
          />
        );
        break;
      case 'dateTime-time':
        element = (
          <TimePicker
            {...defData}
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
              navigation.navigate('Group', {
                type: 'view',
                id: curId,
                template: curObj.template,
              })
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
      case 'checkbox':
        element = (
          <DropdownLabel
            {...defData}
            show={showBlocks[key].show}
            setCheck={() => (showBlocks[key].show = !showBlocks[key].show)}>
            <Checkbox
              onCallBack={val => {
                let indexVal = values.indexOf(val);

                if (indexVal >= 0) {
                  values.splice(indexVal, 1);
                } else {
                  values.push(val);
                }
              }}
              isSelected={val => values.includes(val)}
            />
          </DropdownLabel>
        );
        break;
      case 'label':
        element = (
          <DropdownLabel
            {...defData}
            show={showBlocks[key].show}
            setCheck={() => {
              showBlocks[key].show = !showBlocks[key].show;
            }}
          />
        );
        break;
      case 'dynamicBlock':
        element = (
          <DynamicBlock
            key={index}
            element={curObj.element}
            onChange={vals => {
              onChange(vals);
            }}
            funcAdd={increment =>
              addPlus(vals =>
                onChange({
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
      case 'radio':
        element = (
          <DropdownLabel
            {...defData}
            show={showBlocks[key].show}
            childView={true}
            values={values}
            setCheck={() => (showBlocks[key].show = !showBlocks[key].show)}>
            <RadioBlock onCallBack={(val, _) => onChange(val ? [val] : [])} />
          </DropdownLabel>
        );
        break;
      case 'table':
        element = <TableDefault {...defData} />;
        break;
      case 'custom':
        element = (
          <DropdownLabel
            {...defData}
            show={showBlocks[key].show}
            childView={true}
            values={values}
            setCheck={() => (showBlocks[key].show = !showBlocks[key].show)}>
            <MultiElements onChange={onChange} />
          </DropdownLabel>
        );
        break;
      case 'selectedInList':
        element = (
          <SelectedInList
            {...curObj.props}
            currentValues={values}
            onChange={onChange}
          />
        );
        break;
      default:
        // ЗАГЛУШКА
        element = (
          <Text key={defData.key} style={{color: '#04021D', fontSize: 16}}>
            ЧТО-ТО ПОШЛО НЕ ТАК, ОБРАТИТЕСЬ К РАЗРАБОТЧИКУ
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

// создание структуры {show, childrens:{show, childrens...}} для отображения раскрытия списков
function getStructShowBlocks(data, sub = false) {
  return Object.keys(data).map(key => {
    let currentBlock = {
      show: sub ? userSettings.showSubCategories : userSettings.showCategories,
    };
    if (data[key].childrens != undefined) {
      currentBlock.childrens = Object.fromEntries(
        getStructShowBlocks(data[key].childrens, true),
      );
    }
    return [key, currentBlock];
  });
}

export default class SubTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defContent: [], // хранилище элементов рендеринга
      addPlus: undefined, // функция добавления нового элемента
      showBlocks: {},
    };
    this.state.showBlocks = Object.fromEntries(
      getStructShowBlocks(this.props.data),
    );
    // получаем элементы рендера в виде элементов
    if (this.props.data != undefined) {
      this.state.defContent = getComponent({
        // структура страницы
        data: this.props.data,
        // индекс родителя (для корректного определения key)
        indexParent: this.props.indexParent,
        // текущие значения блоков
        currentVals: this.props.currentData,
        // добавление функции в состояние для добавления новых блоков в страницу
        addPlus: func => {
          this.state.addPlus = func;
        },
        // родительская навигация
        navigation: this.props.navigation,
        // состояния раскрытия списков
        showBlocks: this.state.showBlocks,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.editing != nextProps.editing) {
      return true;
    }
    return false;
  }

  // возврат значения по ключу
  checkValues(itemKey) {
    val = isNaN(Number(itemKey))
      ? this.props.currentData[itemKey]
      : this.props.currentData.symptoms[itemKey];
    return val;
  }

  render() {
    // флаг отображения разделителя
    let showSeparate = false;
    // хранилище ключей полей с пустыми значениями
    let emptyFields = [];
    return (
      <View
        style={{
          ...Styles.container,
          backgroundColor: '#fff',
        }}>
        <ScrollView contentContainerStyle={{gap: 25}}>
          {/* заголовок при наличии */}
          {this.props.lable === null ? null : (
            <>
              <Text style={Styles.subtabPage_title}>
                {this.props.lable.toUpperCase()}
              </Text>
              <View style={Styles.seqLineHeader}></View>
            </>
          )}
          {/* основной контент */}
          {this.state.defContent.map(item => {
            // текущие значения блока
            let val = this.checkValues(item.key);
            // вложеные значения
            let sub_vals = {};
            // флаг отсутствия значений у ОСНОВНОГО блока
            let flag_Empty = true;

            // проверка вложенных полей
            if (this.props.data[item.key].childrens) {
              sub_vals = Object.fromEntries(
                Object.keys(this.props.data[item.key].childrens).map(
                  itemKey => {
                    // получем текущее значение вложенного блока
                    let subVal = this.checkValues(itemKey);
                    // проверка на пустоту, при включенном футере
                    if (
                      this.props.footer &&
                      !(subVal || []).length &&
                      !this.props.editing
                    ) {
                      // добавляем ключ пустого вложенного блока
                      emptyFields.push(
                        this.props.data[item.key].childrens[itemKey].label,
                      );
                    } else {
                      // поле не пустое, снимаем флаг
                      flag_Empty = false;
                    }
                    // возвращаем ключ (id блока) и значение
                    return [itemKey, subVal];
                  },
                ),
              );
            }

            // проверка на пустоту, при включенном футере
            // доп проверка флага нужна для отображения основного блока, если в нем есть вложенные заполненные поля
            if (
              this.props.footer &&
              !(val || []).length &&
              !this.props.editing &&
              flag_Empty
            ) {
              // блок не будет выведен в основном контенте
              emptyFields.push(this.props.data[item.key].label);
              return null;
            }

            // есть заполненные блок, значит нужен разделитель
            showSeparate = true;

            // возвращаем элемент с текущими данными
            return React.cloneElement(item.element, {
              editing: this.props.editing,
              value: val,
              child_values: sub_vals,
            });
          })}
          {/* блок отсутствующих значий, который отображается при наличии соответствующего флага */}
          {this.props.footer && !this.props.editing && emptyFields.length ? (
            <>
              {showSeparate ? <View style={Styles.seqLineHeader}></View> : null}
              <View style={{gap: 15}}>
                <Text style={Styles.subtabPage_footerLabel}>Не указано</Text>
                <View style={{gap: 20}}>
                  {emptyFields.map((label, index) => {
                    return (
                      <Text key={index} style={Styles.subtabPage_footerItems}>
                        {label}
                      </Text>
                    );
                  })}
                </View>
              </View>
            </>
          ) : null}
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
