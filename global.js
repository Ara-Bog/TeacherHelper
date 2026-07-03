// подключение базы - новый модуль connection
import {openDB} from './database/connection';

// настройки пользователя
import {getUserSetting} from './actions/userSettings';
// стили - из нового модульного стилей
import Styles from './styles/index';
// иконки
import IconsFile from './icons';

// глобальная ссылка на базу (Promise, resolves в App.js)
global.db = openDB();

// глобальная ссылка на стили и иконки
global.Styles = Styles;
global.Icons = IconsFile;

// глобальная ссылка на настройки
global.userSettings = getUserSetting();
