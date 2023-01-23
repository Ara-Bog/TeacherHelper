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
      checkFill = checkFillData(base);
      checkFill.then(res => {
        if (res) {
          // данные не пустые - возвращаем базу
          resolve(base);
        } else {
          // создание таблиц
          createBase(base).then(() => {
            // создание данных по умолчанию
            insertDefaultData(base).then(() => {
              // возврат готовой базы
              resolve(base);
            });
          });
        }
      });
    });
  });
}

// проверка на наличие таблиц (при отсутствии будет вызов заполнение в родителе)
async function checkFillData(base) {
  return new Promise(resolve => {
    let lenBase;
    checkLenBase = base.transaction(tx => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table'`,
        [],
        (_, {rows}) => (lenBase = rows.length),
      );
    });
    checkLenBase.then(() => resolve(lenBase > 1));
  });
}

// создание стандартных таблиц с колонками
export async function createBase(base) {
  console.log('create database');
  return new Promise(resolve => {
    base
      .transaction(tx => {
        tx.executeSql(sqlBase);
      })
      .then(() => createBase(base));
  });
}

// вставка данных по умолчанию
export async function insertDefaultData(base) {
  return new Promise(resolve => {
    base
      .transaction(tx => {
        tx.executeSql(sqlData);
      })
      .then(() => resolve());
  });
}

const sqlBase = `
CREATE TABLE IF NOT EXISTS "Templates" (
  "id"	INTEGER,
  "name"	TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Categories" (
  "id"	INTEGER,
  "name"	TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Groups" (
  "id"	INTEGER,
  "name"	TEXT NOT NULL,
  "diagnos_id"	INTEGER NOT NULL,
  "category_id"	INTEGER NOT NULL,
  FOREIGN KEY("diagnos_id") REFERENCES "Diagnosis"("id"),
  FOREIGN KEY("category_id") REFERENCES "Categories"("id"),
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Studetns" (
  "id"	INTEGER,
  "surname"	TEXT NOT NULL,
  "name"	TEXT NOT NULL,
  "midname"	TEXT,
  "group_org"	TEXT,
  "group_id"	INTEGER,
  "date_bd"	INTEGER,
  "diagnos_id"	INTEGER NOT NULL,
  "categori_id"	INTEGER NOT NULL,
  "note"	TEXT,
  FOREIGN KEY("categori_id") REFERENCES "Categories"("id"),
  FOREIGN KEY("diagnos_id") REFERENCES "Diagnosis"("id"),
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Timetable" (
  "id"	INTEGER,
  "time"	TEXT NOT NULL,
  "date"	TEXT NOT NULL,
  "client_id"	INTEGER NOT NULL,
  "type_client"	TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Diagnosis" (
  "id"	INTEGER,
  "name"	TEXT NOT NULL,
  "template_id"	INTEGER,
  FOREIGN KEY("template_id") REFERENCES "Templates"("id"),
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Types_field" (
  "id"	INTEGER,
  "name"	TEXT NOT NULL,
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Symptoms" (
  "id"	INTEGER,
  "section_id"	INTEGER NOT NULL,
  "name"	TEXT NOT NULL,
  "parent_id"	INTEGER,
  "type"	INTEGER NOT NULL,
  FOREIGN KEY("section_id") REFERENCES "Sections"("id"),
  FOREIGN KEY("parent_id") REFERENCES "Symptoms"("id"),
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Sections" (
  "id"	INTEGER,
  "name"	TEXT NOT NULL,
  "tempalte_id"	INTEGER NOT NULL,
  "show_label"	INTEGER DEFAULT 0,
  FOREIGN KEY("tempalte_id") REFERENCES "Templates"("id"),
  PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Symptoms_values" (
  "id"	INTEGER,
  "symptom_id"	INTEGER NOT NULL,
  "value"	TEXT NOT NULL,
  "type"	INTEGER,
  FOREIGN KEY("type") REFERENCES "Types_field"("id"),
  FOREIGN KEY("symptom_id") REFERENCES "Symptoms",
  PRIMARY KEY("id" AUTOINCREMENT)
);`;

const sqlData = `
INSERT INTO "Templates" ("id","name") VALUES (1,'Логопед'),
(2,'Дефектолог');
INSERT INTO "Categories" ("id","name") VALUES (1,'Подготовительная'),
(2,'Старшая'),
(3,'Средняя'),
(4,'Младшая'),
(5,'ГКП'),
(6,'Школьники');INSERT INTO "Diagnosis" ("id","name","template_id") VALUES (1,'Нет заключения',NULL),
(2,'ТНР',1),
(3,'ЗПР',1),
(4,'РАС',1),
(5,'НОДА',1),
(6,'Нарушение слуха',1),
(7,'Нарушение зрения',1),
(8,'УО',1),
(9,'ООП',1);
INSERT INTO "Types_field" ("id","name") VALUES (0,''),
(1,'radio'),
(2,'checkbox'),
(3,'table_sound'),
(4,'droplist'),
(5,'custom'),
(6,'label');
INSERT INTO "Symptoms" ("id","section_id","name","parent_id","type") VALUES (1,1,'Общее звучание речи',NULL,1),
(2,1,'Строение речевого аппарата',NULL,6),
(3,1,'Обследование словаря',NULL,1),
(4,1,'Обследование понимания речи',NULL,1),
(5,1,'Обследование связной речи',NULL,6),
(6,1,'Обследование фонематического слуха',NULL,1),
(7,1,'Обследование слоговой структуры слова',NULL,1),
(8,1,'Обследование грамматического строя речи',NULL,1),
(9,1,'голос',1,1),
(10,1,'темп речи',1,1),
(11,1,'плавность',1,1),
(12,1,'сила',1,1),
(13,1,'губы',2,1),
(14,1,'зубы',2,1),
(15,1,'прикус',2,1),
(16,1,'язык',2,1),
(17,1,'подъязычная уздечка',2,1),
(18,1,'нёбо',2,1),
(19,1,'саливация',2,1),
(20,1,'Рассказ по картинке',5,1),
(21,1,'Рассказ по серии сюжетных картинок',5,1),
(22,1,'Пересказ',5,1),
(23,2,'Заключение логопеда',NULL,4),
(24,3,'Таблица нарушений звукопроизношения',NULL,3);
INSERT INTO "Sections" ("id","name","tempalte_id","show_label") VALUES (1,'Симптоматика',1,1),
(2,'personal',1,0),
(3,'Таблица нарушений звукопроизношения',1,0);
INSERT INTO "Symptoms_values" ("id","symptom_id","value","type") VALUES (2,1,'норма',NULL),
(3,1,'произношение звуков смазанное',NULL),
(4,1,'слаболабилизованное',NULL),
(5,3,'высокий',NULL),
(6,3,'средний',NULL),
(7,3,'низкий',NULL),
(8,4,'хорошее',NULL),
(9,4,'среднее',NULL),
(10,4,'не понимает обращенную речь',NULL),
(11,6,'норма',NULL),
(12,6,'нарушено незначительно',NULL),
(13,6,'нарушено',NULL),
(14,7,'не нарушена',NULL),
(15,7,'сохраняет количество звуков в слове',NULL),
(16,7,'нарушена',NULL),
(17,8,'высокий',NULL),
(18,8,'средний',NULL),
(19,8,'низкий',NULL),
(20,9,'норма',NULL),
(21,9,'хриплый',NULL),
(22,9,'нозализованный',NULL),
(23,11,'норма',NULL),
(24,11,'запинки',NULL),
(25,11,'заикание',NULL),
(26,12,'норма',NULL),
(27,12,'слабый',NULL),
(28,12,'затухающий',NULL),
(29,12,'сильный',NULL),
(30,13,'норма',NULL),
(31,13,'толстые',NULL),
(32,13,'тонкие',NULL),
(33,13,'вывернутые',NULL),
(34,13,'ассиметричные',NULL),
(35,13,'малоподвижные',NULL),
(36,14,'норма',NULL),
(37,14,'мелкие',NULL),
(38,14,'крупные',NULL),
(39,14,'недостаток',NULL),
(40,14,'лишние',NULL),
(41,15,'норма',NULL),
(42,15,'прогения',NULL),
(43,15,'прогнатия',NULL),
(44,15,'открытый',NULL),
(45,16,'норма',NULL),
(46,16,'толстый',NULL),
(47,16,'тонкий',NULL),
(48,16,'маленький',NULL),
(49,16,'массивный',NULL),
(50,16,'длинный',NULL),
(51,16,'тремор',NULL),
(52,17,'норма',NULL),
(53,17,'укороченная',NULL),
(54,17,'короткая',NULL),
(55,18,'норма',NULL),
(56,18,'высокое',NULL),
(57,18,'узкое',NULL),
(58,19,'нормальная',NULL),
(59,19,'повышенная',NULL),
(60,20,'самостоятельно',NULL),
(61,20,'по вопросам',NULL),
(62,20,'не справился',NULL),
(63,21,'самостоятельно',NULL),
(64,21,'по вопросам',NULL),
(65,21,'не справился',NULL),
(66,22,'самостоятельно',NULL),
(67,22,'по вопросам',NULL),
(68,22,'не справился',NULL),
(69,23,'Дислалия',NULL),
(70,23,'Ринофония и ринолалия',NULL),
(71,23,'Дизартрия',NULL),
(72,23,'Алалия',NULL),
(73,23,'Афазия',NULL),
(74,23,'Заикание',NULL),
(75,23,'ФФНР',NULL),
(76,23,'ОНР',NULL),
(77,23,'Дислексия',NULL),
(78,23,'Дисграфия',NULL),
(79,24,'б',NULL),
(80,24,'бь',NULL),
(81,24,'п',NULL),
(82,24,'пь',NULL),
(83,24,'г',NULL),
(84,24,'гь',NULL),
(85,24,'к',NULL),
(86,24,'кь',NULL),
(87,24,'д',NULL),
(88,24,'дь',NULL),
(89,24,'т',NULL),
(90,24,'ть',NULL),
(91,24,'в',NULL),
(92,24,'вь',NULL),
(93,24,'ф',NULL),
(94,24,'фь',NULL),
(95,24,'х',NULL),
(96,24,'хь',NULL),
(97,24,'м',NULL),
(98,24,'мь',NULL),
(99,24,'н',NULL),
(100,24,'нь',NULL),
(101,24,'с',NULL),
(102,24,'сь',NULL),
(103,24,'з',NULL),
(104,24,'зь',NULL),
(105,24,'ц',NULL),
(106,24,'ш',NULL),
(107,24,'ж',NULL),
(108,24,'щ',NULL),
(109,24,'ч',NULL),
(110,24,'л',NULL),
(111,24,'ль',NULL),
(112,24,'р',NULL),
(113,24,'рь',NULL),
(114,24,'й',NULL);`;
