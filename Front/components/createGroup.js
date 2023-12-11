import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextField from './TextField.tsx';
import theme from './styles/theme.js';
import styles from './styles/styles.js';

const CreateGroupScreen = ({navigation}) => {
    const route = useRoute();
    const { addGroup, username } = route.params;
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState({});
    const [newMember, setNewMember] = useState('');
    const [nxtIdx, setNxtIdx] = useState([[0, true]]);
    const [selected, setSelected] = useState(-1);
    const profilePicSize = 50;
    const dummyPic = 'https://thispersondoesnotexist.com/';

    const getIndex = () => {
        let avaiableIndexes = [...nxtIdx];
        let [idx, isLastIdx] = avaiableIndexes.pop();
        if (isLastIdx === true) avaiableIndexes.push([idx + 1, true]);
        setNxtIdx(avaiableIndexes);

        return idx;
    };

    const handleSubmit = () => {
        const newGroup = {
            owner: username,
            groupName: groupName,
            members: Object.values(members)
        };

        if (groupName === '') {
            alert('Nome do grupo invalido');
            return;
        }

        addGroup(newGroup);
        navigation.goBack();
    };

    const addMember = () => {
        if (newMember.trim() !== '') {
            idx = getIndex();
            let updatedMembers = {...members};
            updatedMembers[idx] = newMember;
            setMembers(updatedMembers);
            setNewMember('');
        }
    };

    const handleSelection = (index) => {
        setSelected(selected == index ? -1 : index);
    }

    const removeMember = (idx) => {
        let updatedMembers = {...members};
        delete updatedMembers[idx];
        setMembers(updatedMembers);
        setSelected(-1);
    };

    return (
        <View style={styles.containerHome}>
            <View style={styles.header}>
                <Text style={styles.title}>Create new group</Text>
                <TextField
                    numberOfLines={1}
                    style={{width: "98%"}}
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
                    style={{width: "90%"}}
                    value={newMember}
                    label='New Member'
                    iconName='addusergroup'
                    iconSize={24}
                    onChangeText={(text) => setNewMember(text)}
                />
                <Pressable style={{bottom: -9}} onPress={addMember}>
                    <Ionicons name="add-circle-outline" size={26} color={theme.md_sys_color_secondary}/>
                </Pressable>
            </View>

            <View style={styles.membersList}>
                {Object.keys(members).map((index) => (
                    <Pressable key={index} onPress={() =>  {handleSelection(index)}}>
                        <View style={selected == index ? styles.removeMember : styles.memberItem}>
                            <View style={styles.memberPic}>
                                {selected != index && <Image style={{width: profilePicSize, height:profilePicSize, borderRadius: Math.trunc(profilePicSize/2)}} source={{uri: dummyPic}}/>}
                                {selected == index && <Ionicons onPress={() => {removeMember(index)}} style={{marginLeft:10}} name="person-remove-outline" size={40} color={theme.md_sys_color_error} />}
                            </View>
                            <View style={styles.memberNameContainer}>
                                <Text numberOfLines={1} style={styles.memberName}>{members[index]}</Text>
                                <Text numberOfLines={1} style={styles.memberUsername}>@username_{members[index].toLowerCase()}</Text>
                            </View>
                        </View>
                    </Pressable>
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
