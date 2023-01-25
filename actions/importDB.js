import SQLite from 'react-native-sqlite-storage';

// require the module
var RNFS = require('react-native-fs');

SQLite.enablePromise(true);

// список таблиц для редактирования (переделать на общий модуль)
const requiredColumns = ['Students', 'Timetable', 'Groups', 'CurrentSymptoms'];

export async function importFromJson(uriMasterBase, saveData) {
  let newData; // хранилище данных
  let currentIds = {}; // последние id-шники каждой таблицы
  let tablesOnLoad = []; // хранилище промисов с загрузкой данных в базу

  // считываем файл с временного хранилища
  readingFile = RNFS.readFile(uriMasterBase);

  // по окончанию считывания - переопределяем newData
  await readingFile
    .then(res => (newData = JSON.parse(res)))
    .catch(err => console.log('importFromJson readfile - ', err));

  if (newData.typeSchedule != userSettings.typeSchedule) {
    userSettings.typeSchedule = newData.typeSchedule;
  }

  delete newData.typeSchedule;

  // блок с очисткой текущих данных
  if (!saveData) {
    await clearData();
    // нулевые seq, т.к. выше очистили sqlite_sequence
    requiredColumns.forEach(elem => {
      currentIds[elem] = 0;
    });
  } else {
    // текущие seq
    currentIds = await getIds();
  }

  // обход всех таблиц с новых данных
  Object.keys(newData).forEach(tableName => {
    let tempKeys = '(' + Object.keys(newData[tableName][0]).join(', ') + ')'; // шаблон порядка столбцов
    let massValues = []; // массив всех заполняемых значений
    let selectId = currentIds[tableName]; // последний записаный id
    let tempVals; // шаблон VALUES (многострочная запись)

    let tempVal =
      '(' +
      '?,'.repeat(Object.keys(newData[tableName][0]).length).slice(0, -1) +
      '),'; // шаблон 1 строки (?,?,?,?)
    tempVals = tempVal.repeat(newData[tableName].length).slice(0, -1); // многострочный шаблон (?,?,?,?),(?,?,?,?)
    // получение общего списка значений для запроса
    newData[tableName].forEach(row => {
      // увеличиваем id до последнего в базе
      row['id'] += selectId;
      // ебаная проверка, которую надо заменить
      // увеличиваем зависимые ключи на соответствующий seq
      if (row['id_group'] !== undefined) {
        row['id_group'] += currentIds['Groups'];
      } else if (row['id_student'] !== undefined) {
        row['id_student'] += currentIds['Students'];
      } else if (row['id_client'] !== undefined) {
        // разный seq для студентов и групп в таблице timetable
        let idForTimeTable =
          row['type_client'] == 'g'
            ? currentIds['Groups']
            : currentIds['Students'];
        row['id_client'] += idForTimeTable;
      }

      // общий список всех значений
      massValues = [...massValues, ...Object.values(row)];
    });
    // формируем sql запрос без значений
    let sqlReq = `INSERT INTO "${tableName}" ${tempKeys} VALUES ${tempVals}`;
    tablesOnLoad.push(
      db.transaction(tx => {
        tx.executeSql(sqlReq, massValues);
      }),
    ); // добавляем промис загрузки в бд, чтобы дождаться, пока все не загрузятся
  });

  Promise.all(tablesOnLoad)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}

// получение последних id по всем таблицам в виде объекта
async function getIds() {
  let currentIds = {};
  // получаем из sqlite_sequence текущие seq
  await db.transaction(tx => {
    tx.executeSql('SELECT * FROM `sqlite_sequence`', [], (_, {rows}) =>
      rows.raw().map(({name, seq}) => (currentIds[name] = seq)),
    );
  });

  // проверяем наличие обязательных таблиц в sqlite_sequence
  // нужно потому, что мы чистим sqlite_sequence, а новые записи добавляются только после изменения соответствующей таблицы
  requiredColumns.forEach(val => {
    if (currentIds[val] === undefined) {
      currentIds[val] = 0;
    }
  });
  // {"Categories": 6, "CurrentSymptoms": 0, "Diagnosis": 10}
  return currentIds;
}

// очистка строк из списка таблиц
export async function clearData() {
  return db.transaction(tx => {
    // по каждой обязательной таблице удаляем записи
    requiredColumns.forEach(item => {
      sqlRequest = 'DELETE FROM ' + item;
      tx.executeSql(sqlRequest);
    });
    // очищаем инкременты для id, при добавлении новой строки в таблице снова создается запись по таблице
    tx.executeSql('DELETE FROM `sqlite_sequence`');
  });
}
