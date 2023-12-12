import { View, Text, Pressable, Image } from 'react-native';
import styles from './styles/styles.js';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import TextField from './TextField.tsx';


const ExpenseSharing = ({type, setType, total, members, groupMembers, sharings, setSharings}) => {
    const profilePicSize = 40;
    const dummyPic = 'https://thispersondoesnotexist.com/';
    const defaultValues = [];
    if (groupMembers) {
        for (const item of groupMembers.values()) {
            defaultValues.push(parseFloat(0).toFixed(2));    
        }
    }

    const handleSplitEqually = () => {
        let s = [...defaultValues];
        let value = type === "%" ? 100 : total;

        value /= members.size;
        for (const idx of members.values()) {
            s[idx] = value.toFixed(2);    
        }
        setSharings(s);
    }


    useEffect(() => {
        setSharings(defaultValues);
    }, [members]);

    const handleShareUpdate = (idx, value) => {
        let s = [...sharings]
        s[idx] = value !== "" ? parseFloat(value) : 0.00;
        setSharings(s);
    }

    const fixDecimals = (idx) => {
        let s = [...sharings]
        s[idx] = parseFloat(s[idx]).toFixed(2);
        setSharings(s);
    }

    const handleTypeChange = () => {
        if (type === "%") {
            setType("$");
            return
        }
        setType("%");
    }

    const handleClean = () => {
        let defaultValues = [];
        for (const item of groupMembers.values()) {
            defaultValues.push("");    
        }

        setSharings(defaultValues)
    }

    return (
        <View style={styles.expenseMembersContainer}>
            <View style={[styles.buttonsContainer, {marginBottom: 5}]}>
                <Pressable onPress={handleSplitEqually} style={[styles.membersButton, {width: "30%"}]}><Text style={{textAlign: "center", fontSize: 16}}>Share Equally</Text></Pressable>
                <Pressable onPress={handleTypeChange} style={[styles.membersButton, {width: "30%"}]}><Text style={{textAlign: "center", fontSize: 16}}>Change Type</Text></Pressable>
                <Pressable onPress={handleClean} style={[styles.membersButton, {width: "30%"}]}><Text style={{textAlign: "center", fontSize: 16}}>Clean</Text></Pressable>
            </View>
            <ScrollView style={styles.memberListContainer}>
                {Array.from(members).map((idx) => {
                    return (
                        <View key={idx} style={[{flex: 1, flexDirection: "row", justifyContent: "space-between"}]}>
                            <View style={[styles.memberItem, {width: '55%', marginTop: 20}]}>
                                <View style={styles.memberPic}>
                                    <Image style={{width: profilePicSize, height:profilePicSize, borderRadius: Math.trunc(profilePicSize/2)}} source={{uri: dummyPic}}/>
                                </View>
                                <View style={[styles.memberNameContainer, {width: "60%"}]}>
                                    <Text numberOfLines={1} style={styles.memberName}>{groupMembers[idx]}</Text>
                                    <Text numberOfLines={1} style={styles.memberUsername}>@username_{groupMembers[idx].toLowerCase()}</Text>
                                </View>
                            </View>
                            <View style={{width: "40%", marginTop: 4}}>
                                <TextField
                                    value={sharings[idx] === "" ? "" : sharings[idx]}
                                    label={type}
                                    iconName='pay-circle-o1'
                                    iconSize={24}
                                    onChangeText={(value) => handleShareUpdate(idx, value)}
                                    onBlur={() => fixDecimals(idx)}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>);
                    })}
            </ScrollView>
        </View>
    );
};

export default ExpenseSharing;