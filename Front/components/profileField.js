import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TextField from './TextField.tsx';
import theme from './styles/theme.js';
import styles from './styles/styles.js';
import { useEffect, useState } from 'react';

const profileField = ({isEditable, fieldName, label, iconName, user, setUser}) => {
    const [editing, setEditing] = useState(false);
    const [newValue, setNewValue]= useState({...user});

    const allowEditing = () => {
        setEditing(true);
    }

    const handleEditing = (value) => {
        let nUser = {...user};
        nUser[fieldName] = value;
        setNewValue(nUser);
    }

    const finishEditing = () => {
        setEditing(false);
        setUser(newValue);
    }

    const cancelEditing = () => {
        setNewValue(user);
        setEditing(false);
    }

    return (
        <View style={styles.infoContainer}>
            <TextField
                style={{width: isEditable && editing ? "80%" : "90%"}}
                value={newValue[fieldName]}
                label={label}
                iconName={iconName}
                iconSize={24}
                onChangeText={(text) => handleEditing(text)}
                editable={editing}
            />
            {isEditable && !editing && <View style={[styles.iconContainer, {marginTop: 32}]}>
                <Pressable onPress={allowEditing}>
                    <Ionicons name="ios-pencil-sharp" size={24} color={theme.md_sys_color_on_background} />
                </Pressable>
            </View>}
            {isEditable && editing && <View style={[styles.iconContainer, {marginTop: 32}]}>
                <Pressable onPress={finishEditing}>
                    <Ionicons name="checkbox" size={24} color="green" />
                </Pressable>
            </View>}
            {isEditable && editing && <View style={[styles.iconContainer, {marginTop: 32}]}>
                <Pressable onPress={cancelEditing}>
                    <Ionicons name="ios-close-circle-sharp" size={24} color={theme.md_sys_color_error} />
                </Pressable>
            </View>}
        </View>
    );
};

export default profileField;