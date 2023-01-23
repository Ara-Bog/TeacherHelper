import React, {Component} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import Styles from '../styleGlobal.js';

export default class AddingButton extends Component {
  constructor(props) {
    super(props);
  }

  closeConfirm() {
    Alert.alert(
      'Подтвердите действие',
      `Вы действительно хотите вернуться к просмотру не сохранив изменения ?`,
      [
        {
          text: 'Да',
          onPress: () => (this.changeStateParent(), this.props.confirm(false)),
          style: 'destructive',
        },
        {text: 'Отмена', style: 'cancel'},
      ],
      {cancelable: true},
    );
  }

  submitConfirm() {
    Alert.alert(
      'Подтвердите действие',
      `Сохранить внесенные изменения ?`,
      [
        {
          text: 'Да',
          onPress: () => (this.props.confirm(true), this.changeStateParent()),
          style: 'destructive',
        },
        {text: 'Отмена', style: 'cancel'},
      ],
      {cancelable: true},
    );
  }

  changeStateParent() {
    this.props.changeState();
  }

  render() {
    return (
      <View style={Styles.float_btnRow}>
        {this.props.editing ? (
          <>
            <TouchableOpacity
              style={Styles.float_btEdit_Close}
              onPress={() => this.closeConfirm()}>
              <Icons.MaterialIcons name="close" size={22} color="#DC5F5A" />
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.float_btEdit_Check}
              onPress={() => this.submitConfirm()}>
              <Icons.MaterialIcons name="check" size={22} color="#15AA2C" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={Styles.float_btEdit}
            onPress={() => this.props.changeState()}>
            <Icons.Feather name="edit" size={26} color="#554AF0" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
