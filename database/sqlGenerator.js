import {Alert} from 'react-native';
import {getDB} from './connection';

export async function insertInto(data, tableName, returnId = false) {
  if (!data.length) {
    return;
  }

  const db = getDB();

  let keysMass = Object.keys(data[0] || {});
  let valuesMass = [];

  let places = `(${'?,'.repeat(keysMass.length).slice(0, -1)})`;
  let temp = `${places},`.repeat(data.length).slice(0, -1);

  data.forEach(item => {
    keysMass.forEach(key => {
      valuesMass.push(item[key]);
    });
  });

  let sqlText = `
  INSERT INTO ${tableName} (${keysMass.join(', ')})
  VALUES ${temp}
  `;

  let newId;
  await db.transaction(tx => {
    tx.executeSql(
      sqlText,
      valuesMass,
      (_, result) => {
        newId = result.insertId;
      },
      err => {
        Alert.alert('Произошла непредвиденная ошибка!');
        console.log('error sqlGenerator INSERT', err);
      },
    );
  });

  if (returnId) {
    return newId;
  }
}
