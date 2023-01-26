import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';

export default class AddingButton extends Component {
  // Элемент, плавающая кнопка в нижней части экрана для добавления новых объектов

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={Styles.float_btAdd_wrap}>
        <TouchableOpacity
          style={Styles.float_btAdd}
          onPress={() => this.props.execute()}>
          <Icons.MaterialIcons name="add" size={30} color="#554AF0" />
        </TouchableOpacity>
      </View>
    );
  }
}
