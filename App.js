import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/home.js';
import LoginScreen from './components/login.js';
import RegisterScreen from './components/register.js';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
    const [accounts, setAccounts] = useState({});

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login'>
                    {(props) => <LoginScreen{...props} accounts={accounts}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        headerLeft: null,
                    }}
                />
                <Stack.Screen name='Register'>
                    {(props) => <RegisterScreen{...props} accounts={accounts} setAccounts={setAccounts}/>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
};


export default App;
