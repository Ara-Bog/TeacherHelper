import HeaderTitle from '../components/elements/headerTitle';
import {TouchableOpacity} from 'react-native';

export default function setHeaderNavigation({
  mainTitle,
  addedTitle,
  onPressIcon,
  navigation,
  IconStyle,
}) {
  navigation.setOptions({
    headerTitle: () => (
      <HeaderTitle mainTitle={mainTitle} addedTitle={addedTitle} />
    ),
  });

  const Icon = () => {
    switch (IconStyle) {
      case 'remove':
        return <Icons.Feather name="trash" size={24} color="#DC5F5A" />;
        break;
      case 'edit':
        return <Icons.Feather name="edit" size={24} color="#554AF0" />;
        break;
    }
  };

  if (Icon != undefined) {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => onPressIcon()}>
          {Icon()}
        </TouchableOpacity>
      ),
    });
  }
}
