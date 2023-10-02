import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from './styles/styles.js';

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
            alert('Campos invailidos')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome de Usuario:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setUsername(text)}
                value={username}
            />
            <Text style={styles.label}>Senha:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
            />
            <Text style={styles.label}>Repetir Senha:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                secureTextEntry={true}
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <Button title='Registrar' onPress={handleRegister}/>
        </View>
    )
}

export default RegisterScreen;
