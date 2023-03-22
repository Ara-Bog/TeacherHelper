import {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import TextChecker from '../elements/textChecker';
import {DivDefaultRow} from '../elements/divDefault';

export default function CheckLabels({
  value,
  editing,
  label,
  onChange,
  requared,
  addedValue,
  data,
}) {
  // получает:
  // - режим редактирования или просмотра -- editing: Bool
  // - значение поля ввода -- value: String
  // - звездочка в поле -- requared: Bool
  // - заголовок -- label: String
  // --
  // обратный вызов:
  // - изменение значения поля -- onChange(val: string)
  // console.log('test val', value);

  const [currentValues, setVal] = useState(value || []);

  useEffect(() => {
    if (value != currentValues) {
      setVal(value || []);
    }
  }, [editing]);

  const setValues = id => {
    let newValues = currentValues.filter(item => item != id);
    if (newValues.length === currentValues.length) {
      newValues.push(id);
    }
    onChange(newValues);
    setVal(newValues);
  };

  const editingView = (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>
        {label}
        {requared ? ' *' : null}
      </Text>
      <View style={Styles.viewLinksWrap}>
        {data.map((item, index) => {
          return (
            <TextChecker
              key={index}
              active={currentValues.includes(item.id)}
              label={item.label}
              onPress={() => setValues(item.id)}
            />
          );
        })}
      </View>
    </View>
  );

  const showView = currentValues.length ? (
    <View style={Styles.divDefault__edit}>
      <Text style={Styles.divDefaultLabel__edit}>{label}</Text>
      <View style={Styles.viewLinksWrap}>
        {data.map((item, index) => {
          if (currentValues.includes(item.id)) {
            return (
              <TextChecker
                key={index}
                active={false}
                label={item.label}
                onPress={() => {}}
              />
            );
          }
        })}
      </View>
    </View>
  ) : (
    <DivDefaultRow value="" label={label} />
  );

  return editing ? editingView : showView;
}
