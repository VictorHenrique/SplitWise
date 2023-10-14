import { StyleSheet } from 'react-native';
import theme from './theme.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.md_sys_color_background,
  },
  containerHome: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.md_sys_color_background,
  },
  headerStyle: {
    backgroundColor: theme.md_sys_color_background,
    borderWidth:0,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: theme.md_sys_color_on_background,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    // borderColor: theme.md_sys_color_on_secondary_container,
    flexDirection: 'row',
    marginTop: 20,
    padding: 10,
  },
  inputCreateGroup: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    backgroundColor: theme.md_sys_color_primary,
    borderRadius: 5,
    padding: 15,
  },
  iconContainer: {
    width: 30,
  },
  verticalSpace: {
    height: 16,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 48,
  },
  membersListHeader: {
    marginTop: 48,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: "Roboto",
    color: theme.md_sys_color_secondary,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 8,
    color: theme.md_sys_color_secondary,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.md_sys_color_secondary,
  },
  groupList: {
    marginTop: 16,
  },
  groupButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  groupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createGroupButton: {
    backgroundColor: theme.md_sys_color_tertiary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: "100%",
    marginTop: 10,
  },
  createGroupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  membersList: {
    marginTop: 8,
    color: theme.md_sys_color_on_primary_container
  },
  memberName: {
      fontSize: 18,
      color: theme.md_sys_color_primary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    color: theme.md_sys_color_secondary,
  },
  removeMemberButton: {
    fontSize: 20,
    marginLeft: 8,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  addMemberButton: {
    fontSize: 48,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: "Roboto",
    color: theme.md_sys_color_primary,
  },
  groupButtonHome: {
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.md_sys_color_primary,
    borderRadius: 10,
    padding: 15,
  },
  groupExpensesTitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: "Roboto",
    color: theme.md_sys_color_secondary,
  },
  noExpenses: {
    color: theme.md_sys_color_error,
    fontSize: 20,
  },
  totalGroupExpenses: {
    color: theme.md_sys_color_tertiary,
    fontSize: 20,
    marginTop: 30,
    fontWeight: 'bold',
  },
  expenseDetailButton: {
    backgroundColor: theme.md_sys_color_secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: "100%",
    marginTop: 10,
  },
  titleExpense: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "Roboto",
    color: theme.md_sys_color_tertiary,
  },
  fieldExpense: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "Roboto",
    color: theme.md_sys_color_tertiary,
  }
});

export default styles;
