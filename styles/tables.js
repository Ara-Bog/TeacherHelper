import {StyleSheet} from 'react-native';
import {COLORS, RADIUS} from './theme';

export default StyleSheet.create({
  tableWrap: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },

  table_header: {
    gap: 10,
    flexDirection: 'row',
    marginVertical: 5,
  },

  table_headerText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.darkBlue,
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 14,
  },

  table_row: {
    gap: 10,
    flexDirection: 'row',
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
    paddingVertical: 5,
  },

  table_rowText: {
    alignSelf: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: COLORS.whiteGray,
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.darkBlue,
    fontWeight: 400,
    borderRadius: 5,
  },

  table_empty: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.darkBlue,
  },

  table_modalWrap: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    padding: 25,
    gap: 20,
  },

  table_modalTitle: {
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.darkBlue,
    alignSelf: 'center',
    fontWeight: 500,
  },

  table_modal_item: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },

  table_modal_itemText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: 400,
    color: COLORS.darkBlue,
  },
});
