// подключение базы
import {openDB} from './actions/loadBase';

// настройки пользователя
import {getUserSetting} from './actions/userSettings';
// стили
import StylesObject from './styleGlobal.js';
// иконки
import IconsFile from './icons';

// глобальная ссылка на базу
global.db = openDB();

// глобальная ссылка на стили и иконки
global.Styles = StylesObject;
global.Icons = IconsFile;

// глобальная ссылка на настройки
global.userSettings = getUserSetting();
