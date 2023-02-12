import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import SymptomsForm from './form/radioBlock';
import TableSounds from '../components/elements/tableSounds';
import InputView from '../components/form/inputView';

DropDownPicker.setLanguage('RU');

export default class SubTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   options: this.props.route,
    };
  }

  render() {
    return (
      <View
        style={{
          ...Styles.container,
          backgroundColor: '#fff',
        }}>
        <Text>{this.props.hui}</Text>
      </View>
    );
  }
}
