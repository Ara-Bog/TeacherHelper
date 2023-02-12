import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

function RadioItem({label, checked, onSelect}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect()}
      style={{flexDirection: 'row', gap: 12}}>
      <View
        style={[
          Styles.radioCircle,
          checked ? Styles.radioCircle__active : null,
        ]}
      />
      <Text style={Styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default class RadioBlock extends Component {
  constructor(props) {
    super(props);
    let [tempVall] = this.props.currentVall;

    this.state = {
      currentVall: tempVall,
    };
  }

  setRadioChecked(key, val) {
    this.setState({currentVall: key});
    this.props.onCallBack(key, val);
  }

  render() {
    return (
      <View style={{gap: 15}}>
        {this.props.data.map(item => (
          <RadioItem
            key={item.id}
            label={item.label}
            checked={this.state.currentVall == item.id}
            onSelect={() => this.setRadioChecked(item.id, item.label)}
          />
        ))}
      </View>
    );
  }
}
