import React, {useRef, useReducer, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
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

function buildDescriptors({
  data,
  indexParent,
  currentVals,
  addPlus,
  navigation,
  showBlocks,
  nasting = false,
}) {
  let massObjects = [];
  let massLastObjects = [];
  let isNumber = true;

  Object.keys(data).forEach((key, indexEl) => {
    let values;
    let onChange;

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

    const curObj = data[key];
    const index = [indexParent, indexEl].join('.');

    let baseProps = {
      key: index,
      requared: curObj.requared || false,
      label: curObj.label,
      onChange: onChange,
      data: JSON.parse(JSON.stringify(curObj.values || [])),
      childrenElements: [],
      simpleShow: nasting,
    };

    let currMass;
    if (curObj.last || isNumber) {
      currMass = massLastObjects;
    } else {
      currMass = massObjects;
    }

    // Обработка вложенных элементов
    if (curObj.type == 'table') {
      baseProps.childrenElements = curObj.childrens;
    } else if (curObj.childrens != undefined) {
      baseProps.childrenElements = buildDescriptors({
        data: curObj.childrens,
        indexParent: index,
        currentVals: currentVals,
        navigation: navigation,
        showBlocks: showBlocks[key].childrens,
        nasting: true,
      });
    }

    // Дескриптор: {key, Component, props, children}
    let descriptor;
    switch (curObj.type) {
      case 'inputView':
        descriptor = {Component: InputView, props: baseProps};
        break;
      case 'droplist':
        descriptor = {Component: Dropdown, props: baseProps};
        break;
      case 'dateTime-date':
        descriptor = {
          Component: BirhdayView,
          props: {...baseProps, labelEdit: curObj.labelEdit},

        };
        break;
      case 'dateTime-time':
        descriptor = {
          Component: TimePicker,
          props: {...baseProps, labelEdit: curObj.labelEdit},

        };
        break;
      case 'textarea':
        descriptor = {Component: Textarea, props: baseProps};
        break;
      case 'viewLinks':
        descriptor = {
          Component: ViewLinks,
          props: {
            ...baseProps,
            navigate: curId =>
              navigation.navigate('Group', {
                type: 'view',
                id: curId,
                template: curObj.template,
              }),
          },

        };
        break;
      case 'phone':
        descriptor = {Component: PhoneView, props: baseProps};
        break;
      case 'check_labels':
        descriptor = {Component: CheckLabels, props: baseProps};
        break;
      case 'checkbox':
        descriptor = {
          Component: DropdownLabel,
          props: {
            ...baseProps,
            show: showBlocks[key].show,
            setCheck: () => (showBlocks[key].show = !showBlocks[key].show),
            childComponent: Checkbox,
            childProps: {
              onCallBack: val => {
                let indexVal = values.indexOf(val);
                if (indexVal >= 0) {
                  values.splice(indexVal, 1);
                } else {
                  values.push(val);
                }
              },
              isSelected: val => values.includes(val),
            },
          },

        };
        break;
      case 'label':
        descriptor = {
          Component: DropdownLabel,
          props: {
            ...baseProps,
            show: showBlocks[key].show,
            setCheck: () => (showBlocks[key].show = !showBlocks[key].show),
          },

        };
        break;
      case 'dynamicBlock':
        descriptor = {
          Component: DynamicBlock,
          props: {
            key: index,
            element: curObj.element,
            onChange: vals => onChange(vals),
            funcAdd: increment =>
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
              ),
          },

        };
        break;
      case 'radio':
        descriptor = {
          Component: DropdownLabel,
          props: {
            ...baseProps,
            show: showBlocks[key].show,
            childView: true,
            values: values,
            setCheck: () => (showBlocks[key].show = !showBlocks[key].show),
            childComponent: RadioBlock,
            childProps: {
              onCallBack: (val, _) => onChange(val ? [val] : []),
            },
          },

        };
        break;
      case 'table':
        descriptor = {Component: TableDefault, props: baseProps};
        break;
      case 'custom':
        descriptor = {
          Component: DropdownLabel,
          props: {
            ...baseProps,
            show: showBlocks[key].show,
            childView: true,
            values: values,
            setCheck: () => (showBlocks[key].show = !showBlocks[key].show),
            childComponent: MultiElements,
            childProps: {
              onChange: onChange,
            },
          },

        };
        break;
      case 'selectedInList':
        descriptor = {
          Component: SelectedInList,
          props: {
            key: index,
            ...curObj.props,
            onChange: onChange,
          },

        };
        break;
      default:
        descriptor = {
          Component: ({}) => (
            <Text style={{color: '#04021D', fontSize: 16}}>
              ЧТО-ТО ПОШЛО НЕ ТАК, ОБРАТИТЕСЬ К РАЗРАБОТЧИКУ
            </Text>
          ),
          props: {key: index},

        };
        break;
    }

    currMass.push({
      key: key,
      ...descriptor,
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

export default function SubTab({
  footer,
  lable,
  data,
  currentData,
  editing,
  indexParent,
  navigation,
}) {
  const [, forceRender] = useReducer(x => x + 1, 0);
  const addPlusRef = useRef(undefined);

  const showBlocksRef = useRef(
    Object.fromEntries(getStructShowBlocks(data || {})),
  );

  const descriptorsRef = useRef([]);

  // Строим дескрипторы один раз при монтировании
  if (descriptorsRef.current.length === 0 && data != undefined) {
    descriptorsRef.current = buildDescriptors({
      data: data,
      indexParent: indexParent,
      currentVals: currentData,
      addPlus: func => {
        addPlusRef.current = func;
        forceRender();
      },
      navigation: navigation,
      showBlocks: showBlocksRef.current,
    });
  }

  const checkValues = useCallback(
    itemKey => {
      return isNaN(Number(itemKey))
        ? currentData[itemKey]
        : currentData.symptoms[itemKey];
    },
    [currentData],
  );

  let showSeparate = false;
  let emptyFields = [];

  return (
    <View
      style={{
        ...Styles.container,
        backgroundColor: '#fff',
      }}>
      <ScrollView contentContainerStyle={{gap: 25}}>
        {/* заголовок при наличии */}
        {lable === null ? null : (
          <>
            <Text style={Styles.subtabPage_title}>
              {lable.toUpperCase()}
            </Text>
            <View style={Styles.seqLineHeader}></View>
          </>
        )}
        {/* основной контент — рендер дескрипторов */}
        {descriptorsRef.current.map(item => {
          let val = checkValues(item.key);
          let sub_vals = {};
          let flag_Empty = true;

          if (data[item.key].childrens) {
            sub_vals = Object.fromEntries(
              Object.keys(data[item.key].childrens).map(itemKey => {
                let subVal = checkValues(itemKey);
                if (
                  footer &&
                  !(subVal || []).length &&
                  !editing
                ) {
                  emptyFields.push(
                    data[item.key].childrens[itemKey].label,
                  );
                } else {
                  flag_Empty = false;
                }
                return [itemKey, subVal];
              }),
            );
          }

          if (
            footer &&
            !(val || []).length &&
            !editing &&
            flag_Empty
          ) {
            emptyFields.push(data[item.key].label);
            return null;
          }

          showSeparate = true;

          // Рендерим компонент из дескриптора напрямую
          const Comp = item.Component;
          return (
            <Comp
              {...item.props}
              editing={editing}
              value={val}
              currentValues={val}
              child_values={sub_vals}
            />
          );
        })}
        {/* блок отсутствующих значений */}
        {footer && !editing && emptyFields.length ? (
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
        <View style={Styles.crutch}></View>
      </ScrollView>
      {/* кнопка добавления для динамических страниц */}
      {addPlusRef.current != undefined && editing ? (
        <AddingButton
          onPress={() => {
            addPlusRef.current(currentData);
            forceRender();
          }}
        />
      ) : null}
    </View>
  );
}
