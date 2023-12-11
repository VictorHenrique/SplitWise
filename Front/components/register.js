import React, { useState } from 'react';
import TextField from './TextField.tsx';
import { View, Text, Pressable } from 'react-native';
import styles from './styles/styles.js';
import theme from './styles/theme.js';
import axios from 'axios';
import ip from '../ip.js';

const RegisterScreen = ({navigation}) => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleRegister = async () => {
        try {
            const apiUrl = 'http://' + ip + ':8081/register-user';
            console.log(apiUrl)

            // Check for valid fields
            if (
                username !== '' &&
                password !== '' &&
                confirmPassword !== '' &&
                email !== '' &&
                password === confirmPassword
            ) {
                // Prepare the request payload
                const requestBody = {
                    username: username,
                    email: email,
                    password: password,
                    name: name, // Add the actual name if you collect it in the registration form
                    surname: surname, // Add the actual surname if you collect it in the registration form
                    phone: phone, // Add the actual phone if you collect it in the registration form
                    register_date: new Date().toISOString(),
                };
                
                // Make the POST request to register the user
                const response = await axios.post(apiUrl, requestBody)

                // Handle the registration success or navigate to the login screen
                console.log('User registered successfully:')
                navigation.navigate('Login');
            } else {
                alert('Invalid Fields');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Failed to register user. Please try again.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextField
                value={username}
                iconName='user'
                iconSize={24}
                label='Username'
                onChangeText={(text) => setUsername(text)}
            />
            <TextField
                value={name}
                iconName='user'
                iconSize={24}
                label='Name'
                onChangeText={(text) => setName(text)}
            />
            <TextField
                value={surname}
                iconName='user'
                iconSize={24}
                label='Surname'
                onChangeText={(text) => setSurname(text)}
            />
            <TextField
                value={phone}
                iconName='user'
                iconSize={24}
                label='Phone'
                onChangeText={(text) => setPhone(text)}
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
