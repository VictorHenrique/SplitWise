import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import TextField from './TextField.tsx';
import theme from './styles/theme.js';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/styles.js';

const CreateGroupScreen = ({navigation}) => {
    const route = useRoute();
    const { addGroup, username } = route.params;
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]);
    const [newMember, setNewMember] = useState('');

    const handleSubmit = () => {
        const newGroup = {groupName, members: [...members, username]};
        if (groupName === '') {
            alert('Nome do grupo invalido');
            return;
        }

        addGroup(newGroup);

        navigation.goBack();
    };

    const addMember = () => {
        if (newMember.trim() !== '') {
            setMembers([...members, newMember]);
            setNewMember('');
        }
    };

    const removeMember = (index) => {
        const updatedMembers = [...members];
        updatedMembers.splice(index, 1);
        setMembers(updatedMembers);
    };

    return (
        <View style={styles.containerHome}>
            <View style={styles.header}>
                <Text style={styles.title}>Create a new group</Text>
                <TextField
                    value={groupName}
                    label='Group Name'
                    iconName='team'
                    iconSize={24}
                    onChangeText={(text) => setGroupName(text)}
                />
            </View>

            <Text style={styles.membersListHeader}>Members:</Text>

            <View style={styles.addMemberContainer}>
                <TextField
                    value={newMember}
                    label='New Member'
                    iconName='addusergroup'
                    iconSize={24}
                    onChangeText={(text) => setNewMember(text)}
                />
                <Pressable onPress={addMember}>
                    <Ionicons name="add-circle-outline" size={24} color={theme.md_sys_color_secondary}/>
                </Pressable>
            </View>

            <View style={styles.membersList}>
                {members.map((member, index) => (
                    <View key={index} style={styles.memberItem}>
                        <Text style={styles.memberName}>{member}</Text>
                        <Pressable onPress={() => removeMember(index)}>
                            <Fontisto name="trash" size={24} color={theme.md_sys_color_error} style={styles.removeMemberButton}/>
                        </Pressable>
                    </View>
                ))}
            </View>

            <Pressable
                style={styles.createGroupButton}
                onPress={handleSubmit}
            >
                <Text style={styles.createGroupButtonText}>Create Group</Text>
            </Pressable>
        </View>
    );
};

export default CreateGroupScreen;
