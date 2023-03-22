import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export async function insertInto(data, tableName, idCont, fillCont) {
  if (!data.length) {
    return;
  }

  let keysMass = Object.keys(data[0] || {});
  let valuesMass = [];

  let places = `(${'?,'.repeat(keysMass.length).slice(0, -1)}, ?)`;
  let temp = `${places},`.repeat(data.length).slice(0, -1);

  data.forEach(item => {
    keysMass.forEach(key => {
      valuesMass.push(item[key]);
    });
    valuesMass.push(idCont);
  });

  let sqlText = `
  INSERT INTO ${tableName} (${keysMass.join(', ')}, ${fillCont})
  VALUES ${temp}
  `;

  await db.transaction(tx => {
    tx.executeSql(
      sqlText,
      valuesMass,
      () => {},
      err => {
        console.log('error sqlGenerator INSERT', err);
      },
    );
  });
}

// async function execute(text, values) {
//   return
// }
