import {StyleSheet} from 'react-native';
import {COLORS, FONTS, RADIUS} from './theme';

export default StyleSheet.create({
  selectedList: {
    flexGrow: 1,
  },

  selectedListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedListRowText: {
    fontFamily: FONTS.light,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.darkBlue,
  },

  selectedListRowBtn: {
    borderRadius: RADIUS.md,
    width: 38,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 5,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },

  dropdownList: {
    gap: 15,
    overflow: 'hidden',
    paddingHorizontal: 14,
    marginTop: 25,
  },

  dropdownList__showMod: {
    gap: 12,
    display: 'flex',
    overflow: 'hidden',
    paddingHorizontal: 7,
    marginTop: 12,
  },

  dropdownListWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.blueLight,
    borderRadius: 8,
  },

  dropdownListWrap__nasted: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  dropdownListText: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.blue,
    marginRight: 20,
    flex: 1,
  },

  dropdownListText__nested: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.darkBlue,
    marginRight: 20,
    flex: 1,
  },

  dropdownListText__show: {
    color: COLORS.darkBlue,
    fontSize: 16,
    lineHeight: 19,
  },
});
