import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SPACING, RADIUS} from './theme';

export default StyleSheet.create({
  container: {
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: COLORS.background,
  },

  containerCard: {
    display: 'flex',
    flexDirection: 'column',
  },

  crutch: {
    padding: 75,
  },

  divDefault__edit: {
    gap: SPACING.sm,
  },

  divDefault: {
    flexDirection: 'row',
    gap: 34,
    width: '100%',
  },

  divDefaultLabel: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.grayText,
  },

  divMain: {
    gap: SPACING.md,
    width: '100%',
  },

  divMainTitle: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.darkBlue,
  },

  divMainValue: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.darkBlue,
  },

  divDefaultLabel__edit: {
    fontFamily: FONTS.regular,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.grayText,
  },

  divDefaultValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: FONTS.regular,
    fontWeight: 400,
    color: COLORS.darkBlue,
  },

  seqLineHeader: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.gray,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },

  emptyContainer_mainText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: FONTS.medium,
    marginBottom: SPACING.md,
    color: COLORS.darkBlue,
  },

  emptyContainer_addedText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: FONTS.regular,
    color: COLORS.lightGray,
    textAlign: 'center',
  },

  emptyValue: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: 400,
    color: COLORS.grayText,
    lineHeight: 17,
    flex: 1,
  },

  headerAddedTitleStyle: {
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: 400,
    fontFamily: FONTS.regular,
  },

  iconLoadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconLoadWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    paddingHorizontal: 19,
  },

  iconLoadImageBorder: {
    width: 115,
    height: 120,
  },

  iconLoadImagePerson: {
    marginRight: 6,
    width: 46,
    height: 56,
    marginTop: 5,
  },

  rowForm: {
    marginBottom: SPACING.md,
  },

  seacrhCross: {
    position: 'absolute',
    right: SPACING.lg,
    padding: SPACING.xs,
  },
});
