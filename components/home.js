import { View, Text } from 'react-native';
import styles from '../styles.js'
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen = () => {
    const route = useRoute();
    const { username } = route.params;
    const groups = ["Group 1", "Group 2", "Group 3"]
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profile}>
                    <FontAwesome name="user-circle" size={32} color="gray" style={styles.profileIcon}/>
                    <Text style={styles.username}>{username}</Text>
                </View>
            </View>

            <View style={styles.groupList}>
                {groups.map((group, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.groupButton}
                        onPress={() => navigation.navigate('GroupDetails', { groupName: group})}
                    >
                        <Text style={styles.groupButtonText}>{group}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HomeScreen;
