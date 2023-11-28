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
        "Group 1":[
            "g1_a", "aaa", "vasd", "c", "vasco", "Pollie", "Niklas", "Hidayat", "Sneha", "Mairead", "Ramkrishna", 
            "Harta", "Portia", "Iuppiter", "Nazir" , "Brynja", "Andrew", "Madhavi", "Spartak", "Sacnicte" 
        ],
        "Group 2":[
            "g2_a", "aaa", "vasd", "c", "vasco", "Pollie", "Niklas", "Hidayat", "Sneha", "Mairead", "Ramkrishna", 
            "Harta", "Portia", "Iuppiter", "Nazir" , "Brynja", "Andrew", "Madhavi", "Spartak", "Sacnicte" 
        ],
        "Group 3":[
            "g3_a", "aaa", "vasd", "c", "vasco", "Pollie", "Niklas", "Hidayat", "Sneha", "Mairead", "Ramkrishna", 
            "Harta", "Portia", "Iuppiter", "Nazir" , "Brynja", "Andrew", "Madhavi", "Spartak", "Sacnicte" 
        ],
    });
    
    const addGroup = (newGroup) => {
        const groupname = newGroup.groupName;
        const members = newGroup.members; 
        let group = {...groups}
        group[groupname] = members;
        
        console.log(group);

        setGroups(group);
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
