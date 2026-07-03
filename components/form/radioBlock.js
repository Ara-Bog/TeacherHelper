import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FieldText from './formFieldText';

function RadioItem({label, checked, onSelect, disabled}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect()}
      disabled={disabled}
      style={{flexDirection: 'row', gap: 12}}>
      <View
        style={[
          Styles.radioCircle_outer,
          checked ? Styles.radioCircle_outer__active : null,
        ]}>
        <View
          style={[
            Styles.radioCircle_inner,
            checked ? Styles.radioCircle_inner__active : null,
          ]}
        />
      </View>
      <Text style={Styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function RadioBlock({
  values,
  onCallBack,
  editing,
  required,
  disabled,
  data,
}) {
  const [currentVall, setCurrentVall] = useState(values ? values[0] : undefined);

  // Sync from parent when values change externally
  useEffect(() => {
    let newVal = values ? values[0] : undefined;
    if (newVal != currentVall) {
      setCurrentVall(newVal);
    }
  }, [values]);

  const setRadioChecked = (key, val) => {
    setCurrentVall(key);
    onCallBack(key, val);
  };

  return (
    <View style={{gap: 15, opacity: disabled ? 0.3 : 1}}>
      {editing && !required ? (
        <RadioItem
          key={0}
          label={'не выбрано'}
          checked={currentVall == undefined && !disabled}
          onSelect={() => setRadioChecked(undefined, undefined)}
          disabled={disabled}
        />
      ) : null}
      {data.map(item => {
        if (editing) {
          return (
            <RadioItem
              key={item.id}
              label={item.label}
              checked={currentVall == item.id}
              onSelect={() => setRadioChecked(item.id, item.label)}
              disabled={disabled}
            />
          );
        } else if (currentVall == item.id) {
          return <FieldText key={item.id} label={item.label} />;
        }
        return null;
      })}
    </View>
  );
}
