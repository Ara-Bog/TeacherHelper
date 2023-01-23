import SQLite from 'react-native-sqlite-storage';

// require the module
var RNFS = require('react-native-fs');

SQLite.enablePromise(true);

// список таблиц для редактирования (переделать на общий модуль)
const requiredColumns = ['Students', 'Timetable', 'Groups', 'CurrentSymptoms'];

export async function exportToJson() {
  let currentTime = new Date().toISOString().slice(0, -5).replaceAll(':', '-');
  let fileName = 'TH' + currentTime + '.json';
  let pathDownload = RNFS.DownloadDirectoryPath + '/' + fileName;
  let sqlRequest;
  let contentDb = {};

  confirmCheck = db.transaction(tx => {
    requiredColumns.forEach(item => {
      sqlRequest = 'SELECT * FROM ' + item;
      tx.executeSql(
        sqlRequest,
        [],
        (_, {rows}) => (rows.length ? (contentDb[item] = rows.raw()) : null),
        err => console.log('test error ', err),
      );
    });
  });

  confirmCheck.then(() =>
    RNFS.writeFile(pathDownload, JSON.stringify(contentDb)),
  );
}
