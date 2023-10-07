import React, {Component} from 'react';
import {View, ScrollView, Alert, Text} from 'react-native';
import ButtonAdd from './elements/buttonAdd';
import EmptyData from './elements/emptyDataList';
import DefaultCard from './elements/defaultCard';
import MenuActions from './menuActions';
import SelectorTemplates from './selecterTemplate';
import Modal from 'react-native-modal';

function groupData(data, groupField, addedLabels) {
  let groupDataList = Object.entries(
    data.reduce((result, item) => {
      (result[item[groupField]] = result[item[groupField]] || []).push(item);

      return result;
    }, {}),
  );

  if (addedLabels && groupDataList.length > 1) {
    groupDataList = groupDataList.map(item => {
      let el = addedLabels.find(labels => labels.id === item[0]);
      return [el.defaultName, item[1], el.orderBy];
    });
    groupDataList.sort((a, b) => a[2] - b[2]);
  }

  return groupDataList;
}

export default class ListCards extends Component {
  // общий модуль списка для списка групп и учеников
  // props:
  // - data: array(object) -- текущие данные для списка
  // - typeData: String (Student || Group || Timetable) -- активная страница
  // - navigation: object -- props.navigation для навигации на страницы карточек
  // - bigSizeCards: bool -- большой размер карточек
  constructor(props) {
    super(props);
    this.state = {
      // датасет
      dataList: [...this.props.data],
      // список выбранных карточек
      selected: [],
      // тип страницы
      typeData: this.props.typeData,
      // состояние выбора карточек
      onHold: false,
      // id карточки, которую зажали
      holdIdCard: 0,
      // id_template карточки которую зажали
      holdCardTemplate: {},
      // открытие модалки выбора шаблона
      selectTemplateShow: false,
    };

    let groupField = this.props.isGroup
      ? this.props.isGroup
      : userSettings['groupBy_' + this.state.typeData];

    this.state.dataList = groupData(
      this.state.dataList,
      groupField,
      this.props.groupLabels,
    );
  }

  componentDidMount() {
    // при смене экрана - сбрасываем все выделения
    this.props.navigation.addListener('blur', () => {
      this.setState({selected: [], onHold: false, holdIdCard: 0});
    });
  }

  // костыль. данные с базы не приходят после рендера элемента
  // нужно обновить state на новые props
  shouldComponentUpdate(nextProps, nextState) {
    let curPropsData = this.props.data;
    if (JSON.stringify(curPropsData) !== JSON.stringify(nextProps.data)) {
      nextState.dataList = nextProps.data;

      let groupField = nextProps.isGroup
        ? nextProps.isGroup
        : userSettings['groupBy_' + this.state.typeData];
      nextState.dataList = groupData(
        nextProps.data,
        groupField,
        nextProps.groupLabels,
      );
    }
    return true;
  }

  // выбор карточек
  selectCard(id = this.state.holdIdCard) {
    // новый список текущих выбранных
    let selectedArr = [...this.state.selected];

    // если выбранная карточка есть в списке - удаляем, нет - добавляем
    findId = selectedArr.indexOf(id);
    if (findId >= 0) {
      selectedArr.splice(findId, 1);
    } else {
      selectedArr.push(id);
    }

    // обновляем список в состоянии
    this.setState({selected: [...selectedArr]});

    // убираем выбранную карточку
    this.setState({holdIdCard: 0});
  }

  // удаление выделенных карточек
  deleteSelectCard() {
    // копируем текущий список
    const currentList = [...this.state.selected];
    // последний выбранный элемент
    const holdId = this.state.holdIdCard;

    // при удалении сразу, без выделения, карточка не падает в селект
    // нужно добавить
    if (holdId != 0 && !this.state.selected.includes(holdId)) {
      currentList.push(holdId);
    }

    this.deleteCard(currentList);
  }

  // запрос на удаление с подтверждением, с последующим вызовом callback
  deleteCard(currentList) {
    // контент Alert
    let message;

    // определение контента для Alert
    if (currentList.length == 1) {
      // для единственного элемента
      // ищем по id его в списке данных
      let currentItem = this.props.data.find(obj => obj.ID === currentList[0]);

      message = `Вы действительно хотите удалить карточку ${currentItem.LeftTop} ?\nЭто также удалит связанные с ней записи в расписании.`;
    } else {
      // если элементов > 1, то в контенте выведется только количество удалений
      message = `Вы действительно хотите удалить карточки в количестве ${currentList.length} штук?\nЭто также удалит связанные с ними записи в расписании.`;
    }

    // подтверждаем удаление от пользователя
    let confirmDelete = new Promise((resolve, reject) => {
      Alert.alert('Подтвердите действие', message, [
        {
          text: 'Да',
          onPress: () => resolve(),
          style: 'destructive',
        },
        {text: 'Отмена', onPress: () => reject(), style: 'cancel'},
      ]);
    });

    // при подтверждении
    confirmDelete
      .then(() => {
        // колбэкаем в родителя удаление
        this.props.onCallDeleteData(currentList);
        // обнуляем выделение, в т.ч. зажатый элемент
        this.setState({selected: [], holdIdCard: 0});
      })
      .catch(() => {
        // отмена удаления
        return;
      });
  }

  // создание новой карточки
  // вызов выбора шаблона
  createNew() {
    if (userSettings.templates.length == 1) {
      this.props.navigation.navigate(this.state.typeData, {
        type: 'add',
        id: undefined,
        template: {
          id: userSettings.templates[0].id,
          name: userSettings.templates[0].name,
        },
      });
    } else {
      this.setState({selectTemplateShow: true});
    }
  }

  render() {
    let content;
    let labelsFlag = this.state.dataList.length > 1 ? true : false;
    const Card = item => (
      <DefaultCard
        key={item.ID}
        data={item}
        bigSize={this.props.bigSizeCards}
        select={this.state.selected.includes(item.ID)}
        isTimetable={this.state.typeData === 'Timetable'}
        onCallPress={() => {
          this.state.selected.length != 0
            ? this.selectCard(item.ID)
            : this.props.navigation.navigate(this.state.typeData, {
                type: 'view',
                id: item.ID,
                template: {id: item.id_template, name: item.template},
              });
        }}
        onCallLong={() => {
          this.state.selected.length != 0
            ? this.state.selected.includes(item.ID)
              ? this.setState({onHold: true})
              : this.selectCard(item.ID)
            : this.setState({
                onHold: true,
                holdIdCard: item.ID,
                holdCardTemplate: {
                  id: item.id_tempalate,
                  name: item.tempalate,
                },
              });
        }}
      />
    );
    // когда нет контента - выводим пустоту
    if (this.state.dataList.length != 0) {
      content = (
        <ScrollView contentContainerStyle={{gap: this.state.isGroup ? 40 : 15}}>
          {this.state.dataList.map((item, itemInd) => {
            if (labelsFlag) {
              return (
                <View style={{gap: 20}} key={itemInd}>
                  <Text
                    style={{fontSize: 16, fontWeight: 500, color: '#04021D'}}>
                    {`${item[0]} (${item[1].length})`}
                  </Text>
                  {item[1].map(subItem => Card(subItem))}
                </View>
              );
            } else {
              {
                return item[1].map(subItem => Card(subItem));
              }
            }
          })}
          {/* Пустое пространство */}
          <View style={Styles.crutch}></View>
        </ScrollView>
      );
    } else {
      content = <EmptyData typeField={this.state.typeData} />;
    }
    return (
      <>
        {content}
        <MenuActions
          visible={this.state.onHold}
          callClose={() => this.setState({onHold: false})}
          callSelect={() => this.selectCard()}
          callCopy={() =>
            this.props.navigation.navigate(this.state.typeData, {
              type: 'copy',
              id: this.state.holdIdCard,
              template: this.state.holdCardTemplate,
            })
          }
          callDelete={() => this.deleteSelectCard()}
          callDeleteAll={() =>
            this.deleteCard(this.props.data.map(item => item.ID))
          } // удаление всех видимых карточек
          callResetSelected={() => this.setState({selected: []})}
          isSelected={this.state.selected.length != 0}
        />
        {this.state.selected.length !== 0 ? null : (
          <ButtonAdd
            onPress={() => this.createNew()}
            navigation={this.props.navigation}
            type={this.state.typeData}
          />
        )}
        <Modal
          style={{marginBottom: 0, marginLeft: 0, marginRight: 0}}
          isVisible={this.state.selectTemplateShow}
          onBackButtonPress={() => this.setState({selectTemplateShow: false})}
          onBackdropPress={() => this.setState({selectTemplateShow: false})}>
          <View style={Styles.modalDownWrap}>
            <SelectorTemplates
              goSettings={() => {
                this.setState({selectTemplateShow: false});
                this.props.navigation.navigate('settings');
              }}
              selectTemp={(id, name) => {
                this.setState({selectTemplateShow: false});
                this.props.navigation.navigate(this.state.typeData, {
                  type: 'add',
                  id: undefined,
                  template: {id: id, name: name},
                });
              }}
            />
          </View>
        </Modal>
      </>
    );
  }
}
