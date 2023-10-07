import SQLite from 'react-native-sqlite-storage';
import {setUserSetting} from './userSettings';

SQLite.enablePromise(true);

export async function checkVersion() {
  let flagCheck = true;

  while (flagCheck) {
    switch (userSettings.databaseV) {
      case undefined:
      case null:
        await structureToV1();
        await dataToV1();
        await setUserSetting('databaseV', 1);
        await setUserSetting('groupBy_Student', 'without');
        await setUserSetting('groupBy_Group', 'without');
        await setUserSetting('groupBy_Timetable', 'date');
        break;
      default:
        flagCheck = false;
        break;
    }
  }
}

async function structureToV1() {
  return db.transaction(tx => {
    tx.executeSql(
      `ALTER TABLE Timetable
        RENAME COLUMN time TO time_start`,
      [],
      null,
      err => {
        console.log('ERROR V1 RENAME', err);
      },
    );
    tx.executeSql(
      `ALTER TABLE Timetable
        ADD time_end TEXT NOT NULL DEFAULT "00:00"`,
      [],
      null,
      err => {
        console.log('ERROR V1 ADD COL', err);
      },
    );
  });
}

async function dataToV1() {
  return db.transaction(tx => {
    tx.executeSql(
      `UPDATE Timetable
        SET time_end = strftime('%H:%M', time_start, '+5 minutes')`,
      [],
      null,
      err => {
        console.log('ERROR UPDATE time_end', err);
      },
    );
  });
}
