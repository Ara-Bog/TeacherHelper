import {Text, View, TouchableOpacity} from 'react-native';

// кастомный элемент выпадающего списка
export const itemRender = (item, selected) => {
  return (
    <View
      style={[
        Styles.dropDownBoxRow,
        selected ? {backgroundColor: 'rgba(85, 74, 240, 0.1)'} : null,
      ]}>
      <Text
        style={[
          Styles.dropDownBoxRowText,
          selected ? {color: '#554AF0'} : null,
        ]}>
        {item.name}
      </Text>
    </View>
  );
};

// Статичные свойства выпадающего списка
export const defaultPropsDroplist = {
  style: Styles.dropDown,
  selectedTextStyle: Styles.dropDownText,
  itemContainerStyle: {borderRadius: 10},
  placeholderStyle: {...Styles.dropDownText, color: '#848484'},
  maxHeight: 250,
  containerStyle: Styles.dropDownBox,
  activeColor: 'transparent',
  backgroundColor: 'rgba(4, 2, 29, 0.3)',
  fontFamily: 'sf_regular',
  labelField: 'name',
  valueField: 'id',
  // автоскролл до выбранного значения
  autoScroll: false,
};

export const RenderHeaderList = ({onSelectAll, curLength, itemsLength}) => {
  return (
    <View style={Styles.flatListHeader}>
      {curLength === 0 ? (
        <View></View>
      ) : (
        <TouchableOpacity onPress={() => onSelectAll(false)}>
          <Text style={{...Styles.dropDownBoxRowText, color: 'red'}}>
            Сбросить
          </Text>
        </TouchableOpacity>
      )}
      {curLength === itemsLength ? (
        <View></View>
      ) : (
        <TouchableOpacity onPress={() => onSelectAll(true)}>
          <Text style={{...Styles.dropDownBoxRowText, color: '#554AF0'}}>
            Выбрать все
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const itemRenderIsolated = (item, unSelect) => (
  <TouchableOpacity
    onPress={() => unSelect && unSelect(item)}
    style={{marginRight: 5, marginTop: 10}}>
    <View style={Styles.droplistIsolatedItem}>
      <Text style={Styles.droplistIsolatedItemText}>{item.name}</Text>
      <Icons.MaterialIcons name="close" size={15} color="#554AF0" />
    </View>
  </TouchableOpacity>
);
