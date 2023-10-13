import { View, Text, Pressable } from 'react-native';
import styles from './styles/styles.js';
import typography from './styles/typography.js';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
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
            navigation.navigate('GroupDetailsAdmin', {groupName: groupName, deleteGroup: deleteGroup, groupMembers: group, username: username})
        } else {
            navigation.navigate('GroupDetails', {groupName: groupName, deleteGroup: deleteGroup, groupMembers: group, username: username})
        }
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    }

    return (
        <View style={styles.containerHome}>
            <View style={styles.header}>
                <Pressable onPress={handleProfilePress}>
                    <View style={styles.profile}>
                        <FontAwesome
                            name="user-circle"
                            size={32}
                            style={styles.profileIcon}
                        />
                        <Text style={styles.username}>Hello, {username}</Text>
                    </View>
                </Pressable>
            </View>

            <View style={styles.groupList}>
                {Object.entries(groups).map(([groupName, index]) => (
                    <Pressable
                        key={index}
                        style={styles.groupButtonHome}
                        onPress={() => handleGroupDetails(groupName)}
                    >
                        <Text style={styles.groupButtonText}>{groupName}</Text>
                    </Pressable>
                ))}
            </View>

            <Pressable
                style={styles.createGroupButton}
                onPress={() => navigation.navigate('CreateGroup', {addGroup: addGroup, username: username})}
            >
                <Text style={styles.createGroupButtonText}>Criar Grupo</Text>
            </Pressable>
        </View>
    );
};

export default HomeScreen;
