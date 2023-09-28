import { StyleSheet } from 'react-native';
import theme from '../../../components/styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.md_sys_color_primary_container,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: theme.md_sys_color_on_primary_container,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
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
  button: {
    color: theme.md_sys_color_on_tertiary_container,
    backgroundColor: theme.md_sys_color_tertiary_container,
    // backgroundColor: theme.md_sys_color_tertiary_container,
  }
});

export default styles;
