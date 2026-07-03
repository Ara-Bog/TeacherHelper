import {StyleSheet} from 'react-native';
import {COLORS, FONTS, RADIUS} from './theme';

export default StyleSheet.create({
  inputDefaultWrap: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
  },

  inputDefault: {
    color: COLORS.darkBlue,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 24,
    height: '100%',
    padding: 0,
    margin: 0,
    width: '100%',
  },

  inputDefault_disabled: {
    width: '48%',
    marginLeft: '2%',
    opacity: 1,
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: COLORS.darkBlue,
  },

  dropDown: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    paddingVertical: 7.5,
    paddingHorizontal: 25,
    borderRadius: RADIUS.md,
    borderColor: COLORS.gray,
  },

  dropDownText: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.darkBlue,
  },

  dropDownBox: {
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 8.5,
    borderWidth: 0,
  },

  dropDownBoxRow: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 1.5,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
  },

  dropDownBoxRowText: {
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.darkBlue,
  },

  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
    gap: 12,
  },

  checkboxIcon: {
    display: 'flex',
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxIcon__active: {
    borderWidth: 0,
    backgroundColor: COLORS.blue,
  },

  checkboxText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 21,
    color: COLORS.darkBlue,
    flexShrink: 1,
  },

  checkboxTextSub: {
    fontFamily: FONTS.regular,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: 400,
    color: COLORS.lightGray,
  },

  radioCircle_outer: {
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: 22,
    width: 22,
    height: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioCircle_outer__active: {
    borderColor: COLORS.blue,
  },

  radioCircle_inner: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    width: 10,
    height: 10,
  },

  radioCircle_inner__active: {
    backgroundColor: COLORS.blue,
  },

  radioText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 400,
    color: COLORS.darkBlue,
  },

  divNoteInput: {
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 20,
    fontWeight: '400',
    padding: 0,
    margin: 0,
    color: COLORS.darkBlue,
  },

  divNoteText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.darkBlue,
  },

  divNoteWrap_edit: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 25,
    paddingVertical: 16,
    color: COLORS.darkBlue,
  },

  textCheckerWrap: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
    backgroundColor: COLORS.whiteGray,
  },

  textCheckerWrap__active: {
    backgroundColor: COLORS.blue,
  },

  textCheckerText: {
    textAlign: 'center',
    fontFamily: FONTS.regular,
    fontWeight: '400',
    fontSize: 14,
    color: COLORS.darkBlue,
    lineHeight: 24,
  },

  textCheckerText__active: {
    color: COLORS.white,
  },

  phoneStyle: {
    fontSize: 18,
    lineHeight: 24,
    color: COLORS.blue,
  },

  formDataTime: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    width: '100%',
  },

  formDataTimeText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.darkBlue,
  },

  pickerDefault: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    height: 50,
  },

  viewLinksWrap: {
    columnGap: 5,
    rowGap: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  viewLinksItem: {
    borderRadius: 15,
    backgroundColor: COLORS.blueBg,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },

  viewLinksItemText: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: 400,
    color: COLORS.blue,
    fontFamily: FONTS.medium,
  },

  droplistIsolatedItem: {
    gap: 5,
    padding: 10,
    backgroundColor: '#554AF01A',
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
  },

  droplistIsolatedItemText: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.blue,
  },

  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: RADIUS.md,
  },

  rowSwitchText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.darkBlue,
    fontWeight: 400,
    lineHeight: 21,
  },
});
