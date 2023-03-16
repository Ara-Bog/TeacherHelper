import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View, TextInput} from 'react-native';
import EmptyField from '../emptyDataList';

export default class DynamicBlock extends Component {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение полей ввода -- value: Object<Object>
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // - сгенерированные блоки с полями ввода -- childrens: Object
  // --
  // обратный вызов:
  // - генерация новых блоков -- getElements(lastindex: int, values: Object)
  // - объявляем в главной View, что на этой странице будут добавлятся блоки с этого индекса -- funcAdd(increment: int)

  constructor(props) {
    super(props);
    this.state = {
      // хранилище текущих значений
      currentValue: this.props.value,
      // хранилище блоков
      childrens: this.props.childrens,
      // добавочные значения, при изменении которых меняется имя в блоке name
      addedValue: Object.assign(
        {},
        ...Object.keys(this.props.childrens).map(item => {
          return {[item]: {}};
        }),
      ),
      // счетчик количества блоков (не уменьшается)
      increment:
        Math.max(
          ...Object.keys(this.props.childrens).map(item => {
            return parseInt(item);
          }),
          0,
        ) + 1,
    };

    // говорим, что хотим сюда добавлять
    this.props.funcAdd(this.state.increment);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // для удобства
    currentProps = this.props;
    currentState = this.state;

    // когда идет смена режима редактирования
    if (currentProps.editing != nextProps.editing) {
      // проверяем текущие значения и с родителя
      if (
        JSON.stringify(nextProps.value) !=
        JSON.stringify(nextState.currentValue)
      ) {
        // обновляем текущие
        currentState.currentValue = nextProps.value;
        // уда
        currentState.childrens = Object.assign(
          {},
          ...Object.keys(nextProps.value).map(key => {
            if (currentState.childrens[key] === undefined) {
              currentState.childrens[key] = this.props.getElements(
                key,
                nextProps.value,
              );
            }
            return {[key]: currentState.childrens[key]};
          }),
        );
      }
      currentState.addedValue = Object.assign(
        {},
        ...Object.keys(currentState.childrens).map(item => {
          return {[item]: {}};
        }),
      );
      return true;
    }
    if (
      Object.keys(nextProps.value).length >
      Object.keys(currentProps.value).length
    ) {
      increment = currentState.increment;
      currentState.currentValue = nextProps.value;
      currentState.addedValue = {...currentState.addedValue, [increment]: {}};
      currentState.childrens[increment] = this.props.getElements(
        increment,
        nextProps.value,
      );
      currentState.increment++;
    }
    return true;
  }

  removeBlock(indexBlock) {
    delete this.state.currentValue[indexBlock];
    delete this.props.value[indexBlock];
    delete this.state.addedValue[indexBlock];
    delete this.state.childrens[indexBlock];
    this.forceUpdate();
  }

  // функция связывания значений
  // функция используется phoneView, передает новое имя
  linkViews(indexBlock, val) {
    // устанавливаем на ссылку name новое значение
    // this.setState({currentValue: {...this.state.currentValue, [indexBlock]:}})
    // value[indexBlock].name = val;
    // // обновляем value вручную (для обхода ререндера)
    // setVal(value);
    // устанавливаем новое значение добавочных значений
    // чтобы в inputView произошла замена значения
    this.state.addedValue[indexBlock] = {name: val};
    this.props.value[indexBlock].name = val;
    this.forceUpdate();
  }

  content() {
    // обход блоков с элементами
    return Object.keys(this.state.childrens).map((indexBlock, indexEl) => {
      let block = this.state.childrens[indexBlock];
      return (
        // [indexEl != 0 ? Styles.contactItem_edit : null, {gap: 10}]
        // для первого элемента не добавляем верхнюю линию, gap всегда
        <View
          style={
            this.props.editing
              ? [indexEl != 0 ? Styles.contactItem_edit : null, {gap: 10}]
              : Styles.contactItem
          }
          key={indexBlock}>
          {/* обход элементов блока */}
          {block.map(item => {
            return item.render(
              this.props.editing,
              this.props.value[indexBlock][item.key],
              val => this.linkViews(indexBlock, val),
              this.state.addedValue[indexBlock][item.key],
            );
          })}
          {this.props.editing ? (
            <TouchableOpacity
              style={Styles.buttonRed}
              onPress={() => this.removeBlock(indexBlock)}>
              <Text style={Styles.buttonRedText}>Удалить</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    });
  }

  emptyContent() {
    return <EmptyField typeField={'Dynamic'} showMode={!this.props.editing} />;
  }

  render() {
    return Object.keys(this.state.childrens).length
      ? this.content()
      : this.emptyContent();
  }
}
