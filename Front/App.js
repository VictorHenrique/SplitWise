import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/home.js';
import LoginScreen from './components/login.js';
import RegisterScreen from './components/register.js';
import { createStackNavigator } from '@react-navigation/stack';
import CreateGroupScreen from './components/createGroup.js';
import GroupDetailsAdminScreen from './components/groupDetailsAdmin.js';
import CreateExpenseScreen from './components/createExpense.js';
import GroupDetailsScreen from './components/groupDetails.js';
import ProfileScreen from './components/profile.js';
import theme from './components/styles/theme.js';

const Stack = createStackNavigator();

const App = () => {
    const [accounts, setAccounts] = useState({
        'a': 'a'
    });

    return (
        <NavigationContainer>
            <Stack.Navigator  initialRouteName='Login'>
                <Stack.Screen
                    options={{
                        title: "",
                        headerShown: false,
                    }}
                    name='Login'
                >
                    {(props) => <LoginScreen{...props} accounts={accounts}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='Register'
                    options={{
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <RegisterScreen{...props} accounts={accounts} setAccounts={setAccounts}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='Home'
                    options={{
                        headerLeft: null,
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <HomeScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='CreateGroup'
                    options={{
                        headerLeft: null,
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <CreateGroupScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='GroupDetailsAdmin'
                    options={{
                        headerLeft: null,
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <GroupDetailsAdminScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='GroupDetails'
                    options={{
                        headerLeft: null,
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <GroupDetailsScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='CreateExpense'
                    options={{
                        headerLeft: null,
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <CreateExpenseScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='Profile'
                    options={{
                        headerLeft: null,
                        title: "",
                        headerShown: false,
                    }}
                >
                    {(props) => <ProfileScreen{...props}/>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
};


export default App;
