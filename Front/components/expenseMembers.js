import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from './styles/theme.js';
import styles from './styles/styles.js';
import SearchBar from './searchBar.js';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const ExpenseMembers = ({groupMembers, members, setMembers}) => {
    const [selected, setSelected] = useState(-1);
    const profilePicSize = 50;
    const dummyPic = 'https://thispersondoesnotexist.com/';
    
    const handleSelection = (index) => {
        setSelected(selected == index ? -1 : index);
    }    

    const removeMember = (idx) => {
        let updatedMembers = new Set(members);
        updatedMembers.delete(idx);
        setMembers(updatedMembers);
        setSelected(-1);
    };  

    const handleAddAll = () => {
        let listWithIds = [];
        for (const [index, item] of groupMembers.entries()) {
            listWithIds.push(index);    
        }
        setMembers(new Set(listWithIds));
    }
    
    const handleRemoveAll = () => {
        setMembers(new Set());
    }

    return (
        <View style={styles.expenseMembersContainer}>
            <SearchBar chosen={members} setChosen={setMembers} list={groupMembers}></SearchBar>
            <ScrollView style={styles.memberListContainer}>
                {Array.from(members).map((idx) => {
                    return (
                    <Pressable key={idx} onPress={() =>  {handleSelection(idx)}}>
                        <View style={selected == idx ? styles.removeMember : styles.memberItem}>
                            <View style={styles.memberPic}>
                                {selected != idx && <Image style={{width: profilePicSize, height:profilePicSize, borderRadius: Math.trunc(profilePicSize/2)}} source={{uri: dummyPic}}/>}
                                {selected == idx && <Ionicons onPress={() => {removeMember(idx)}} style={{marginLeft:10}} name="person-remove-outline" size={40} color={theme.md_sys_color_error} />}
                            </View>
                            <View style={styles.memberNameContainer}>
                                <Text numberOfLines={1} style={styles.memberName}>{groupMembers[idx]}</Text>
                                <Text numberOfLines={1} style={styles.memberUsername}>@username_{groupMembers[idx].toLowerCase()}</Text>
                            </View>
                        </View>
                    </Pressable>);
                })}
            </ScrollView>
            <View style={styles.buttonsContainer}>
                <Pressable onPress={handleAddAll} style={styles.membersButton}><Text style={{fontSize: 16}}>Add all</Text></Pressable>
                <Pressable onPress={handleRemoveAll} style={styles.membersButton}><Text style={{fontSize: 16}}>Remove all</Text></Pressable>
            </View>
        </View>
    );
};

export default ExpenseMembers;