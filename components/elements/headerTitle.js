import {View, Text} from 'react-native';

export default function HeaderTitle({mainTitle, addedTitle}) {
  // полученные данные:
  // - основной заголовок страницы -- mainTitle: string
  // - добавочный загловок (шаблон) -- addedTitle: string
  return (
    <View style={{gap: 2, alignItems: 'center'}}>
      <Text style={Styles.screenOptionsNav.headerTitleStyle}>{mainTitle}</Text>
      {addedTitle != undefined ? (
        <Text style={Styles.headerAddedTitleStyle}>{addedTitle}</Text>
      ) : null}
    </View>
  );
}
