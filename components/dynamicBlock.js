import React, {useRef, useReducer} from 'react';
import {Text} from 'react-native';
import EmptyField from './elements/emptyDataList';
import ContactCard from './elements/contactCard';

const ELEMENT_MAP = {
  contactCard: ContactCard,
};

export default function DynamicBlock({
  element,
  value,
  editing,
  onChange,
  funcAdd,
}) {
  const [, forceRender] = useReducer(x => x + 1, 0);

  const incrementRef = useRef(
    Math.max(
      ...Object.keys(value).map(item => parseInt(item)),
      0,
    ) + 1,
  );

  const ElementComponent = ELEMENT_MAP[element] || (() => <Text>undefined</Text>);

  // Register the add function on first render
  const registeredRef = useRef(false);
  if (!registeredRef.current) {
    funcAdd(incrementRef.current);
    registeredRef.current = true;
  }

  const removeBlock = indexBlock => {
    delete value[indexBlock];
    forceRender();
  };

  if (!Object.keys(value).length) {
    return <EmptyField typeField={'Dynamic'} showMode={!editing} />;
  }

  return Object.keys(value).map(indexBlock => {
    let item = value[indexBlock];
    return (
      <ElementComponent
        key={indexBlock}
        values={item}
        onChanges={(field, val) => {
          item[field] ??= undefined;
          item[field] = val;
          onChange(value);
        }}
        editing={editing}
        removeBlock={() => removeBlock(indexBlock)}
      />
    );
  });
}
