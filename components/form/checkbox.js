import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import FieldText from '../elements/formFieldText';

export default function Checkbox({id, label, isSelected, callBack, editing}) {
  // Компонент чекбокс
  // props:
  // - возвращает текущее состояние чекбокса -- isSelected: func
  // - текущий id элемента (1.1) -- id: string
  // - текст чекбокса -- label: string
  // --
  // обратная связь:
  // - событие на установку флага -- callBack(id)

  const [select, setSelect] = useState(isSelected(id));

  useEffect(() => {
    if (isSelected(id) != select) {
      setSelect(!select);
    }
  }, [isSelected(id)]);

  const editingView = (
    <TouchableOpacity
      onPress={() => {
        callBack(id);
        setSelect(!select);
      }}
      style={Styles.checkbox}>
      <View
        style={[
          Styles.checkboxIcon,
          select ? Styles.checkboxIcon__active : null,
        ]}>
        {select ? <Icons.Octicons name="check" size={13} color="#fff" /> : null}
      </View>
      <Text style={Styles.checkboxText}>{label}</Text>
    </TouchableOpacity>
  );

  return editing ? editingView : select ? <FieldText label={label} /> : null;
}
