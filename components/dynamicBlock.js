import React, {Component, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View, TextInput} from 'react-native';
import EmptyField from './elements/emptyDataList';
// элементы
import ContactCard from './elements/contactCard';

export default class DynamicBlock extends Component {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значения блоков -- value: Object<Object>
  // - тип элемента для вывода -- element: string
  // --
  // обратный вызов:
  // - изменение значений в блоках -- onChange(vals: Object<Object>)
  // - вызов функции, для генерации новых блоков -- funcAdd(increment: int)

  constructor(props) {
    super(props);
    this.state = {
      // счетчик количества блоков (не уменьшается)
      increment:
        Math.max(
          ...Object.keys(this.props.value).map(item => {
            return parseInt(item);
          }),
          0,
        ) + 1,
    };
    switch (this.props.element) {
      case 'contactCard':
        this.state.element = <ContactCard />;
        break;
      default:
        this.state.element = <Text>undefined</Text>;
        break;
    }
    // говорим, что хотим сюда добавлять новые блоки
    this.props.funcAdd(this.state.increment);
  }

  // удаление блока
  removeBlock(indexBlock) {
    delete this.props.value[indexBlock];
    this.forceUpdate();
  }

  content() {
    // обход блоков с элементами
    return Object.keys(this.props.value).map(indexBlock => {
      let item = this.props.value[indexBlock];
      return React.cloneElement(this.state.element, {
        key: indexBlock,
        values: item,
        onChanges: (field, val) => {
          item[field] ??= undefined;
          item[field] = val;
          this.props.onChange(this.props.value);
        },
        editing: this.props.editing,
        removeBlock: () => this.removeBlock(indexBlock),
      });
    });
  }

  emptyContent() {
    return <EmptyField typeField={'Dynamic'} showMode={!this.props.editing} />;
  }

  render() {
    return Object.keys(this.props.value).length
      ? this.content()
      : this.emptyContent();
  }
}
