import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

export default function DropdownLabel(props) {
  // Маханизм выпадающего списка
  // props:
  // - id текущего списка -- id: int || str
  // - данные для заполнения дочернего элемент -- data: array
  // - компонент дочернего элемента -- childComponent: Component
  // - пропсы дочернего элемента -- childProps: Object
  // - заголовок выпадающего списка -- label: string
  // - текущее состояния открытия списка -- show: bool
  // - отображение заголовков в редактировании/просмотре -- edititng: bool
  // ---------------
  // обратная связь (props):
  // - значение сменилось setCheck

  // отслеживания открытия/закрытия списка
  const [show, setShow] = useState(props.show);
  // обход переданных данных, для создания детей с передачей им необходимых props
  const ChildComponent = props.childComponent;
  const childProps = props.childProps || {};

  const mainContent = !ChildComponent
    ? []
    : props.childView
    ? [
        <ChildComponent
          key={[props.id, 0].join('.')}
          {...childProps}
          data={props.data}
          editing={props.editing}
          values={props.values}
        />,
      ]
    : props.data.map((item, index) => {
        let newId = [props.id, index].join('.');
        return (
          <ChildComponent
            key={newId}
            {...childProps}
            id={item.id}
            label={item.label}
            editing={props.editing}
          />
        );
      });

  // вложенный контент — рендер дескрипторов из генератора страниц
  const subContent = props.childrenElements
    ? props.childrenElements.map(item => {
        // проверка пустого значения
        if (props.editing || (props.child_values[item.key] || []).length) {
          const Comp = item.Component;
          return <Comp {...item.props} editing={props.editing} />;
        } else {
          return null;
        }
      })
    : [];

  // меняем текущее значение и отправляем колбэк, что состояние сменилось
  const changeShow = state => {
    props.setCheck();
    setShow(state);
  };

  return (
    <View>
      <TouchableOpacity
        style={
          props.editing
            ? props.simpleShow
              ? Styles.dropdownListWrap__nasted
              : Styles.dropdownListWrap
            : null
        }
        onPress={() => (props.editing ? changeShow(!show) : null)}>
        <Text
          style={[
            props.simpleShow
              ? Styles.dropdownListText__nested
              : Styles.dropdownListText,
            !props.editing ? Styles.dropdownListText__show : null,
          ]}>
          {props.label}
        </Text>
        <Icons.Entypo
          name="chevron-down"
          style={[
            {alignSelf: 'center'},
            !props.editing ? {display: 'none'} : null,
            show ? {transform: [{rotate: '180deg'}]} : null,
          ]}
          size={20}
          color={props.simpleShow ? '#B1B1B1' : '#554AF0'}
        />
      </TouchableOpacity>
      {mainContent.length ? (
        // DEV мэйби переделать с display на width/height: 0 ??
        <View
          style={[
            show ? {display: 'flex'} : {display: 'none'},
            !props.editing ? Styles.dropdownList__showMod : Styles.dropdownList,
          ]}>
          {mainContent}
        </View>
      ) : null}
      {/* {show || (!props.editing && props.childrenElements) ? (
        <View style={[{gap: 25, marginTop: props.editing ? 25 : 12}]}>
          {subContent}
        </View>
      ) : null} */}
      <View
        style={{
          gap: 25,
          marginTop: props.editing ? 25 : 12,
          display:
            show || (!props.editing && props.childrenElements)
              ? 'flex'
              : 'none',
        }}>
        {subContent}
      </View>
    </View>
  );
}
