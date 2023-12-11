import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from './styles/styles.js';
import theme from './styles/theme.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgUri } from 'react-native-svg';
import TextField from './TextField.tsx';
import axios from 'axios';
import ip from '../ip.js';

const LoginScreen = ({navigation}) => {
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

    const handleLogin = async () => {
        try {
            const apiUrl = 'http://' + ip + ':8081/login-user';

            const requestBody = {
                username: username,
                password: password
            };
            const response = await axios.post(apiUrl, requestBody);
            const token = response.data.token;

            clearAsyncStorage();
            navigation.navigate('Home', {username, token});
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Usuario e/ou senha invalido');
        }
    };

    const logoStyle = {width: 300, height: 200};

    return (
        <View style={styles.container}>
            <View style={{flex: 1, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                <View style={logoStyle}>
                    <SvgUri
                        width="100%"
                        height="100%"
                        uri="https://www.svgrepo.com/show/388632/split-branch.svg"
                    />
                </View>

                <TextField
                    value={username}
                    iconName='mail'
                    iconSize={24}
                    label='Username'
                    onChangeText={(text) => setUsername(text)}
                />
                <TextField
                    value={password}
                    iconName='lock1'
                    iconSize={26}
                    label='Password'
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                />

                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={{"fontFamily": "Roboto", "color": theme.md_sys_color_on_prime}}>
                        Login
                    </Text>
                </Pressable>
            </View>

            <View style={{height: 50}}>
                <Text style={{color: "white"}}>Don't have an account?
                    <Text value={password} style={{"color": theme.md_sys_color_on_tertiary_container}} onPress={() => navigation.navigate('Register')}> Create here</Text>
                </Text>
            </View>
        </View>
    )
};

export default LoginScreen;
