import MaterialCommunityIconsI from '@react-native-vector-icons/material-design-icons';
import SimpleLineIconsI from '@react-native-vector-icons/simple-line-icons';
import MaterialIconsI from '@react-native-vector-icons/material-icons';
import FontAwesomeI from '@react-native-vector-icons/fontawesome';
import FoundationI from '@react-native-vector-icons/foundation';
import EvilIconsI from '@react-native-vector-icons/evil-icons';
import OcticonsI from '@react-native-vector-icons/octicons';
import IoniconsI from '@react-native-vector-icons/ionicons';
import FeatherI from '@react-native-vector-icons/feather';
import EntypoI from '@react-native-vector-icons/entypo';
import ZocialI from '@react-native-vector-icons/zocial';
import AntI from '@react-native-vector-icons/ant-design';
import React from 'react';

export const MaterialCommunityIcons = props => (
  <MaterialCommunityIconsI {...props} />
);
const SimpleLineIcons = props => <SimpleLineIconsI {...props} />;
const MaterialIcons = props => <MaterialIconsI {...props} />;
const FontAwesome = props => <FontAwesomeI {...props} />;
const Foundation = props => <FoundationI {...props} />;
const EvilIcons = props => <EvilIconsI {...props} />;
const Ionicons = props => <IoniconsI {...props} />;
const Octicons = props => <OcticonsI {...props} />;
const Feather = props => <FeatherI {...props} />;
const Entypo = props => <EntypoI {...props} />;
const Zocial = props => <ZocialI {...props} />;
const AntDesign = props => <AntI {...props} />;

export default {
  MaterialCommunityIcons,
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome,
  Foundation,
  EvilIcons,
  Ionicons,
  Octicons,
  Feather,
  Entypo,
  Zocial,
  AntDesign,
};
