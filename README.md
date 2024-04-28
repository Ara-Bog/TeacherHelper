# Запуск

Запуск с установкой на открытом устройстве

### npx react-native run-android

Запуск сервера для подключения

### npx start

Создание apk

### cd android

### ./gradlew.bat assembleRelease

Проверка версий зависимостей

### npm outdated

Обновление всех зависимостей

### npm update

# Выполненные задачи

- [x] хранилище настроек;

- [x] страница настроек;

- [x] заглушка загрузки (необходим тест полезности);

- [x] экран загрузки;

- [x] splash screen;

- [x] экспорт/импорт/очистка бд;

- [x] элементы страниц учеников (дефектолог / логопед);

- [x] динамическая генерация страниц;

- [x] фильтры (ученики, группы);

- [x] поиск (ученики, группы);

- [x] обучалка при первом старте;

- [x] второй вид расписаня

# Текущие задачи

- [ ] добавить кнопку очистки прошедших дней расписания (на странице настройки при календарном распасинии);

# Пользовательские настройки

## userSettings._setting_ - глобальное объявление

## Список настроек:

opened - для показа обучения

firstScreen - первый экран при загрузке

templates - используемые шаблоны

typeSchedule - тип расписания

showCategories - раскрывать категории карточки

showSubCategories - раскрывать подкатегории карточки

bigCardStudents - большие карточки студентов

bigCardGroup - большие карточки групп

bigCardTimetable - большие карточки расписания

sizeCardAll - размер карточек по умолчанию

databaseV - текущая версия БД

# База данных (SQLite)

![db diagramma] (DB.png)

## Categories (default)

Возрастная категория учащихся

id: integer

name: text

## CurrentSymptoms (default)

Связь ученика со значениями симптомов

id: integer

id_student: integer (foreign Students)

id_symptomsValue: integer (foreign Symptoms_values)

## Diagnosis (default)

Диагзнозы

id: integer

name: text

id_template: integer (foreign Templates)

## Groups

Сформированные группы

id: integer

name: text

id_diagnos: integer (foreign Diagnosis)

id_category: integer (foreign Categories)

## Sections (default)

Области (вкладки) для шаблонов

id: integer

name: text

id_template: integer (foreign Templates)

show_label: text (текст для отображения во вкладке)

## Students

Ученики

id: integer

surname: text

name: text

midname: text

group_org: text (имя группы в которой состоит ученик в организации)

date_bd: text

id_diagnos: integer (foreign Diagnosis)

id_categori: integer (foreign Categories)

note: text (заметки)

## Symptoms (default)

Симптомы

id: integer

id_section: integer (foreign Sections) (к какому шаблону относится)

name: text

id_parent: integer (foreign Symptoms) (симптомы должны строится иерархически)

type: integer (foreign TypeField)

note: text (заметки)

## SymptomsValues (default)

Значения симптомов

id: integer

id_symptom: integer (foreign Symptoms)

value: text

type: integer (foreign TypeField)

## Templates (default)

Шаблоны

id: integer

name: text

## Timetable

Расписание

id: integer

time: text

date: text

id_client: integer (id Group/Student)

type_client: text ('s' или 'g') (от этого зависит, с какой таблицы будет братся id_client)

## TypesField (default)

Типы функциональных блоков

Текущий список:

- radio - блок радио кнопок;

- checkbox - блок чекбоксов;

- table_sound - таблица чекбоксов (применяется к таблице звукопроизношения);

- droplist - выпадающий список;

- custom - комбинированный блок. данный тип применим исключительно в таблице Symptoms. при использовании, в SymptomsValues для каждого значения индивидуально указывается его тип;

- label - только заголовок (не имеет значений). данный тип применим исключительно в таблице Symptoms;

- check_disabler - чекбокс, при выборе которого блокируется выбор других значений в блоке;

- radio_disabler - радиокнопка, при выборе которой блокируетвся выбор других значений в блоке (в случаях, когда необходимо заблокировать checkbox в блоке).

id: integer

name: text
