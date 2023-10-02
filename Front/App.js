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
    const [accounts, setAccounts] = useState({});

    return (
        <NavigationContainer>
            <Stack.Navigator  initialRouteName='Login'>
                <Stack.Screen options={{
                    title: "",
                    headerShown: false, 
                }} name='Login'>
                    {(props) => <LoginScreen{...props} accounts={accounts}/>}
                </Stack.Screen>
                <Stack.Screen
                    name='Home'
                    options={{
                        headerLeft: null,
                    }}
                >
                    {(props) => <HomeScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen name='CreateGroup'>
                    {(props) => <CreateGroupScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen name='GroupDetailsAdmin'>
                    {(props) => <GroupDetailsAdminScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen name='GroupDetails'>
                    {(props) => <GroupDetailsScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen name='CreateExpense'>
                    {(props) => <CreateExpenseScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Profile'>
                    {(props) => <ProfileScreen{...props}/>}
                </Stack.Screen>
                <Stack.Screen name='Register'>
                    {(props) => <RegisterScreen{...props} accounts={accounts} setAccounts={setAccounts}/>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
};


export default App;
