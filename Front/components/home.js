import { View, Text } from 'react-native';
import styles from '../styles.js'
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

const HomeScreen = ({navigation}) => {
    const route = useRoute();
    const { username } = route.params;
    const [groups, setGroups] = useState({
        "Group 1":["amigo1", "amigo2", "owner1"],
        "Group 2":["amigo3", "amigo4", "owner2"],
        "Group 3":["amigo5", "amigo6", "owner3"]}
    );

    const addGroup = (newGroup) => {
        setGroups({...groups, [newGroup.groupName]: newGroup.members});
    };

    const deleteGroup = (groupName) => {
        setGroups((groups) => {
            const updatedGroups = {...groups};
            delete updatedGroups[groupName];
            return updatedGroups;
        });
    }

    const handleGroupDetails = (groupName) => {
        const group = groups[groupName];
        const lastIndex = group.length - 1;
        const owner = group[lastIndex];
        if (owner === username) {
            navigation.navigate('GroupDetailsAdmin', {groupName: groupName, deleteGroup: deleteGroup})
        } else {
            navigation.navigate('GroupDetails', {groupName: groupName, deleteGroup: deleteGroup})
        }
    };

    return (
        <View style={styles.containerHome}>
            <View style={styles.header}>
                <View style={styles.profile}>
                    <FontAwesome name="user-circle" size={32} color="gray" style={styles.profileIcon}/>
                    <Text style={styles.username}>Hello, {username}</Text>
                </View>
            </View>

            <View style={styles.groupList}>
                {Object.entries(groups).map(([groupName, index]) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.groupButton}
                        onPress={() => handleGroupDetails(groupName)}
                    >
                        <Text style={styles.groupButtonText}>{groupName}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate('CreateGroup', {addGroup: addGroup, username: username})}>
                <Text style={styles.createGroupButtonText}>Criar Grupo</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
