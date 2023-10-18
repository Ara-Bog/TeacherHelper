import {Text, View, TouchableOpacity, ScrollView} from 'react-native';

export default function NavPage({values, onSelect, selected}) {
  // получает:
  // - значение поля ввода -- values: Array [Object]
  // - выбранный индекс страницы -- selected: Int
  // --
  // обратный вызов:
  // - выбор страницы -- onSelect
  const Tab = (val, key, index) => (
    <TouchableOpacity
      key={key}
      onPress={() => onSelect(index)}
      style={[
        Styles.navPageTab,
        selected == index ? {backgroundColor: '#554AF0'} : null,
      ]}>
      <Text
        style={[
          Styles.navPageTabText,
          selected == index ? {color: '#fff'} : null,
        ]}>
        {val}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={Styles.seqLineHeader}></View>
      <View style={{backgroundColor: '#fff'}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            minWidth: '100%',
          }}>
          {values.map((item, index) => {
            return Tab(item.tab_name || item.name, item.id, index);
          })}
        </ScrollView>
      </View>
    </>
  );
}
