import SQLite from 'react-native-sqlite-storage';
import {Alert} from 'react-native';

SQLite.enablePromise(true);

export async function deleteUser(id) {
  await db.transaction(tx => {
    // удаление записей в расписании
    tx.executeSql(
      "DELETE FROM Timetable WHERE id_client = ? AND type_client = 's'",
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error db - ', err)
      ),
    );
    // удаление текущих симптомов
    tx.executeSql(
      'DELETE FROM CurrentSymptoms WHERE id_student = ?',
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error db - ', err)
      ),
    );
    // удаление связей с группой
    tx.executeSql(
      'DELETE FROM ListStudentsGroup WHERE id_student = ?',
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error db - ', err)
      ),
    );
    // удаление ученика
    tx.executeSql(
      `
      DELETE FROM Students
      WHERE id = ?
      `,
      [id],
      () => null,
      err => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error db - ', err)
      ),
    );
  });
}

export async function deleteGroup(id) {
  db.transaction(tx => {
    // удаление из расписания
    tx.executeSql(
      `DELETE FROM Timetable WHERE id_client = ? AND type_client = 'g'`,
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error removeGroup (timetable) - ', err)
      ),
    );
    // удаление текущих симптомов
    tx.executeSql(
      'DELETE FROM ListStudentsGroup WHERE id_group = ?',
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error removeGroup (ListStudentsGroup) - ', err)
      ),
    );
    // удаление ученика
    tx.executeSql(
      `DELETE FROM Groups WHERE id = ?`,
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error removeGroup (Groups) - ', err)
      ),
    );
  });
}

export async function deleteTimetable(id) {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM Timetable WHERE id = ?`,
      [id],
      () => null,
      (_, err) => (
        Alert.alert('Произошла непредвиденная ошибка!'),
        console.log('error removeGroup (timetable) - ', err)
      ),
    );
  });
}
