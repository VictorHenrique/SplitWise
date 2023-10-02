import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable } from 'react-native';
import styles from './styles/styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import typography from './styles/typography.js';
import colors from './styles/tokens.js';
import { AntDesign } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';


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

    const logo = require('./../assets/images/logo.svg');

    return (
        <View style={styles.container}>
            <View style={{flex: 1, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                <View style={{width: 300, height: 200}}>
                    <SvgUri
                        width="100%"
                        height="100%"
                        uri="http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconContainer}>
                        <AntDesign name='mail' size={24} color={colors.md_sys_color_on_background_dark}/>
                    </View>
                    
                    <TextInput
                        style={[styles.input]}
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.iconContainer}>
                        <AntDesign name='lock1' size={26} color={colors.md_sys_color_on_background_dark}/>
                    </View>
                    
                    <TextInput
                        style={[styles.input]}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={{"fontFamily": "Roboto", "color": colors.md_sys_color_on_primary_container}}>Login</Text>
                </Pressable>
            </View>
            <View style={{height: 50}}>
                <Text style={{color: "white"}}>Don't have an account?  
                    <Text style={{"color": colors.md_sys_color_on_tertiary_container_dark}} onPress={() => navigation.navigate('Register')}> Create here</Text>
                </Text>
            </View>
        </View>
    )
};

export default LoginScreen;
