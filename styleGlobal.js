import {StyleSheet} from 'react-native';

const COLORS = {
  gray: '#EBEBEB',
  darkBlue: '#04021D',
  blue: '#554AF0',
  whiteGray: '#F2F1F1',
};

export default StyleSheet.create({
  tabBar: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    borderTopWidth: 0,
    shadowColor: 'rgba(4, 2, 29, 0.1)',
    elevation: 10,
    height: 78,
    paddingBottom: 22,
    paddingTop: 13,
  },

  tabBarLabel: {
    fontSize: 11,
    fontFamily: 'sf_medium',
  },

  screenOptionsNav: {
    headerTitleAlign: 'center',
    headerTintColor: '#554AF0',
    headerTitleStyle: {
      color: '#000',
      fontFamily: 'sf_semibold',
      fontSize: 18,
      fontWeight: '600',
    },
    headerShadowVisible: false,
  },

  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  containerCard: {
    display: 'flex',
    flexDirection: 'column',
  },

  cardDelault: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 25,
    borderRadius: 15,
    borderColor: COLORS.gray,
    borderWidth: 1,
    backgroundColor: '#fff',
    gap: 15,
  },

  cardDelault__active: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 25,
    borderRadius: 15,
    backgroundColor: 'rgba(85, 74, 240, 0.1)',
    borderColor: '#554AF0',
    borderWidth: 1,
    gap: 15,
  },

  cardDelaultRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  cardDelaultRowTime: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardDelaultRowTimeText: {
    fontSize: 16,
    fontFamily: 'sf_medium',
    color: COLORS.darkBlue,
  },

  cardDelaultRowTitle: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'sf_regular',
    color: COLORS.darkBlue,
  },

  cardDelaultRowText: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: 'sf_regular',
    fontStyle: 'normal',
    color: COLORS.darkBlue,
  },

  cardDelaultRowLine: {
    height: 1,
    backgroundColor: COLORS.gray,
    borderRadius: 42,
  },

  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 10,
  },

  rowSwitchText: {
    fontSize: 14,
    fontFamily: 'sf_medium',
    color: COLORS.darkBlue,
    fontWeight: 400,
  },

  float_btAdd_wrap: {
    position: 'absolute',
    bottom: 98,
    right: 20,
  },

  float_btAdd: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 13,
    shadowColor: 'rgba(4, 2, 29, 0.7)',
    elevation: 20,
  },

  float_btnRow: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 40,
    right: 20,
    alignItems: 'flex-end',
  },

  float_btEdit: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: 'rgba(4, 2, 29, 0.7)',
    elevation: 20,
  },

  float_btEdit_Check: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#A1DDAB',
    padding: 16,
    shadowColor: 'rgba(4, 2, 29, 0.7)',
    elevation: 20,
  },

  float_btEdit_Close: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#FBEFEF',
    padding: 16,
    marginBottom: 20,
    shadowColor: 'rgba(4, 2, 29, 0.7)',
    elevation: 20,
  },

  formDataTime: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    width: '100%',
  },

  formDataTimeText: {
    fontSize: 14,
    fontFamily: 'sf_regular',
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.darkBlue,
  },

  rowForm: {
    marginBottom: 15,
  },

  dropDown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 10,
    height: 50,
    borderColor: COLORS.gray,
  },

  dropDownText: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.darkBlue,
  },

  dropDownBox: {
    borderRadius: 10,
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
    borderRadius: 10,
  },

  dropDownBoxRowText: {
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.darkBlue,
  },

  cardDelaultGoTo: {
    backgroundColor: '#554AF01A',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  cardDelaultGoToText: {
    fontSize: 13,
    fontFamily: 'sf_semibold',
    fontWeight: '600',
    color: COLORS.blue,
  },

  cardStudentBtn_delete: {
    backgroundColor: '#fcefef',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  cardDelaultRemove: {
    backgroundColor: '#fcefef',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },

  cardDelaultRemoveText: {
    fontSize: 13,
    fontFamily: 'sf_semibold',
    fontWeight: '600',
    color: '#DC5F5A',
  },

  cardDelaultBtns: {
    marginTop: 20,
    flexDirection: 'row',
    width: '100%',
  },

  cardDelaultEdit: {
    backgroundColor: '#554AF01A',
    borderRadius: 10,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },

  cardDelaultEditText: {
    fontSize: 13,
    fontFamily: 'sf_semibold',
    fontWeight: '600',
    color: COLORS.blue,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },

  emptyContainer_mainText: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'sf_medium',
    marginBottom: 15,
    color: COLORS.darkBlue,
  },

  emptyContainer_addedText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'sf_regular',
    color: '#B1B1B1',
    textAlign: 'center',
  },

  pickerDefault: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },

  crutch: {
    padding: 75,
  },

  submitBtn: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitBtnText: {
    fontFamily: 'sf_semibold',
    fontWeight: '600',
    fontSize: 15,
    color: '#fff',
  },

  // cardDefaultRow_edit
  divDefault__edit: {
    gap: 10,
  },

  divDefault: {
    flexDirection: 'row',
    gap: 34,
    width: '100%',
  },

  divDefaultLabel: {
    flex: 1,
    fontFamily: 'sf_regular',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 17,
    color: '#848484',
  },

  divMain: {
    gap: 15,
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
    fontFamily: 'sf_regular',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 17,
    color: '#848484',
  },

  divDefaultValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 17,
    fontFamily: 'sf_regular',
    fontWeight: 400,
    color: COLORS.darkBlue,
  },

  inputDefaultWrap: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderColor: COLORS.gray,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
    height: 50,
    paddingHorizontal: 15,
  },

  // fontWeight: 400, - не поддерживается
  inputDefault: {
    color: COLORS.darkBlue,
    fontFamily: 'sf_regular',
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
    fontFamily: 'sf_regular',
    fontWeight: '400',
    color: COLORS.darkBlue,
  },

  cardStudentValue: {
    fontSize: 14,
    fontFamily: 'sf_regular',
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

  cardStudentElement: {
    marginTop: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: COLORS.whiteGray,
    textAlign: 'center',
    fontFamily: 'sf_regular',
    fontWeight: '400',
    fontSize: 14,
    color: COLORS.darkBlue,
    paddingVertical: 3,
    marginRight: 5,
    lineHeight: 24,
  },

  cardStudentElement_active: {
    marginTop: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: COLORS.blue,
    textAlign: 'center',
    fontFamily: 'sf_regular',
    fontWeight: '400',
    fontSize: 14,
    color: '#fff',
    paddingVertical: 3,
    marginRight: 5,
    lineHeight: 24,
  },

  cardStudentElement_radio: {
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: COLORS.whiteGray,
    fontFamily: 'sf_medium',
    fontWeight: '500',
    fontSize: 12,
    color: COLORS.darkBlue,
    paddingVertical: 3,
    lineHeight: 14,
    marginRight: 'auto',
  },

  cardStudentElement_table: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: COLORS.whiteGray,
    fontFamily: 'sf_regular',
    fontWeight: '400',
    fontSize: 12,
    color: COLORS.darkBlue,
    lineHeight: 24,
    marginRight: 5,
  },

  // cardStudentLine: {
  //   height: 3,
  //   backgroundColor: COLORS.gray,
  //   borderRadius: 42,
  //   marginTop: 5,
  //   marginBottom: 30,
  // },

  cardSmallLine: {
    height: 3,
    backgroundColor: COLORS.gray,
    borderRadius: 42,
    marginTop: 5,
    marginBottom: 30,
  },

  // cardStudentTitle: {
  //   fontFamily: 'sf_medium',
  //   fontWeight: '500',
  //   fontSize: 16,
  //   lineHeight: 19,
  //   color: COLORS.darkBlue,
  //   marginBottom: 15,
  // },

  cardBlock: {
    gap: 15,
  },

  cardBlockTitle: {
    fontFamily: 'sf_medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.darkBlue,
  },

  emptyValue: {
    fontSize: 14,
    fontFamily: 'sf_regular',
    fontWeight: 400,
    color: '#848484',
    lineHeight: 17,
    flex: 1,
  },

  cardStudentSubTitle: {
    fontFamily: 'sf_medium',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 19,
    color: COLORS.darkBlue,
    marginBottom: 5,
    width: '48%',
    marginRight: '2%',
  },

  TableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  TableHeadText: {
    width: '10%',
    fontFamily: 'sf_medium',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: COLORS.darkBlue,
    textTransform: 'uppercase',
  },

  divNoteInput: {
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: 'sf_regular',
    lineHeight: 20,
    fontWeight: '400',
    padding: 0,
    margin: 0,
    color: COLORS.darkBlue,
  },

  divNoteText: {
    fontSize: 14,
    fontFamily: 'sf_regular',
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.darkBlue,
  },

  divNoteWrap_edit: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 16,
    color: COLORS.darkBlue,
  },

  divNoteWrap: {},

  selectedList: {
    flexGrow: 1,
    height: 100,
  },

  selectedListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedListRowText: {
    fontFamily: 'sf_light',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.darkBlue,
  },

  selectedListRowBtn: {
    borderRadius: 10,
    width: 38,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
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

  buttonDefault: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: COLORS.gray,
    borderWidth: 1,
    alignItems: 'center',
    gap: 15,
  },

  buttonDefaultText: {
    fontFamily: 'sf_regular',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.blue,
  },

  ModalDownContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalDownWrap: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    height: 426,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  skeletonCard: {
    backgroundColor: '#FFF',
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 25,
    shadowColor: 'transparent',
  },

  skeletonCard__active: {
    backgroundColor: '#EEEDFE',
    borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 25,
    shadowColor: 'transparent',
  },

  skeletonCardContent: {
    backgroundColor: COLORS.gray,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 19,
  },

  skeletonCardContentActive: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 19,
  },

  skeletonCardRow: {
    gap: 15,
    flexDirection: 'row',
    flex: 1,
  },

  skeletonCardEl: {
    backgroundColor: '#C6C6C6',
    borderRadius: 36,
    height: 11,
  },

  modalLoad: {
    width: 294,
    height: 194,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
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
    backgroundColor: '#fff',
    marginTop: 'auto',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  holdMenuButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    marginBottom: 15,
    alignItems: 'center',
  },

  holdMenuButtonText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 17,
    marginLeft: 15,
  },

  dropdownList: {
    gap: 15,
    overflow: 'hidden',
  },

  dropdownLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },

  dropdownLabelText: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 19,
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
    borderColor: '#554AF0',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxIcon__active: {
    borderWidth: 0,
    backgroundColor: '#554AF0',
  },

  checkboxText: {
    fontFamily: 'sf_regular',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 21,
    color: COLORS.darkBlue,
  },

  filterCancel: {
    backgroundColor: '#FBEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 16,
    width: '100%',
  },

  filterCancelText: {
    color: '#DC5F5A',
    fontWeight: 600,
    fontFamily: 'sf_regular',
    fontSize: 15,
    lineHeight: 18,
  },

  filterButtons: {
    marginBottom: 21,
    gap: 15,
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  navPageTabText: {
    color: '#B1B1B1',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 500,
    fontFamily: 'sf_regular',
  },

  headerAddedTitleStyle: {
    color: '#B1B1B1',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: 400,
    fontFamily: 'sf_regular',
  },

  seqLineHeader: {
    width: '100%',
    height: 1,
    backgroundColor: '#EBEBEB',
  },

  radioCircle: {
    borderWidth: 1.5,
    borderColor: '#B1B1B1',
    borderRadius: 22,
    width: 22,
    height: 22,
    backgroundColor: 'transparent',
  },

  radioCircle__active: {
    borderWidth: 6,
    borderColor: '#554AF0',
  },

  radioText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 400,
    color: COLORS.darkBlue,
  },

  opacityButton: {
    backgroundColor: 'rgba(85, 74, 240, 0.1);',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },

  opacityButtonText: {
    color: '#554AF0',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 600,
  },
});
