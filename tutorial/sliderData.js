import {Text, View, StyleSheet, TextInput} from 'react-native';

const Card = data => (
  <View style={[Styles.cardDelault, {padding: 18, gap: 11.7}]}>
    <View style={Styles.cardDelaultRow}>
      {data.time ? (
        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <Icons.Feather name="clock" size={13} color="#554AF0" />
          <Text style={localStyle.cardRowTitle}>{data.LeftTop}</Text>
        </View>
      ) : (
        <Text style={[localStyle.cardRowTitle, {flexShrink: 1}]}>
          {data.LeftTop}
        </Text>
      )}
      <Text style={localStyle.cardRowText}>{data.RightTop}</Text>
    </View>
    <View style={Styles.cardDelaultRowLine}></View>
    <View style={Styles.cardDelaultRow}>
      <Text style={[localStyle.cardRowText, {flexShrink: 1}]}>
        {data.LeftBot}
      </Text>
      <Text style={localStyle.cardRowText}>{data.RightBot}</Text>
    </View>
  </View>
);

const Checkbox = ({select, label, only}) => (
  <View style={[localStyle.checkbox, {gap: 8}]}>
    <View
      style={[
        localStyle.checkboxIcon,
        select ? localStyle.checkboxIcon__active : null,
      ]}>
      {select ? <Icons.Octicons name="check" size={13} color="#fff" /> : null}
    </View>
    <View style={{flex: 1}}>
      <Text style={[localStyle.checkboxText]}>{label}</Text>
      {only ? (
        <Text style={localStyle.checkboxTextSub}>
          Блокирует выбор остальных значений
        </Text>
      ) : null}
    </View>
  </View>
);

const DropLabel = ({label, select, simpleShow}) => (
  <View
    style={
      simpleShow
        ? localStyle.dropdownListWrap__nasted
        : localStyle.dropdownListWrap
    }>
    <Text
      style={
        simpleShow
          ? localStyle.dropdownListText__nested
          : localStyle.dropdownListText
      }>
      {label}
    </Text>
    <Icons.Entypo
      name="chevron-down"
      style={[
        {alignSelf: 'center'},
        select ? {transform: [{rotate: '180deg'}]} : null,
      ]}
      size={15}
      color={simpleShow ? '#B1B1B1' : '#554AF0'}
    />
  </View>
);

const GroupStudent = ({label, pluss}) => (
  <View style={Styles.selectedListRow}>
    <Text style={localStyle.selectedListRowText}>{label}</Text>
    {pluss ? (
      <View
        style={{
          ...localStyle.selectedListRowBtn,
          backgroundColor: '#EEEDFE',
        }}>
        <Icons.Feather name="plus" size={12} color="#554AF0" />
      </View>
    ) : (
      <View
        style={{
          ...localStyle.selectedListRowBtn,
          backgroundColor: '#fcefef',
        }}>
        <Icons.Feather name="minus" size={12} color="#DC5F5A" />
      </View>
    )}
  </View>
);

const ListStudents = () => (
  <View pointerEvents="none" style={localStyle.wrapList}>
    <View style={localStyle.listHeader}>
      <Text style={localStyle.listHeaderText}>Ученики</Text>
    </View>
    <View style={localStyle.listContent}>
      <View
        style={[
          Styles.inputDefaultWrap,
          {position: 'relative', paddingVertical: 12, paddingHorizontal: 12},
        ]}>
        <Icons.Octicons
          name="search"
          color="#B1B1B1"
          size={12}
          style={{paddingVertical: 2.5, transform: [{scaleX: -1}]}}
        />
        <TextInput
          style={[Styles.inputDefault, {fontSize: 10.7, lineHeight: 10.7}]}
          value={null}
          inputMode={'search'}
          placeholder="Найти ученика..."
          placeholderTextColor="#B1B1B1"
        />
      </View>
      <Card
        key={1}
        LeftTop="Екатерина Соколова"
        RightTop="Логопед"
        RightBot="ТНР"
        LeftBot="Младшая"
      />
      <Card
        key={2}
        LeftTop="Данил Морозов"
        RightTop="Дефектолог"
        RightBot="НОДА"
        LeftBot="Подготовительная"
      />
    </View>
  </View>
);

const PageStudent = () => (
  <View pointerEvents="none" style={localStyle.wrapList}>
    <View style={localStyle.pageStudentTitle}>
      <Text style={localStyle.pageStudentTitleText}>
        Характеристика интеллектуальной деятельности
      </Text>
    </View>
    <View style={Styles.seqLineHeader}></View>
    <View style={{paddingHorizontal: 14, gap: 10, paddingVertical: 11}}>
      <DropLabel label={'Развитие элементарных математических представлений'} />
      <DropLabel label={'Память'} select />

      <DropLabel label={'Количество и счет'} simpleShow />

      <DropLabel label={'Ориентировка в пространстве'} select simpleShow />
      <View style={{marginHorizontal: 10, gap: 11}}>
        <Checkbox only label={'Не ориентируется в пространстве'} />

        <Checkbox select label={'Определяет левую и правую сторону на себе'} />

        <Checkbox label={'Может определить левую и правую сторону объекта'} />

        <Checkbox label={'Ориентируется на листе'} />
      </View>

      <DropLabel label={'Операции сравнения'} simpleShow />
    </View>
  </View>
);

const PageGroup = () => (
  <View pointerEvents="none" style={localStyle.wrapList}>
    <View style={[localStyle.listHeader, {paddingVertical: 6.5}]}>
      <Text style={localStyle.listHeaderText}>Создание группы</Text>
      <Text style={localStyle.listHeaderTextAdded}>Логопед</Text>
    </View>
    <View style={Styles.seqLineHeader}></View>
    <View style={{backgroundColor: '#fff'}}>
      <View
        style={{
          flexDirection: 'row',
          minWidth: '100%',
        }}>
        <View style={localStyle.navPageTab}>
          <Text style={localStyle.navPageTabText}>Общие сведения</Text>
        </View>

        <View style={[localStyle.navPageTab, {backgroundColor: '#554AF0'}]}>
          <Text style={[localStyle.navPageTabText, {color: '#fff'}]}>
            Состав
          </Text>
        </View>
      </View>
    </View>
    <View style={{gap: 15.7, paddingHorizontal: 16, marginVertical: 12}}>
      <View style={localStyle.cardBlock}>
        <Text style={localStyle.cardBlockTitle}>Выбранные ученики</Text>
        <View style={[Styles.selectedList, {gap: 11}]}>
          <GroupStudent label={'Екатерина Соколова'} />
          <GroupStudent label={'Алексей Скворцов'} />
        </View>
      </View>
      <View style={localStyle.cardBlock}>
        <Text style={localStyle.cardBlockTitle}>Общий список учеников</Text>
        <View style={[Styles.selectedList, {gap: 11}]}>
          <GroupStudent label={'Дарья Широкова'} pluss />
          <GroupStudent label={'Алексей Крылов'} pluss />
          <GroupStudent label={'Илья Шувалов'} pluss />
        </View>
      </View>
    </View>
  </View>
);

const Timetable = () => (
  <View pointerEvents="none" style={localStyle.wrapList}>
    <View style={localStyle.listHeader}>
      <Text style={localStyle.listHeaderText}>Расписание</Text>
    </View>
    <View style={localStyle.listContent}>
      <Card
        key={1}
        LeftTop="08:00"
        RightTop="Группа 1"
        RightBot="ТНР"
        LeftBot="Младшая"
        time
      />
      <Card
        key={2}
        LeftTop="08:30"
        RightTop="Данил Морозов"
        RightBot="НОДА"
        LeftBot="Подготовительная"
        time
      />
    </View>
  </View>
);

const Tempaltes = () => (
  <View
    pointerEvents="none"
    style={[
      localStyle.wrapList,
      {gap: 20, paddingVertical: 17, paddingHorizontal: 18},
    ]}>
    <View style={localStyle.cardBlock}>
      <Text style={localStyle.cardBlockTitle}>Выбранные шаблоны</Text>
      <View style={[Styles.selectedList, {gap: 11}]}>
        <GroupStudent label={'Логопед'} />
      </View>
    </View>
    <View style={localStyle.cardBlock}>
      <Text style={localStyle.cardBlockTitle}>Доступные шаблоны</Text>
      <View style={[Styles.selectedList, {gap: 11}]}>
        <GroupStudent label={'Дефектолог'} pluss />
      </View>
    </View>
  </View>
);

const Loads = () => (
  <View
    pointerEvents="none"
    style={[
      localStyle.wrapList,
      {gap: 10, paddingVertical: 17, paddingHorizontal: 18},
    ]}>
    <Text style={{fontSize: 12.8, fontWeight: 400, color: '#1F1F1F'}}>
      Действия с данными приложения
    </Text>

    <View style={localStyle.buttonDefault}>
      <Icons.AntDesign name="upload" size={15} color="#554AF0" />
      <Text style={localStyle.buttonDefaultText}>Выгрузить данные</Text>
    </View>
    {/* импорт */}
    <View style={localStyle.buttonDefault}>
      <Icons.AntDesign name="download" size={15} color="#554AF0" />
      <Text style={localStyle.buttonDefaultText}>Загрузить данные</Text>
    </View>
    {/* очистка */}
    <View style={localStyle.buttonDefault}>
      <Icons.AntDesign name="delete" size={15} color="#DC5F5A" />
      <Text style={{...localStyle.buttonDefaultText, color: '#DC5F5A'}}>
        Очистить данные
      </Text>
    </View>
  </View>
);

export default [
  {
    id: 1,
    title: 'Помощник дефектолога',
    text: 'Интуитивно понятный интерфейс поможет вести учет персональной информации о всех ваших учениках',
    component: ListStudents,
  },
  {
    id: 2,
    title: 'Добавляйте учеников',
    text: 'Готовый шаблон экспресс-диагностики развития позволит в моменте отмечать особенности Вашего ученика',
    component: PageStudent,
  },
  {
    id: 3,
    title: 'Создавайте группы',
    text: 'Вы можете группировать учеников и менять динамический состав самой группы и каждого ученика по отдельности',
    component: PageGroup,
  },
  {
    id: 4,
    title: 'Составляйте расписание',
    text: 'Удобное визуальное расписание занятий в виде календарного или еженедельного планирования всегда будет под рукой',
    component: Timetable,
  },
  {
    id: 5,
    title: 'Выбор шаблона',
    text: 'Вы можете выбрать удобный шаблон, соответствующий Вашей профессии',
    component: Tempaltes,
  },
  {
    id: 6,
    title: 'Хранение данных',
    text: 'Все данные хранятся только на Вашем устройстве. При удалении приложения все данные будут утеряны\nНо Вы можете их выгрузить 😊',
    component: Loads,
  },
];

const localStyle = StyleSheet.create({
  cardRowTitle: {
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    color: '#04021D',
  },
  cardRowText: {
    fontSize: 10,
    fontWeight: 400,
    fontStyle: 'normal',
    color: '#04021D',
  },
  wrapList: {
    zIndex: 2,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#1d1d1d',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    backgroundColor: '#fff',
    elevation: 10,
    marginVertical: 10,
  },
  listHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 16,
  },
  listHeaderText: {
    fontSize: 13.8,
    fontWeight: 600,
    color: '#1F1F1F',
  },
  listHeaderTextAdded: {
    fontSize: 9.7,
    fontWeight: 400,
    color: '#B1B1B1',
  },
  listContent: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownListWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EEEDFE',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dropdownListWrap__nasted: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  dropdownListText: {
    fontWeight: 500,
    fontSize: 11.5,
    lineHeight: 11.5,
    color: '#554AF0',
    marginRight: 20,
    flex: 1,
  },
  dropdownListText__nested: {
    fontWeight: 400,
    fontSize: 10,
    lineHeight: 10,
    color: '#04021D',
    marginRight: 20,
    flex: 1,
  },
  pageStudentTitle: {
    paddingVertical: 11,
    paddingHorizontal: 35,
    alignContent: 'center',
  },
  pageStudentTitleText: {
    fontWeight: 400,
    fontSize: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
    gap: 8,
  },
  checkboxIcon: {
    display: 'flex',
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#554AF0',
    borderRadius: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxIcon__active: {
    borderWidth: 0,
    backgroundColor: '#554AF0',
  },
  checkboxText: {
    fontSize: 10,
    fontWeight: 400,
    lineHeight: 10,
    color: '#04021D',
    flexShrink: 1,
  },
  checkboxTextSub: {
    fontSize: 7,
    lineHeight: 7,
    fontWeight: 400,
    color: '#B1B1B1',
  },
  navPageTab: {
    flex: 1,
    padding: 13,
    backgroundColor: 'transparent',
    height: 'auto',
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
  },
  navPageTabText: {
    color: '#B1B1B1',
    fontSize: 11,
    lineHeight: 11,
    fontWeight: 500,
    fontFamily: 'sf_regular',
    textAlign: 'center',
  },
  cardBlock: {
    gap: 12,
  },
  cardBlockTitle: {
    fontWeight: 500,
    fontSize: 12.5,
    lineHeight: 12.5,
    color: '#04021D',
  },

  selectedListRowText: {
    fontWeight: 400,
    fontSize: 11,
    lineHeight: 11,
    color: '#04021D',
  },

  selectedListRowBtn: {
    borderRadius: 8,
    width: 30,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDefaultText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 12.8,
    lineHeight: 12.8,
    color: '#554AF0',
  },

  buttonDefault: {
    paddingHorizontal: 24,
    paddingVertical: 14.7,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: '#EBEBEB',
    borderWidth: 1,
    alignItems: 'center',
    gap: 15,
  },
});
