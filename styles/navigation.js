import {StyleSheet} from 'react-native';
import {COLORS, FONTS, RADIUS} from './theme';

export default StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    position: 'absolute',
    borderTopWidth: 0,
    shadowColor: COLORS.shadow,
    elevation: 10,
    height: 78,
    paddingBottom: 22,
    paddingTop: 13,
  },

  tabBarLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },

  screenOptionsNav: {
    headerTitleAlign: 'center',
    headerTintColor: COLORS.blue,
    headerTitleStyle: {
      color: '#000',
      fontFamily: FONTS.semibold,
      fontSize: 18,
      fontWeight: '600',
    },
    headerShadowVisible: false,
  },

  navPageWrap: {
    height: 'auto',
    width: '100%',
  },

  navPageTab: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
    height: 'auto',
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },

  navPageTabText: {
    color: COLORS.lightGray,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 500,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },

  subtabPage_title: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 17,
  },

  subtabPage_footerLabel: {
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.darkBlue,
    fontWeight: 500,
  },

  subtabPage_footerItems: {
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.lightGray,
    fontWeight: 400,
  },
});
