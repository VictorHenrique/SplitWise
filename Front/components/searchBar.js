import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import TextField from './TextField.tsx';
import theme from './styles/theme.js';
import styles from './styles/styles.js';
import { useEffect, useState } from 'react';

const SearchBar = ({list, chosen, setChosen}) => {
    const [focused, setIsFocused] = useState(false);
    const [input, updateInput] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    const profilePicSize = 30;
    const dummyPic = 'https://thispersondoesnotexist.com/';
    
    
    let listWithIds = [];
    for (const [index, item] of list.entries()) {
        listWithIds.push({
            "key": index,
            "value": item
        });    
    }

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleUnfocus = () => {
        setIsFocused(false);
    }

    const handlePress = (idx) => {   
        updatedChosen = new Set(chosen);
        updatedChosen.add(idx);
        setChosen(updatedChosen);
        updateInput("");
    }

    useEffect(()=>{
        query = input.trim();
        if (!query) {
            setFilteredList([]);
            setIsFocused(false);
            return;
        }

        setIsFocused(true);
        if (query === "*") {
            setFilteredList(listWithIds);
            return;
        }

        setFilteredList(listWithIds.filter((item) => item.value.toLowerCase().startsWith(query.toLowerCase())));
    }, [input]);

    return (
        <View style={[{width: "100%", maxHeight: "96%", minHeight: "17%"}]}>
            <View style={[styles.searchBarContainer, focused ? {zIndex: 1000} : {zIndex: -1}]}>
                <TextField
                    style={{width: "100%"}}
                    value={input}
                    label='Search Member'
                    iconName='addusergroup'
                    iconSize={24}
                    onChangeText={(text) => updateInput(text)}
                    onFocus={handleFocus}
                    onBlur={handleUnfocus}
                />
            </View>
            <ScrollView keyboardShouldPersistTaps={"always"} scrollEnabled={true} contentContainerStyle={styles.filteredListContainer}>
                {filteredList.map((item) => {
                    return (
                        <Pressable onPress={() => handlePress(item.key)} style={styles.listItem} key={item.key}>
                            <Image style={{borderColor: theme.md_sys_color_primary, borderWidth: 2, width: profilePicSize, height:profilePicSize, borderRadius: Math.trunc(profilePicSize/2)}} source={{uri: dummyPic}}/>
                            <Text style={styles.listItemText}>{item.value}</Text>
                            <Text style={[styles.listItemText, {color: theme.md_sys_color_on_background, marginLeft: 10}]}>@username_{item.value}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default SearchBar;