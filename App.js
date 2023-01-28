import React, {useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import SQLite from 'react-native-sqlite-storage';

// страницы для навигации
import Timetable from './pages/timetable';
import TimetableForm from './pages/timetableForm';
import StudentPage from './pages/studentPage';
import ListStudents from './pages/listStudents';
import GroupPage from './pages/groupPage';
import ListGroups from './pages/listGroups';
import LoadingAnimation from './pages/LoadingAnimation';
import SettingsPage from './pages/settings';
import {Button} from 'react-native-paper';

// глобальные ссылки
import './global.js';
// база
// db
// стили
// Styles.*nameStyle*
// иконки
// <Icons.*namePackage* ... />

// пользовательские настройки
// userSettings.*setting*
// список настроек
// opened - для показа обучения
// firstScreen - первый экран при загрузке
// templates - используемые шаблоны
// typeSchedule - тип расписания
// showCategories - раскрывать категории карточки
// showSubCategories - раскрывать подкатегории карточки
// bigCardStudents - большие карточки студентов
// bigCardGroup - большие карточки групп
// bigCardTimetable - большие карточки расписания
// sizeCardAll - размер карточек по умолчанию

// нижние вкладки
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// для тестирования
// onLayout={event => test_size(event, 'asd')}
global.test_size = function find_dimesions(event, el = 'def') {
  const {x, y, width, height} = event.nativeEvent.layout;
  console.warn(el);
  console.warn(width);
  console.warn(height);
};

export default function App() {
  // статус загрузки
  const [loading, setLoading] = useState(true);

  // запрос разрешения на взаимодействие с файлами
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    } catch (err) {
      console.warn(err);
    }
  };

  // на каких страницах скрывать меню
  const hideTabPage = ['Student', 'TimetableForm', 'Group', 'Filter'];

  // навигации для страницы ученики
  const ListStudentsNav = () => (
    <Stack.Navigator
      initialRouteName="ListStudents"
      screenOptions={Styles.screenOptionsNav}>
      <Stack.Screen
        name="ListStudents"
        component={ListStudents}
        options={{
          headerRight: () => (
            <Icons.Ionicons name="filter" color="#554AF0" size={25} />
          ),
          title: 'Список учеников',
        }}
      />
      <Stack.Screen name="Student" component={StudentPage} />
    </Stack.Navigator>
  );

  // навигации для страницы расписания
  const TimetableNav = () => (
    <Stack.Navigator
      initialRouteName="Timetable"
      screenOptions={Styles.screenOptionsNav}>
      <Stack.Screen
        name="Timetable"
        component={Timetable}
        options={{title: 'Расписание'}}
      />
      <Stack.Screen name="TimetableForm" component={TimetableForm} />
      <Stack.Screen name="Student" component={StudentPage} />
      <Stack.Screen name="Group" component={GroupPage} />
    </Stack.Navigator>
  );

  // навигации для страницы групп
  const ListGroupNav = () => (
    <Stack.Navigator
      initialRouteName="ListGroups"
      screenOptions={Styles.screenOptionsNav}>
      <Stack.Screen
        name="ListGroups"
        component={ListGroups}
        options={{title: 'Список групп'}}
      />
      <Stack.Screen name="Group" component={GroupPage} />
    </Stack.Navigator>
  );

  // навигации для страницы настройки
  const Settings = () => (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={Styles.screenOptionsNav}>
      <Stack.Screen
        name="Settings"
        component={SettingsPage}
        options={{title: 'Настройки'}}
      />
    </Stack.Navigator>
  );

  // запрос на разрешение редактирования данных
  PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  ).then(res => (res ? null : requestStoragePermission()));

  // вывод анимированной загрузки, пока не загрузится база и настроек пользователя
  if (loading) {
    SplashScreen.hide();
    //
    // ДОБАВИТЬ ВЫВОД ОБУЧАЮЩЕГО БЛОКА, ЕСЛИ userSettings.opened == false
    Promise.all([db, userSettings]).then(
      values => {
        db = values[0];
        userSettings = values[1];
        SQLite.enablePromise(false);
        setLoading(false);
      },
      err => console.log('main promise err - ', err),
    );
    return <LoadingAnimation />;
  } else {
    return (
      <NavigationContainer>
        <Tab.Navigator
          id="mainTab"
          initialRouteName={userSettings.firstScreen}
          screenOptions={({route}) => ({
            tabBarStyle: {
              ...Styles.tabBar,
              bottom: hideTabPage.includes(getFocusedRouteNameFromRoute(route)) // убирает в низ бар на страницах указанных в списке
                ? -100
                : 0,
            },
            tabBarLabelStyle: Styles.tabBarLabel,
            tabBarActiveTintColor: '#554AF0',
            tabBarInactiveTintColor: '#B1B1B1',
          })}>
          {/* <Tab.Screen
            name="timetable"
            component={TimetableNav}
            options={{
              title: 'Расписание',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icons.Feather name="calendar" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="groups"
            component={ListGroupNav}
            options={{
              title: 'Группы',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icons.Ionicons name="people-outline" size={27} color={color} />
              ),
            }}
          /> */}
          <Tab.Screen
            name="students"
            component={ListStudentsNav}
            options={{
              title: 'Ученики',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icons.MaterialIcons
                  name="child-care"
                  size={28}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="settings"
            component={Settings}
            options={{
              title: 'Настройки',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icons.AntDesign name="setting" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
