import React, {useRef, useReducer} from 'react';

import RadioBlock from './radioBlock';
import Checkbox from './checkbox';

export default function MultiElements({data, values, editing, onChange}) {
  const [, forceRender] = useReducer(x => x + 1, 0);

  // Parse data into groups on first render
  const parsedRef = useRef(null);
  if (!parsedRef.current) {
    let radioBlocks = [];
    let checkboxBlocks = [];
    let checkboxOnlyBlocks = null;
    let selectedVals = {radio: [], checkbox: [], checkboxOnly: []};

    data.forEach(item => {
      let curList;
      switch (item.type) {
        case 'checkbox':
          checkboxBlocks.push(item);
          curList = selectedVals.checkbox;
          break;
        case 'radio':
          radioBlocks.push(item);
          curList = selectedVals.radio;
          break;
        case 'checker_only':
          checkboxOnlyBlocks = item;
          curList = selectedVals.checkboxOnly;
          break;
      }
      if (values.includes(item.id)) {
        curList.push(item.id);
      }
    });

    parsedRef.current = {radioBlocks, checkboxBlocks, checkboxOnlyBlocks, selectedVals};
  }

  const {radioBlocks, checkboxBlocks, checkboxOnlyBlocks} = parsedRef.current;
  const selectedVals = parsedRef.current.selectedVals;

  const changeVals = () => {
    let newVals = [].concat(...Object.values(selectedVals));
    onChange(newVals);
    forceRender();
  };

  const setRadio = key => {
    selectedVals.radio = [key];
    changeVals();
  };

  const setCheckbox = key => {
    let newList = selectedVals.checkbox;
    let indexVal = newList.indexOf(key);

    if (indexVal >= 0) {
      newList.splice(indexVal, 1);
    } else {
      newList.push(key);
    }

    selectedVals.checkbox = newList;
    changeVals();
  };

  const setCheckOnly = key => {
    let newList;

    if (selectedVals.checkboxOnly.includes(key)) {
      newList = [];
    } else {
      newList = [key];
    }

    parsedRef.current.selectedVals = {checkboxOnly: newList, radio: [], checkbox: []};
    changeVals();
  };

  return (
    <>
      {radioBlocks.length ? (
        <RadioBlock
          data={radioBlocks}
          editing={editing}
          values={selectedVals.radio}
          disabled={selectedVals.checkboxOnly.length > 0}
          onCallBack={(key, _) => setRadio(key)}
        />
      ) : null}
      {checkboxBlocks.map(item => (
        <Checkbox
          key={item.id}
          id={item.id}
          label={item.label}
          isSelected={key => selectedVals.checkbox.includes(key)}
          disabled={selectedVals.checkboxOnly.length > 0}
          onCallBack={key => setCheckbox(key)}
          editing={editing}
        />
      ))}
      {checkboxOnlyBlocks ? (
        <Checkbox
          key={checkboxOnlyBlocks.id}
          id={checkboxOnlyBlocks.id}
          label={checkboxOnlyBlocks.label}
          isSelected={key => selectedVals.checkboxOnly.includes(key)}
          only={true}
          onCallBack={key => setCheckOnly(key)}
          editing={editing}
        />
      ) : null}
    </>
  );
}
