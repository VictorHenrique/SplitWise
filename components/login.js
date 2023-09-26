import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles.js'

const LoginScreen = ({navigation, accounts}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => { if (accounts[username] === password) {
            navigation.navigate('Home', {username});
        } else {
            alert('Usuario e/ou senha invalido');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Usuario:</Text>
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
            <Button title='Login' onPress={handleLogin}/>
            <View style={styles.verticalSpace}/>
            <Button title='Cadastrar' onPress={() => navigation.navigate('Register')}/>
        </View>
    )
};

export default LoginScreen;
