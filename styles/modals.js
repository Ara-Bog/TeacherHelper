import {StyleSheet} from 'react-native';
import {COLORS, FONTS, RADIUS} from './theme';

export default StyleSheet.create({
  ModalDownContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },

  modalDownWrap: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    height: 426,
    width: '100%',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },

  modalLoad: {
    width: 294,
    height: 194,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },

  modalLoad_text: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.darkBlue,
    marginTop: 25,
  },

  holdMenu: {
    flexDirection: 'column',
    paddingTop: 19,
    paddingBottom: 4,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    marginTop: 'auto',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },

  holdMenuButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
  },

  holdMenuButtonText: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    marginLeft: 15,
  },
});
