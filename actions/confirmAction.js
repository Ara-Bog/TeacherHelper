import {Alert} from 'react-native';

export const undoConfirm = action => {
  Alert.alert(
    'Подтвердите действие',
    `Вы действительно хотите вернуться к просмотру не сохранив изменения ?`,
    [
      {
        text: 'Да',
        onPress: () => action(),
        style: 'destructive',
      },
      {text: 'Отмена', style: 'cancel'},
    ],
  );
};

export const saveConfirm = action => {
  Alert.alert('Подтвердите действие', `Сохранить внесенные изменения ?`, [
    {
      text: 'Да',
      onPress: () => action(),
      style: 'destructive',
    },
    {text: 'Отмена', style: 'cancel'},
  ]);
};

export const removeConfirm = action => {
  Alert.alert(
    'Подтвердите действие',
    `Вы действительно хотите удалить эту карточку ?`,
    [
      {
        text: 'Да',
        onPress: () => action(),
        style: 'destructive',
      },
      {text: 'Отмена', style: 'cancel'},
    ],
  );
};
