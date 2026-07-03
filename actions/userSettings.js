import AsyncStorage from '@react-native-async-storage/async-storage';
// установка стандартных настроек пользователя
async function defaultSettingUser() {
  let data = [
    ['opened', 'false'],
    ['firstScreen', 'students'],
    ['templates', '[]'],
    ['typeSchedule', 'week'],
    ['showCategories', 'false'],
    ['showSubCategories', 'false'],
    ['bigCardStudent', 'true'],
    ['bigCardGroup', 'true'],
    ['bigCardTimetable', 'true'],
    ['sizeCardAll', '["big"]'],
    ['databaseV', '1'],
    ['groupBy_Student', 'without'],
    ['groupBy_Group', 'without'],
    ['groupBy_Timetable', 'date'],
  ];
  try {
    // async-storage v3 removed multiSet — write each key individually
    await Promise.all(data.map(([key, val]) => AsyncStorage.setItem(key, val)));
  } catch (e) {
    console.warn('error async\n', e);
  }
  return convertArrayToObj(data);
}

// ковертация массива в объект с преобразованием строк в булево
function convertArrayToObj(data) {
  let newData = {};
  data.forEach(elMass => {
    let key = elMass[0];
    let val;
    // можем хранить массивы/булево/строки
    try {
      // делаем преобразование
      val = JSON.parse(elMass[1]);
    } catch {
      // не получилось - значит строка
      val = elMass[1];
    }
    newData[key] = val;
  });
  return newData;
}

// получение настроек пользователя
export async function getUserSetting() {
  let keys = [];
  let values;
  try {
    // получаем ключи хранилища
    keys = await AsyncStorage.getAllKeys();
    // хранилище не было иницилизированно
    if (keys.length == 0) {
      // создаем новое
      values = await defaultSettingUser();
      return values;
    } else {
      // получаем данные с хранилища (async-storage v3 removed multiGet)
      values = await Promise.all(
        keys.map(async key => [key, await AsyncStorage.getItem(key)]),
      );
      // конвертируем данные
      return convertArrayToObj(values);
    }
  } catch (e) {
    console.warn('error async getUserSetting\n', e);
  }
}

// изменение значений ключа
export async function setUserSetting(key, val) {
  try {
    // обновляем глобалку
    userSettings[key] = val;
    // загружаем в хранилище
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('error async setUserSetting\n', e);
  }
}
