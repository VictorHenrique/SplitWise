import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles.js'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation, accounts}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const clearAsyncStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('AsyncStorage limpo com sucesso.');
      } catch (error) {
        console.error('Erro ao limpar AsyncStorage: ', error);
      }
    };

    const handleLogin = () => {
        if (accounts[username] === password) {
            clearAsyncStorage();
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
