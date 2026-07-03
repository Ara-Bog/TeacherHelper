import {getDB} from './connection';
import {setUserSetting} from '../actions/userSettings';

export async function checkVersion() {
  const db = getDB();
  let flagCheck = true;

  while (flagCheck) {
    switch (userSettings.databaseV) {
      case undefined:
      case null:
        await structureToV1(db);
        await dataToV1(db);
        await setUserSetting('databaseV', 1);
        await setUserSetting('groupBy_Student', 'without');
        await setUserSetting('groupBy_Group', 'without');
        await setUserSetting('groupBy_Timetable', 'date');
        break;
      case 1:
        await migrateToV2(db);
        await setUserSetting('databaseV', 2);
        break;
      default:
        flagCheck = false;
        break;
    }
  }
}

async function structureToV1(db) {
  return db.transaction(tx => {
    tx.executeSql(
      `ALTER TABLE Timetable RENAME COLUMN time TO time_start`,
      [],
      null,
      err => console.log('ERROR V1 RENAME', err),
    );
    tx.executeSql(
      `ALTER TABLE Timetable ADD time_end TEXT NOT NULL DEFAULT "00:00"`,
      [],
      null,
      err => console.log('ERROR V1 ADD COL', err),
    );
  });
}

async function dataToV1(db) {
  return db.transaction(tx => {
    tx.executeSql(
      `UPDATE Timetable SET time_end = strftime('%H:%M', time_start, '+5 minutes')`,
      [],
      null,
      err => console.log('ERROR UPDATE time_end', err),
    );
  });
}

// V2: Add indexes for performance
async function migrateToV2(db) {
  return db.transaction(tx => {
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_students_template ON Students(id_template)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_symptoms_section ON Symptoms(id_section)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_timetable_date ON Timetable(date)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_timetable_client ON Timetable(type_client, id_client)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_current_symptoms_student ON CurrentSymptoms(id_student)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_list_students_group_group ON ListStudentsGroup(id_group)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_list_students_group_student ON ListStudentsGroup(id_student)',
    );
    tx.executeSql(
      'CREATE INDEX IF NOT EXISTS idx_parents_student ON ParentsStudent(id_student)',
    );
  });
}
