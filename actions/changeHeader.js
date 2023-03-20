import HeaderTitle from '../components/elements/headerTitle';
import {TouchableOpacity, BackHandler} from 'react-native';
import {HeaderBackButton} from '@react-navigation/elements';

export default function setHeaderNavigation({
  mainTitle,
  addedTitle,
  onPressLeft,
  onPressRight,
  navigation,
  mode,
}) {
  navigation.setOptions({
    headerTitle: () => (
      <HeaderTitle mainTitle={mainTitle} addedTitle={addedTitle} />
    ),
  });

  switch (mode) {
    case 'edit':
      navigation.setOptions({
        headerBackVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => onPressLeft()}>
            <Icons.MaterialIcons name="close" size={25} color="#DC5F5A" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => onPressRight()}>
            <Icons.MaterialIcons name="check" size={25} color="#15AA2C" />
          </TouchableOpacity>
        ),
      });
      break;
    case 'menu':
      navigation.setOptions({
        headerBackVisible: undefined,
        headerLeft: undefined,
        headerRight: () => (
          <TouchableOpacity onPress={() => onPressRight()}>
            <Icons.Feather name="menu" size={24} color="#554AF0" />
          </TouchableOpacity>
        ),
      });
      break;
  }
}
