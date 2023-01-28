import React, {useState} from 'react';
import {Text, View, TouchableOpacity, useSt} from 'react-native';

export default function defaultCard(props) {
  const [show, changeShow] = useState(false);

  const ChildrenElements = props.data.map((item, index) => {
    let newId = [props.id, index].join('.');

    return React.cloneElement(props.children, {
      key: newId,
      id: newId,
      label: item.name,
    });
  });

  return (
    <View>
      <TouchableOpacity onPress={() => changeShow(!show)}>
        <Text>{props.label}</Text>
      </TouchableOpacity>
      <View
        style={{
          rowGap: 20,
          overflow: 'hidden',
          display: show ? 'flex' : 'none',
        }}>
        {ChildrenElements}
      </View>
    </View>
  );
}
