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
CREATE TABLE IF NOT EXISTS "Timetable" (
	"id"	INTEGER,
	"time"	TEXT NOT NULL,
	"date"	TEXT NOT NULL,
	"id_client"	INTEGER NOT NULL,
	"type_client"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TypesField" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "SymptomsValues" (
	"id"	INTEGER,
	"id_symptom"	INTEGER NOT NULL,
	"value"	TEXT NOT NULL,
	"type"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("type") REFERENCES "TypesField"("id") ON DELETE SET NULL,
	FOREIGN KEY("id_symptom") REFERENCES "Symptoms" ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "Symptoms" (
	"id"	INTEGER,
	"id_section"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"id_parent"	INTEGER,
	"type"	INTEGER NOT NULL DEFAULT 6,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_parent") REFERENCES "Symptoms"("id") ON DELETE CASCADE,
	FOREIGN KEY("id_section") REFERENCES "Sections"("id") ON DELETE CASCADE,
	FOREIGN KEY("type") REFERENCES "TypesField"("id") ON DELETE SET DEFAULT
);
CREATE TABLE IF NOT EXISTS "Students" (
	"id"	INTEGER,
	"surname"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"midname"	TEXT,
	"group_org"	TEXT,
	"id_group"	INTEGER,
	"date_bd"	TEXT,
	"id_diagnos"	INTEGER,
	"id_categori"	INTEGER,
	"note"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_diagnos") REFERENCES "Diagnosis"("id") ON DELETE SET NULL,
	FOREIGN KEY("id_categori") REFERENCES "Categories"("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "Sections" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"id_template"	INTEGER NOT NULL,
	"show_label"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_template") REFERENCES "Templates"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "Groups" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"id_diagnos"	INTEGER,
	"id_category"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_diagnos") REFERENCES "Diagnosis"("id") ON DELETE SET NULL,
	FOREIGN KEY("id_category") REFERENCES "Categories"("id") ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS "Diagnosis" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"id_template"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_template") REFERENCES "Templates"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "CurrentSymptoms" (
	"id"	INTEGER,
	"id_student"	INTEGER NOT NULL,
	"id_symptomsValue"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_symptomsValue") REFERENCES "SymptomsValues"("id") ON DELETE CASCADE,
	FOREIGN KEY("id_student") REFERENCES "Students"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "ParentsStudent" (
	"id"	INTEGER,
	"type"	TEXT,
	"name"	TEXT,
	"id_student"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_student") REFERENCES "Students"("id") ON DELETE CASCADE
);
`;

const sqlData = `
INSERT INTO "Templates" ("id","name") VALUES (1,'Логопед'),
 (2,'Дефектолог');
INSERT INTO "Categories" ("id","name") VALUES (0,'Смешанная'),
 (1,'Подготовительная'),
 (2,'Старшая'),
 (3,'Средняя'),
 (4,'Младшая'),
 (5,'ГКП'),
 (6,'Школьники');
INSERT INTO "TypesField" ("id","name") VALUES (1,'radio'),
 (2,'checkbox'),
 (3,'table'),
 (4,'droplist'),
 (5,'custom'),
 (6,'label'),
 (7,'checker_only'),
 (8,'radio_only');
INSERT INTO "SymptomsValues" ("id","id_symptom","value","type") VALUES (1,1,'норма',NULL),
 (2,1,'произношение звуков смазанное',NULL),
 (3,1,'слаболабилизованное',NULL),
 (4,3,'высокий',NULL),
 (5,3,'средний',NULL),
 (6,3,'низкий',NULL),
 (7,4,'хорошее',NULL),
 (8,4,'среднее',NULL),
 (9,4,'не понимает обращенную речь',NULL),
 (10,6,'норма',NULL),
 (11,6,'нарушено незначительно',NULL),
 (12,6,'нарушено',NULL),
 (13,7,'не нарушена',NULL),
 (14,7,'сохраняет количество звуков в слове',NULL),
 (15,7,'нарушена',NULL),
 (16,8,'высокий',NULL),
 (17,8,'средний',NULL),
 (18,8,'низкий',NULL),
 (19,9,'норма',NULL),
 (20,9,'хриплый',NULL),
 (21,9,'нозализованный',NULL),
 (22,11,'норма',NULL),
 (23,11,'запинки',NULL),
 (24,11,'заикание',NULL),
 (25,12,'норма',NULL),
 (26,12,'слабый',NULL),
 (27,12,'затухающий',NULL),
 (28,12,'сильный',NULL),
 (29,13,'норма',NULL),
 (30,13,'толстые',NULL),
 (31,13,'тонкие',NULL),
 (32,13,'вывернутые',NULL),
 (33,13,'ассиметричные',NULL),
 (34,13,'малоподвижные',NULL),
 (35,14,'норма',NULL),
 (36,14,'мелкие',NULL),
 (37,14,'крупные',NULL),
 (38,14,'недостаток',NULL),
 (39,14,'лишние',NULL),
 (40,15,'норма',NULL),
 (41,15,'прогения',NULL),
 (42,15,'прогнатия',NULL),
 (43,15,'открытый',NULL),
 (44,16,'норма',NULL),
 (45,16,'толстый',NULL),
 (46,16,'тонкий',NULL),
 (47,16,'маленький',NULL),
 (48,16,'массивный',NULL),
 (49,16,'длинный',NULL),
 (50,16,'тремор',NULL),
 (51,17,'норма',NULL),
 (52,17,'укороченная',NULL),
 (53,17,'короткая',NULL),
 (54,18,'норма',NULL),
 (55,18,'высокое',NULL),
 (56,18,'узкое',NULL),
 (57,19,'нормальная',NULL),
 (58,19,'повышенная',NULL),
 (59,20,'самостоятельно',NULL),
 (60,20,'по вопросам',NULL),
 (61,20,'не справился',NULL),
 (62,21,'самостоятельно',NULL),
 (63,21,'по вопросам',NULL),
 (64,21,'не справился',NULL),
 (65,22,'самостоятельно',NULL),
 (66,22,'по вопросам',NULL),
 (67,22,'не справился',NULL),
 (68,23,'Дислалия',NULL),
 (69,23,'Ринофония и ринолалия',NULL),
 (70,23,'Дизартрия',NULL),
 (71,23,'Алалия',NULL),
 (72,23,'Афазия',NULL),
 (73,23,'Заикание',NULL),
 (74,23,'ФФНР',NULL),
 (75,23,'ОНР',NULL),
 (76,23,'Дислексия',NULL),
 (77,23,'Дисграфия',NULL),
 (78,24,'б',NULL),
 (79,24,'бь',NULL),
 (80,24,'п',NULL),
 (81,24,'пь',NULL),
 (82,24,'г',NULL),
 (83,24,'гь',NULL),
 (84,24,'к',NULL),
 (85,24,'кь',NULL),
 (86,24,'д',NULL),
 (87,24,'дь',NULL),
 (88,24,'т',NULL),
 (89,24,'ть',NULL),
 (90,24,'в',NULL),
 (91,24,'вь',NULL),
 (92,24,'ф',NULL),
 (93,24,'фь',NULL),
 (94,24,'х',NULL),
 (95,24,'хь',NULL),
 (96,24,'м',NULL),
 (97,24,'мь',NULL),
 (98,24,'н',NULL),
 (99,24,'нь',NULL),
 (100,24,'с',NULL),
 (101,24,'сь',NULL),
 (102,24,'з',NULL),
 (103,24,'зь',NULL),
 (104,24,'ц',NULL),
 (105,24,'ш',NULL),
 (106,24,'ж',NULL),
 (107,24,'щ',NULL),
 (108,24,'ч',NULL),
 (109,24,'л',NULL),
 (110,24,'ль',NULL),
 (111,24,'р',NULL),
 (112,24,'рь',NULL),
 (113,24,'й',NULL),
 (114,25,'Легко вступает в контакт',NULL),
 (115,25,'Трудно',NULL),
 (116,25,'Волнуется',NULL),
 (117,25,'Спокоен',NULL),
 (118,25,'Застенчив',NULL),
 (119,25,'Неадекватное поведение',NULL),
 (120,26,'Понимает сложную инструкцию',NULL),
 (121,26,'Понимает только простую инструкцию',NULL),
 (122,26,'Необходим показ',NULL),
 (123,26,'Инструкцию не понимает',NULL),
 (124,27,'Как тебя зовут?',NULL),
 (125,27,'Какая у тебя фамилия?',NULL),
 (126,27,'Сколько тебе лет?',NULL),
 (127,27,'Где ты живешь?',NULL),
 (128,27,'С кем ты живешь?',NULL),
 (129,27,' Как зовут твою маму?',NULL),
 (130,27,'Как зовут твоего папу?',NULL),
 (131,27,'Где и кем работает твоя мама?',NULL),
 (132,27,' Где и кем работает твой папа?',NULL),
 (133,27,' Какое сейчас время года?',NULL),
 (134,27,'Как ты догадался?',NULL),
 (135,29,'Нарушено',NULL),
 (136,29,'Не нарушено',NULL),
 (137,30,'Знает основные цвета',NULL),
 (138,30,'Знает основные цвета и оттенки',NULL),
 (139,30,'Путает/ не знает',NULL),
 (140,31,'Знает и определяет основные формы',NULL),
 (141,31,'Затрудняется',NULL),
 (142,32,'Знает и определяет величину',NULL),
 (143,32,'Затрудняется',NULL),
 (144,33,'Норма',NULL),
 (145,33,'Объем внимания снижен',NULL),
 (146,35,'Норма',NULL),
 (147,35,'Нарушено',NULL),
 (148,36,'Норма',NULL),
 (149,36,'Нарушено',NULL),
 (150,37,'Норма',NULL),
 (151,37,'Нарушено',NULL),
 (152,39,'Норма',NULL),
 (153,39,'Снижена',NULL),
 (154,40,'Норма',NULL),
 (155,40,'Снижена',NULL),
 (156,42,'Прямой счет до 5',1),
 (157,42,'Прямой счет до 10 ',1),
 (158,42,'Обратный',2),
 (159,43,'Сравнивает по 2 признакам',NULL),
 (160,43,'Сравнивает по 1 признаку',NULL),
 (161,43,'Не сравнивает',NULL),
 (162,44,'Определяет левую и правую сторону на себе',2),
 (163,44,'Может определить левую и правую сторону объекта',2),
 (164,44,'Ориентируется на листе',2),
 (165,44,'Не ориентируется в пространстве',7),
 (166,45,'Различает части суток',2),
 (167,45,'Называет дни недели',2),
 (168,45,'Различает времена года',2),
 (169,45,'Может назвать признаки времен года',2),
 (170,45,'Знает месяцы',2),
 (171,45,'Не ориентируется во временных представлениях',7),
 (172,46,'Решает примеры в пределах 5',1),
 (173,46,'Решает примеры в пределах 10',1),
 (174,46,'Не решает',8),
 (175,46,'Решает элементарные арифметические задачи ',2),
 (176,48,'Выполняет',NULL),
 (177,48,'Не выполняет',NULL),
 (178,49,'Выполняет',NULL),
 (179,49,'Не выполняет',NULL),
 (180,50,'Выполняет',NULL),
 (181,50,'Не выполняет',NULL),
 (182,51,'Выполняет',NULL),
 (183,51,'Не выполняет',NULL),
 (184,53,'Самостоятельно',NULL),
 (185,53,'По вопросам',NULL),
 (186,53,'Не справляется',NULL),
 (187,54,'Самостоятельно',NULL),
 (188,54,'По вопросам',NULL),
 (189,54,'Не справляется',NULL),
 (190,55,'Самостоятельно',NULL),
 (191,55,'По вопросам',NULL),
 (192,55,'Не справляется',NULL),
 (193,56,'Самостоятельно',NULL),
 (194,56,'По вопросам',NULL),
 (195,56,'Не справляется',NULL);
INSERT INTO "Symptoms" ("id","id_section","name","id_parent","type") VALUES (1,1,'Общее звучание речи',NULL,1),
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
 (24,3,'Таблица нарушений звукопроизношения',NULL,3),
 (25,5,'Контакт и эмоциональная реакция ребенка на обследование ',NULL,2),
 (26,5,'Понимание инструкции и цели задания ',NULL,2),
 (27,5,'Представление ребенка о себе и ближайшем окружении ',NULL,2),
 (28,6,'Восприятие',NULL,6),
 (29,6,'Целостность',28,1),
 (30,6,'Цвет',28,1),
 (31,6,'Форма',28,1),
 (32,6,'Величина',28,1),
 (33,6,'Внимание',NULL,1),
 (34,6,'Мышление',NULL,6),
 (35,6,'Наглядно-действенное',34,1),
 (36,6,'Наглядно-образное',34,1),
 (37,6,'Словесно-логическое',34,1),
 (38,6,'Память',NULL,6),
 (39,6,'Слуховая память',38,1),
 (40,6,'Зрительная память',38,1),
 (41,6,'Развитие элементарных математических представлений',NULL,6),
 (42,6,'Количество и счет',41,5),
 (43,6,'Операции сравнения',41,1),
 (44,6,'Ориентировка в пространстве',41,5),
 (45,6,'Ориентировка во времени',41,5),
 (46,6,'Составление и решение арифметических задач',41,5),
 (47,6,'Конструктивная деятельность',NULL,6),
 (48,6,'Умение строить по образцу ',47,1),
 (49,6,'Умение строить по графическому рисунку ',47,1),
 (50,6,'Умение строить самостоятельно',47,1),
 (51,6,'Умение зарисовать, обыграть постройку ',47,1),
 (52,6,'Связная речь',NULL,6),
 (53,6,'Пересказ',52,1),
 (54,6,'Рассказ по серии сюжетных картин',52,1),
 (55,6,'Рассказ по сюжетной картине',52,1),
 (56,6,'Описательный рассказ',52,1);
INSERT INTO "Sections" ("id","name","id_template","show_label") VALUES (1,'Симптоматика',1,NULL),
 (2,'default_main',1,NULL),
 (3,'Таблица нарушений звукопроизношения',1,'Таблица звуков'),
 (4,'Контакт, понимание, представления',2,'Обследование'),
 (5,'Характеристика интеллектуальной деятельности',2,'Симптоматика');
INSERT INTO "Diagnosis" ("id","name","id_template") VALUES (0,'Нет заключения',NULL),
 (2,'ТНР',1),
 (3,'ЗПР',1),
 (4,'РАС',1),
 (5,'НОДА',1),
 (6,'Нарушение слуха',1),
 (7,'Нарушение зрения',1),
 (8,'УО',1),
 (9,'ООП',1),
 (10,'ЗПР',2),
 (11,'РАС',2),
 (12,'НОДА',2),
 (13,'Нарушение слуха',2),
 (14,'Нарушение зрения',2),
 (15,'УО',2);
`;
