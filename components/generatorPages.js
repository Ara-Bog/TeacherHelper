import React, {Component, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SymptomsForm from './form/radioBlock';
import TableSounds from '../components/elements/tableSounds';
import InputView from '../components/form/inputView';
import RadioBlock from './form/radioBlock';
import Dropdown from './form/dropdown';

// типы полей:
// -- view
// -- textarea
// +-- inputView
// -- phone
// -- dateTime
// -- dynamicBlock
// +-- droplist
// -- label
// -- checker_only
// -- radio
// -- table
// -- checkbox
// -- custom
// -- check_labels

// ошибка уникальных ключей
// мб поменять у дочерних элементов id на id.parent + id.self

function getComponent(data, currentVals, index, callback, selectDropList) {
  let defData = {
    key: index,
    value: currentVals,
    requared: data.requared || false,
    label: data.label,
    onChange: val => callback(val),
  };
  return (curEditing, indDropList) => {
    switch (data.type) {
      case 'inputView':
        return <InputView {...defData} editing={curEditing} />;
        break;
      case 'droplist':
        return (
          <Dropdown
            {...defData}
            data={data.values}
            editing={curEditing}
            zIndex={100000 - index}
            open={indDropList == index}
            setOpen={val => selectDropList(val ? index : null)}
            // currentOpen={test}
            // testIndex={index}
            // open={val => {
            //   test = val ? index : null;
            // }}
          />
        );
        break;
      default:
        return <></>;
    }
  };
}

export default class SubTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSrtuct: this.props.defaultData,
      dataStruct: this.props.data,
      defaultData: this.props.currentData,
      defContent: [],
      mainContent: [],
      editing: this.props.editing,
      currentDropList: null,
    };

    let data = this.state.defaultSrtuct;
    if (data != undefined) {
      Object.keys(data).forEach((key, index) => {
        this.state.defContent.push(
          getComponent(
            data[key],
            this.state.defaultData[key],
            index,
            val => {
              this.state.defaultData[key] = val;
            },
            dropDownInd => {
              this.state.currentDropList = dropDownInd;
              this.forceUpdate();
            },
          ),
        );
      });
    }
  }

  componentDidMount() {
    if (this.state.defContent.length == 0) {
      return false;
    }
  }

  render() {
    if (this.state.editing != this.props.editing) {
      this.state.editing = this.props.editing;
    }
    if (!this.props.isFocused) {
      this.state.currentDropList = false;
    }
    return (
      <View
        style={{
          ...Styles.container,
          backgroundColor: '#fff',
        }}>
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{gap: 25}}>
          {this.props.lable === null ? null : <Text>{this.props.lable}</Text>}
          {this.state.defContent.map(item => {
            return item(this.state.editing, this.state.currentDropList);
          })}
          {/* пустое пространство */}
          <View style={Styles.crutch}></View>
        </ScrollView>
      </View>
    );
  }
}
