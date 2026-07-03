import {StyleSheet} from 'react-native';
import {COLORS, FONTS, RADIUS} from './theme';

export default StyleSheet.create({
  buttonDefault: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    borderColor: COLORS.gray,
    borderWidth: 1,
    alignItems: 'center',
    gap: 15,
  },

  buttonDefaultText: {
    fontFamily: FONTS.regular,
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.blue,
  },

  submitBtn: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },

  submitBtnText: {
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.white,
  },

  buttonRed: {
    backgroundColor: COLORS.redBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    width: '100%',
  },

  buttonRedText: {
    color: COLORS.red,
    fontWeight: 600,
    fontSize: 15,
    lineHeight: 18,
  },

  filterButtons: {
    marginBottom: 21,
    gap: 15,
  },

  opacityButton: {
    backgroundColor: 'rgba(85, 74, 240, 0.1);',
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },

  opacityButtonText: {
    color: COLORS.blue,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 600,
  },

  float_btAdd_wrap: {
    position: 'absolute',
    bottom: 98,
    right: 20,
  },

  float_btAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    padding: 13,
    shadowColor: COLORS.shadowDark,
    elevation: 20,
  },

  float_btnRow: {
    gap: 40,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.pill,
    shadowColor: COLORS.shadowDarker,
    elevation: 20,
    shadowOffset: {height: 20, width: 20},
    position: 'absolute',
    bottom: 26,
    right: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },

  float_btEdit: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    padding: 16,
    shadowColor: COLORS.shadowDark,
    elevation: 20,
  },
});
