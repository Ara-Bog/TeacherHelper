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
    ['bigCardStudents', 'true'],
    ['bigCardGroup', 'true'],
    ['bigCardTimetable', 'true'],
    ['sizeCardAll', '["big"]'],
  ];
  try {
    await AsyncStorage.multiSet(data);
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
    keys = await AsyncStorage.getAllKeys();
    if (keys.length == 0) {
      values = await defaultSettingUser();
      return values;
    } else {
      values = await AsyncStorage.multiGet(keys);
      return convertArrayToObj(values);
    }
  } catch (e) {
    console.warn('error async\n', e);
  }
}

// изменение значений ключа
export async function setUserSetting(key, val) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('error async\n', e);
  }
}
