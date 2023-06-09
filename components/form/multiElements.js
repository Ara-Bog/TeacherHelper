import React, {Component, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';

import RadioBlock from './radioBlock';
import Checkbox from './checkbox';

export default class MultiElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioBlocks: [],
      checkboxBlocks: [],
      checkboxOnlyBlocks: null,
      selectedVals: {radio: [], checkbox: [], checkboxOnly: []},
    };

    props.data.forEach(item => {
      let curList;
      switch (item.type) {
        case 'checkbox':
          this.state.checkboxBlocks.push(item);
          curList = this.state.selectedVals.checkbox;
          break;
        case 'radio':
          this.state.radioBlocks.push(item);
          curList = this.state.selectedVals.radio;
          break;
        case 'checker_only':
          this.state.checkboxOnlyBlocks = item;
          curList = this.state.selectedVals.checkboxOnly;
          break;
      }
      if (props.values.includes(item.id)) {
        curList.push(item.id);
      }
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let isEqual = nextProps.values.every(val =>
  //     this.props.values.includes(val),
  //   );
  //   if (nextProps.values.length != this.props.values.length || !isEqual) {
  //     this.state.selectedVals = {radio: [], checkbox: [], checkboxOnly: []};
  //     this.props.data.forEach(item => {
  //       let curList;
  //       switch (item.type) {
  //         case 'checkbox':
  //           curList = this.state.selectedVals.checkbox;
  //           break;
  //         case 'radio':
  //           curList = this.state.selectedVals.radio;
  //           break;
  //         case 'checker_only':
  //           curList = this.state.selectedVals.checkboxOnly;
  //           break;
  //       }
  //       if (props.values.includes(item.id)) {
  //         curList.push(item.id);
  //       }
  //     });
  //   }
  //   return true;
  // }

  changeVals() {
    let newVals = [].concat(...Object.values(this.state.selectedVals));
    this.props.onChange(newVals);
    this.forceUpdate();
  }

  setRadio(key) {
    this.state.selectedVals.radio = [key];
    this.changeVals();
  }

  setCheckbox(key) {
    let newList = this.state.selectedVals.checkbox;
    let indexVal = newList.indexOf(key);

    if (indexVal >= 0) {
      newList.splice(indexVal, 1);
    } else {
      newList.push(key);
    }

    this.state.selectedVals.checkbox = newList;
    this.changeVals();
  }

  setCheckOnly(key) {
    let newList;

    if (this.state.selectedVals.checkboxOnly.includes(key)) {
      newList = [];
    } else {
      newList = [key];
    }

    this.state.selectedVals = {checkboxOnly: newList, radio: [], checkbox: []};
    this.changeVals();
  }

  render() {
    let itemOnly = this.state.checkboxOnlyBlocks;
    return (
      <>
        {this.state.radioBlocks.length ? (
          <RadioBlock
            data={this.state.radioBlocks}
            editing={this.props.editing}
            values={this.state.selectedVals.radio}
            disabled={this.state.selectedVals.checkboxOnly.length > 0}
            onCallBack={(key, _) => this.setRadio(key)}
          />
        ) : null}
        {this.state.checkboxBlocks.map(item => {
          return (
            <Checkbox
              key={item.id}
              id={item.id}
              label={item.label}
              isSelected={key => this.state.selectedVals.checkbox.includes(key)}
              disabled={this.state.selectedVals.checkboxOnly.length > 0}
              onCallBack={key => this.setCheckbox(key)}
              editing={this.props.editing}
            />
          );
        })}
        {itemOnly ? (
          <Checkbox
            key={itemOnly.id}
            id={itemOnly.id}
            label={itemOnly.label}
            isSelected={key =>
              this.state.selectedVals.checkboxOnly.includes(key)
            }
            only={true}
            onCallBack={key => this.setCheckOnly(key)}
            editing={this.props.editing}
          />
        ) : null}
      </>
    );
  }
}
