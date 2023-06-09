import {Component, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, View, ScrollView} from 'react-native';
import RadioBlock from './form/radioBlock';

export default class SelectorTemplates extends Component {
  // обратная связь:
  // - передача данных выбронного шаблона-- selectTemp(id: int, name: string)
  // - закрытие модалки и переход в настройки -- goSettings
  constructor(props) {
    super(props);
    this.state = {
      selectValue: null,
      selectId: null,
      dataset: [],
    };

    // определяем датасет
    if (userSettings.templates.length > 1) {
      // берем данные с сохраненных пользователем шаблонов
      this.state.dataset = userSettings.templates;
    } else {
      // берем все шаблоны
      db.transaction(tx => {
        tx.executeSql(
          `SELECT id, name as label FROM Templates`,
          [],
          (_, {rows}) => this.setState({dataset: rows.raw()}),
        );
      });
    }
  }

  render() {
    return (
      <View style={{justifyContent: 'space-between', flex: 1}}>
        <View style={{gap: 20}}>
          <Text style={Styles.cardBlockTitle}>Выберите шаблон</Text>
          <ScrollView
            style={{...Styles.cardBlock, height: 200}}
            contentContainerStyle={{gap: 15}}>
            <RadioBlock
              values={[null]}
              data={this.state.dataset}
              editing={true}
              onCallBack={(key, val) =>
                this.setState({selectId: key, selectValue: val})
              }
              required={true}
            />
          </ScrollView>
        </View>
        <View style={{gap: 15}}>
          <TouchableOpacity
            style={Styles.opacityButton}
            onPress={() => this.props.goSettings()}>
            <Text style={Styles.opacityButtonText}>Настройки</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.submitBtn}
            onPress={() =>
              this.props.selectTemp(this.state.selectId, this.state.selectValue)
            }>
            <Text style={Styles.submitBtnText}>Подтвердить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
