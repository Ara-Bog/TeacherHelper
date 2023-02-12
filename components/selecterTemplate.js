import {Component, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View} from 'react-native';
import {RadioButton} from 'react-native-paper';

export default class SelectorTemplates extends Component {
  // selectTemp, goSettings
  // обратная связь:
  // - передача данных выбронного шаблона-- selectTemp(id: int, name: string)
  // - закрытие модалки и переход в настройки -- goSettings
  constructor(props) {
    super(props);
    this.state = {
      currentValue: null,
      dataset: [],
    };

    if (userSettings.templates.length > 1) {
      this.state.dataset = userSettings.templates;
    } else {
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM Templates`, [], (_, {rows}) =>
          this.setState({dataset: rows.raw()}),
        );
      });
    }
  }

  render() {
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View style={{gap: 20}}>
          <Text style={Styles.cardBlockTitle}>Выберите шаблон</Text>
          <View style={Styles.cardBlock}>
            <RadioButton.Group
              onValueChange={value => this.setState({currentValue: value})}
              value={this.state.currentValue}>
              {this.state.dataset.map(item => (
                <RadioButton.Item
                  key={item.id}
                  label={item.name}
                  value={item.id}
                  style={{padding: 0}}
                  labelStyle={{}}
                  color={'#554AF0'}
                />
              ))}
            </RadioButton.Group>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.props.goSettings()}>
            <Text>Настройки</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.selectTemp(
                this.state.currentValue,
                this.state.dataset.find(
                  item => item.id === this.state.currentValue,
                ).name,
              )
            }>
            <Text>Подтвердить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
