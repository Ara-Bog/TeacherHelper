import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {View, ScrollView, Alert, Text} from 'react-native';
import ButtonAdd from './elements/buttonAdd';
import EmptyData from './elements/emptyDataList';
import DefaultCard from './elements/defaultCard';
import MenuActions from './menuActions';
import SelectorTemplates from './selecterTemplate';
import Modal from './elements/AppModal';

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

export default function ListCards({
  data,
  typeData,
  navigation,
  bigSizeCards,
  onCallDeleteData,
  groupLabels,
  isGroup,
}) {
  const [selected, setSelected] = useState([]);
  const [onHold, setOnHold] = useState(false);
  const [holdIdCard, setHoldIdCard] = useState(0);
  const [holdCardTemplate, setHoldCardTemplate] = useState({});
  const [selectTemplateShow, setSelectTemplateShow] = useState(false);

  const groupField = isGroup || userSettings['groupBy_' + typeData];

  const dataList = useMemo(
    () => groupData(data, groupField, groupLabels),
    [data, groupField, groupLabels],
  );

  useEffect(() => {
    const unsub = navigation.addListener('blur', () => {
      setSelected([]);
      setOnHold(false);
      setHoldIdCard(0);
    });
    return unsub;
  }, [navigation]);

  const selectCard = useCallback((id) => {
    const cardId = id || holdIdCard;
    setSelected(prev => {
      let arr = [...prev];
      let findId = arr.indexOf(cardId);
      if (findId >= 0) {
        arr.splice(findId, 1);
      } else {
        arr.push(cardId);
      }
      return arr;
    });
    setHoldIdCard(0);
  }, [holdIdCard]);

  const deleteSelectCard = () => {
    const currentList = [...selected];
    if (holdIdCard != 0 && !selected.includes(holdIdCard)) {
      currentList.push(holdIdCard);
    }
    deleteCard(currentList);
  };

  const deleteCard = currentList => {
    let message;
    if (currentList.length == 1) {
      let currentItem = data.find(obj => obj.ID === currentList[0]);
      message = `Вы действительно хотите удалить карточку ${currentItem.LeftTop} ?\nЭто также удалит связанные с ней записи в расписании.`;
    } else {
      message = `Вы действительно хотите удалить карточки в количестве ${currentList.length} штук?\nЭто также удалит связанные с ними записи в расписании.`;
    }

    Alert.alert('Подтвердите действие', message, [
      {
        text: 'Да',
        onPress: () => {
          onCallDeleteData(currentList);
          setSelected([]);
          setHoldIdCard(0);
        },
        style: 'destructive',
      },
      {text: 'Отмена', style: 'cancel'},
    ]);
  };

  const createNew = () => {
    if (userSettings.templates.length == 1) {
      navigation.navigate(typeData, {
        type: 'add',
        id: undefined,
        template: {
          id: userSettings.templates[0].id,
          name: userSettings.templates[0].name,
        },
      });
    } else {
      setSelectTemplateShow(true);
    }
  };

  const Card = item => (
    <DefaultCard
      key={item.ID}
      data={item}
      bigSize={bigSizeCards}
      select={selected.includes(item.ID)}
      isTimetable={typeData === 'Timetable'}
      onCallPress={() => {
        selected.length != 0
          ? selectCard(item.ID)
          : navigation.navigate(typeData, {
              type: 'view',
              id: item.ID,
              template: {id: item.id_template, name: item.template},
            });
      }}
      onCallLong={() => {
        selected.length != 0
          ? selected.includes(item.ID)
            ? setOnHold(true)
            : selectCard(item.ID)
          : (() => {
              setOnHold(true);
              setHoldIdCard(item.ID);
              setHoldCardTemplate({
                id: item.id_tempalate,
                name: item.tempalate,
              });
            })();
      }}
    />
  );

  let content;
  let labelsFlag = dataList.length > 1;

  if (dataList.length != 0) {
    content = (
      <ScrollView contentContainerStyle={{gap: isGroup ? 40 : 15}}>
        {dataList.map((item, itemInd) => {
          if (labelsFlag) {
            return (
              <View style={{gap: 20}} key={itemInd}>
                <Text style={{fontSize: 16, fontWeight: 500, color: '#04021D'}}>
                  {`${item[0]} (${item[1].length})`}
                </Text>
                {item[1].map(subItem => Card(subItem))}
              </View>
            );
          } else {
            return item[1].map(subItem => Card(subItem));
          }
        })}
        <View style={Styles.crutch}></View>
      </ScrollView>
    );
  } else {
    content = <EmptyData typeField={typeData} />;
  }

  return (
    <>
      {content}
      <MenuActions
        visible={onHold}
        callClose={() => setOnHold(false)}
        callSelect={() => selectCard()}
        callCopy={() =>
          navigation.navigate(typeData, {
            type: 'copy',
            id: holdIdCard,
            template: holdCardTemplate,
          })
        }
        callDelete={() => deleteSelectCard()}
        callDeleteAll={() => deleteCard(data.map(item => item.ID))}
        callResetSelected={() => setSelected([])}
        isSelected={selected.length != 0}
      />
      {selected.length !== 0 ? null : (
        <ButtonAdd
          onPress={() => createNew()}
          navigation={navigation}
          type={typeData}
        />
      )}
      <Modal
        style={{marginBottom: 0, marginLeft: 0, marginRight: 0}}
        isVisible={selectTemplateShow}
        onBackButtonPress={() => setSelectTemplateShow(false)}
        onBackdropPress={() => setSelectTemplateShow(false)}>
        <View style={Styles.modalDownWrap}>
          <SelectorTemplates
            goSettings={() => {
              setSelectTemplateShow(false);
              navigation.navigate('settings');
            }}
            selectTemp={(id, name) => {
              setSelectTemplateShow(false);
              navigation.navigate(typeData, {
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
