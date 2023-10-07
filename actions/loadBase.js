import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// отрытие базы и последующие проверки
export async function openDB() {
  return new Promise(function (resolve, reject) {
    // открытие базы
    base = SQLite.openDatabase(
      {name: 'database.db', createFromLocation: 1},
      undefined,
      err => console.log('Error with connect to database', err),
    );
    // проверка на пустые данные
    base.then(base => {
      resolve(base);
      // checkFill = checkFillData(base);
      // checkFill.then(res => {
      //   if (res) {
      //     // данные не пустые - возвращаем базу

      //   } else {
      //     // создание таблиц
      //     createBase(base).then(() => {
      //       // создание данных по умолчанию
      //       insertDefaultData(base).then(() => {
      //         // возврат готовой базы
      //         resolve(base);
      //       });
      //     });
      //   }
      // });
    });
  });
}

// проверка на наличие таблиц (при отсутствии будет вызов заполнение в родителе)
// async function checkFillData(base) {
//   return new Promise(resolve => {
//     let currentVersion;
//     checkVersion = base.transaction(tx => {
//       tx.executeSql(
//         `PRAGMA user_version;`,
//         [],
//         (_, {rows}) => (currentVersion = rows.raw()[0].user_version),
//       );
//     });
//     checkVersion.then(() => resolve(currentVersion === actualVersionBD));
//   });
// }
