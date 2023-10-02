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
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: theme.md_sys_color_on_background,
    // fontFamily: 'Roboto',
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
    borderColor: theme.md_sys_color_on_secondary_container,
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
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createGroupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  membersList: {
    marginTop: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  removeMemberButton: {
    fontSize: 20,
    marginLeft: 8,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addMemberButton: {
    fontSize: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;
