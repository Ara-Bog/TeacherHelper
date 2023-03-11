import React from 'react';
import {Text, View} from 'react-native';

export function DivDefaultRow({value, label}) {
  // получает:
  // - значение поля -- value: String
  // - заголовок -- label: String

  return (
    <View style={Styles.divDefault}>
      <Text style={Styles.divDefaultLabel}>{label}</Text>
      {value ? (
        <Text style={Styles.divDefaultValue}>{value}</Text>
      ) : (
        <Text style={Styles.emptyValue}>Не указано</Text>
      )}
    </View>
  );
}
export function DivDefaultCol({value, label}) {
  // получает:
  // - значение поля -- value: String
  // - заголовок -- label: String

  return (
    <View style={Styles.divMain}>
      <Text style={Styles.divMainTitle}>{label}</Text>
      {value ? (
        <Text style={Styles.divMainValue}>{value}</Text>
      ) : (
        <Text style={Styles.emptyValue}>Не указано</Text>
      )}
    </View>
  );
}
