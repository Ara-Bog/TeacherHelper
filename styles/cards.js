import {StyleSheet} from 'react-native';
import {COLORS, FONTS, RADIUS} from './theme';

export default StyleSheet.create({
  // Fixed typo: cardDelault -> cardDefault
  cardDefault: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 25,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.gray,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    gap: 15,
  },

  cardDefault__active: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 25,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(85, 74, 240, 0.1)',
    borderColor: COLORS.blue,
    borderWidth: 1,
    gap: 15,
  },

  cardDefaultRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },

  cardDefaultRowTime: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardDefaultRowTimeText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.darkBlue,
  },

  cardDefaultRowTitle: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: 500,
    fontFamily: FONTS.regular,
    fontStyle: 'normal',
    color: COLORS.darkBlue,
  },

  cardDefaultRowText: {
    fontSize: 12,
    lineHeight: 12,
    fontWeight: 400,
    fontFamily: FONTS.regular,
    fontStyle: 'normal',
    color: COLORS.darkBlue,
  },

  cardDefaultRowLine: {
    height: 1,
    backgroundColor: COLORS.gray,
    borderRadius: 42,
  },

  cardDefaultGoTo: {
    backgroundColor: '#554AF01A',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  cardDefaultGoToText: {
    fontSize: 13,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: COLORS.blue,
  },

  cardStudentBtn_delete: {
    backgroundColor: COLORS.redBgLight,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  cardDefaultRemove: {
    backgroundColor: COLORS.redBgLight,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },

  cardDefaultRemoveText: {
    fontSize: 13,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: COLORS.red,
  },

  cardDefaultBtns: {
    marginTop: 20,
    flexDirection: 'row',
    width: '100%',
  },

  cardDefaultEdit: {
    backgroundColor: '#554AF01A',
    borderRadius: RADIUS.md,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },

  cardDefaultEditText: {
    fontSize: 13,
    fontFamily: FONTS.semibold,
    fontWeight: '600',
    color: COLORS.blue,
  },

  cardBlock: {
    gap: 15,
  },

  cardBlockTitle: {
    fontFamily: FONTS.medium,
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.darkBlue,
  },

  cardSmallLine: {
    height: 3,
    backgroundColor: COLORS.gray,
    borderRadius: 42,
    marginTop: 5,
    marginBottom: 30,
  },

  cardStudentValue: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    fontWeight: '400',
    color: COLORS.darkBlue,
    width: '48%',
    marginLeft: '2%',
  },

  cardStudentBox: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  cardStudentSubTitle: {
    fontFamily: FONTS.medium,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    color: COLORS.darkBlue,
    marginBottom: 5,
    width: '48%',
    marginRight: '2%',
  },

  cardStudentElement_radio: {
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: COLORS.whiteGray,
    fontFamily: FONTS.medium,
    fontWeight: '500',
    fontSize: 12,
    color: COLORS.darkBlue,
    paddingVertical: 3,
    lineHeight: 14,
    marginRight: 'auto',
  },

  contactItem: {
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: RADIUS.md,
  },

  contactItem_edit: {
    borderTopWidth: 2,
    borderColor: COLORS.gray,
    paddingTop: 15,
  },

  contactButton: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },

  // Skeleton cards for settings
  skeletonCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 25,
    shadowColor: 'transparent',
  },

  skeletonCard__active: {
    backgroundColor: COLORS.blueLight,
    borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 25,
    shadowColor: 'transparent',
  },

  skeletonCardContent: {
    backgroundColor: COLORS.gray,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 15,
    paddingVertical: 19,
  },

  skeletonCardContentActive: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 15,
    paddingVertical: 19,
  },

  skeletonCardRow: {
    gap: 15,
    flexDirection: 'row',
    flex: 1,
  },

  skeletonCardEl: {
    backgroundColor: COLORS.skeletonEl,
    borderRadius: 36,
    height: 11,
  },
});
