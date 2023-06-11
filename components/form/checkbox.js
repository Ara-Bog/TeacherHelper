import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import FieldText from './formFieldText';

export default function Checkbox({
  id,
  label,
  isSelected,
  onCallBack,
  editing,
  disabled,
  only,
}) {
  // Компонент чекбокс
  // props:
  // - возвращает текущее состояние чекбокса -- isSelected: func
  // - текущий id элемента (1.1) -- id: string
  // - текст чекбокса -- label: string
  // --
  // обратная связь:
  // - событие на установку флага -- onCallBack(id)

  const [select, setSelect] = useState(isSelected(id));

  useEffect(() => {
    if (isSelected(id) != select) {
      setSelect(!select);
    }
  }, [isSelected(id)]);

  const editingView = (
    <TouchableOpacity
      onPress={() => {
        onCallBack(id);
        setSelect(!select);
      }}
      disabled={disabled}
      style={[Styles.checkbox, {opacity: disabled ? 0.3 : 1}]}>
      <View
        style={[
          Styles.checkboxIcon,
          select ? Styles.checkboxIcon__active : null,
        ]}>
        {select ? <Icons.Octicons name="check" size={13} color="#fff" /> : null}
      </View>
      <View>
        <Text style={Styles.checkboxText}>{label}</Text>
        {only ? (
          <Text style={Styles.checkboxTextSub}>
            Блокирует выбор остальных значений
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return editing ? editingView : select ? <FieldText label={label} /> : null;
}
