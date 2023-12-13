import { View, Text, Pressable } from 'react-native';
import styles from './styles/styles.js';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ip from '../ip.js';

const HomeScreen = ({navigation}) => {
    const route = useRoute();
    const { username, token } = route.params;
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const apiUrl = 'http://' + ip + ':8082/get-all-groups';
                const requestBody = {
                    token: token
                };
                const response = await axios.post(apiUrl, requestBody);
                setGroups(response.data.groups);
            } catch (error) {
                console.error('Error fetching groups', error);
            }
        }

        fetchGroups();
    }, [token]);

    const addGroup = async (newGroup) => {
        try {
            const apiUrl = 'http://' + ip + ':8082/register-group';
            const requestBody = {
                owner: newGroup.owner,
                name: newGroup.groupName,
                members_usernames: newGroup.members
            };
            
            const response = await axios.post(apiUrl, requestBody);
            const newGroupAdded = {
                id: response.data.id,
                owner: newGroup.owner,
                name: newGroup.groupName,
                members_usernames: newGroup.members
            }
            setGroups((prevGroups) => {
                return prevGroups ? [...prevGroups, newGroupAdded] : [newGroupAdded];
            });
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    const deleteGroup = async (groupId, groupOwner) => {
        try {
            const apiUrl = 'http://' + ip + ':8082/delete-group'
            const requestBody = {
                id: groupId,
                username: groupOwner
            }
            const response = await axios.delete(apiUrl, { data: requestBody });
            setGroups((prevGroups) => prevGroups.filter(group => group.id !== groupId));
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleGroupDetails = (groupId) => {
        const group = groups.find((group) => group.id === groupId);
        const owner = group.owner;
        if (owner === username) {
            navigation.navigate('GroupDetailsAdmin', {
                groupID: group.id,
                groupName: group.name,
                owner: group.owner,
                deleteGroup: () => deleteGroup(group.id, owner),
                groupMembers: group.members_usernames,
                username: username,
                token
            });
        } else {
            navigation.navigate('GroupDetails', {
                groupID: group.id,
                groupName: group.name,
                owner: group.owner,
                // deleteGroup: () => deleteGroup(group.id, owner),
                groupMembers: group.members_usernames,
                username: username,
                token
            });
        }
    };

    const handleProfilePress = () => {
        navigation.navigate('Profile');
    };

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
                {groups && groups.map((group, index) => (
                    <Pressable
                        key={index}
                        style={styles.groupButtonHome}
                        onPress={() => handleGroupDetails(group.id)}
                    >
                        <Text style={styles.groupButtonText}>{group.name}</Text>
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
