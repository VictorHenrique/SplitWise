import React, { useState } from 'react';
import TextField from './TextField.tsx';
import { View, Text, Pressable } from 'react-native';
import styles from './styles/styles.js';
import theme from './styles/theme.js';

const RegisterScreen = ({navigation, accounts, setAccounts}) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleRegister = () => {
        if (username !== '' && password !== '' && confirmPassword !== '' &&
            email !== '' && password === confirmPassword) {
            setAccounts({...accounts, [username]: password});
            navigation.navigate('Login')
        } else {
            alert('Invalid Fields')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            <TextField
                value={username}
                iconName='user'
                iconSize={24}
                label='Username'
                onChangeText={(text) => setUsername(text)}
            />
            <TextField
                value={password}
                iconName='lock1'
                iconSize={24}
                label='Password'
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />
            <TextField
                value={confirmPassword}
                iconName='lock1'
                iconSize={24}
                label='Confirm Password'
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry={true}
            />
            <TextField
                value={email}
                iconName='mail'
                iconSize={24}
                label='Email'
                onChangeText={(text) => setEmail(text)}
            />
            <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={{"fontFamily": "Roboto", "color": theme.md_sys_color_on_prime}}>
                    Register
                </Text>
            </Pressable>
        </View>
    )
}

export default RegisterScreen;
