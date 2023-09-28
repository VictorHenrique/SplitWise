import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  containerHome: {
      flex: 1,
      padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  inputCreateGroup: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
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
});

export default styles;
