import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, Button } from 'react-native';
import { TouchableOpacity } from "react-native-web";
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles.js'

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
            <Text>Criar um novo grupo</Text>
            <TextInput
                placeholder="Nome do Grupo"
                value={groupName}
                onChangeText={(text) => setGroupName(text)}
                style={styles.inputCreateGroup}
            />

            <Text>Integrantes:</Text>
            <View style={styles.membersList}>
                {members.map((member, index) => (
                    <View key={index} style={styles.memberItem}>
                        <Text>{member}</Text>
                        <TouchableOpacity onPress={() => removeMember(index)}>
                            <Fontisto name="trash" size={24} color="black" style={styles.removeMemberButton}/>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.addMemberContainer}>
                <TextInput
                    placeholder="Novo Integrante"
                    value={newMember}
                    onChangeText={(text) => setNewMember(text)}
                    style={styles.inputCreateGroup}
                />
                <TouchableOpacity onPress={addMember}>
                    <Ionicons name="add-circle-outline" size={24} color="black" style={styles.addMemberButton}/>
                </TouchableOpacity>
            </View>

            <Button title="Criar grupo" onPress={handleSubmit}/>
        </View>
    );
};

export default CreateGroupScreen;
