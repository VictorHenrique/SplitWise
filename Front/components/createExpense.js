import { useState } from "react";
import { View, Text, Pressable } from 'react-native';
import styles from './styles/styles.js';
import TextField from './TextField.tsx';
import {v4 as uuidv4 } from 'uuid';
import { MaterialIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import theme from "./styles/theme.js";
import ExpenseMembers from "./expenseMembers.js";
import ExpenseSharing from "./expenseSharing.js";

const CreateExpenseScreen = ({route, navigation}) => {
    const { groupMembers, addExpense } = route.params;
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [members, setMembers] = useState(new Set());
    const [sharings, setSharings] = useState([]);
    const [type, setType] = useState("%");
    const Tab = createMaterialTopTabNavigator();

    const generateUniqueId = () => {
        return uuidv4();
    };

    // const handlePaymentChange = (member, text) => {
    //     const numericValue = parseFloat(text)
    //     if (!isNaN(numericValue)) {
    //         setIndividualPayments({...individualPayments, [member]: numericValue});
    //     } else {
    //         setIndividualPayments({...individualPayments, [member]: 0});
    //     }
    // };

    const handleSubmit = () => {
        if (!expenseName || !expenseAmount || members.size === 0) {
            alert('Preencha todos os campos');
            return;
        }
        const amount = parseFloat(expenseAmount);
        let totalPayment = 0;
        
        // 0.15 margin due to decimal approximation
        Object.values(sharings).forEach((value) => totalPayment += parseFloat(value));
        if (type === '%') {
            if (Math.abs(totalPayment - 100.0) > 0.15) {
                alert('The sum of sharing should be 100%');
                return;
            }
        } else {
            if (Math.abs(totalPayment - expenseAmount) > 0.15) {
                alert('The expenses sum should be $' + expenseAmount + ". Instead, sum is $"+ totalPayment);
                return;
            }
        }
        
        let users = [];
        let paymentsPerUser = {};
        
        Array.from(members).map((idx) => {
            const member = groupMembers[parseInt(idx)];
            const value = sharings[idx];
            if (value == 0.0)
                return
            paymentsPerUser[member] = type === '%' ? (expenseAmount * parseFloat(value) / 100) : value;
            users.push(member); 
        });

        const newExpense = {
            id: generateUniqueId(),
            name: expenseName,
            amount: amount,
            members: [...users],
            individualPayments: paymentsPerUser,
        };


        addExpense(newExpense);

        navigation.goBack();
    };

    return (
        <>
            <View style={styles.createExpenseContainer} behavior="padding">
                <View style={styles.groupHeader}>
                    <Text style={styles.title}>New Expense</Text>
                    <Pressable onPress={handleSubmit} style={{marginRight: 10}}>
                        <MaterialIcons name="check" size={30} color="green" />
                    </Pressable>
                </View>
                
                <View style={styles.expenseInfos}>
                    {/* Expense photo */}
                    <View style={styles.expenseImg}>
                        <MaterialIcons name="add-a-photo" size={100} color="black" />
                    </View>

                    {/* Expense details */}
                    <View style={styles.expenseDetails}>
                        <TextField
                            value={expenseName}
                            label='Name'
                            iconName='form'
                            iconSize={24}
                            onChangeText={(text) => setExpenseName(text)}
                        />
                        <TextField
                            value={expenseAmount}
                            label='Value'
                            iconName='wallet'
                            iconSize={24}
                            onChangeText={(text) => setExpenseAmount(text)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>

            <Tab.Navigator style={{bottom: 0}} initialRouteName="expenses" screenOptions={{
                tabBarLabelStyle: { color: theme.md_sys_color_on_background },
                tabBarStyle: { backgroundColor: theme.md_sys_color_background, width: "100%" },
                swipeEnabled: true,
                tabBarHideOnKeyboard: true
            }}>

                <Tab.Screen name="Participants" children={()=> <ExpenseMembers 
                        members={members} 
                        setMembers={setMembers} 
                        groupMembers={groupMembers}
                    />} 
                />
                <Tab.Screen name="Sharing" children={()=> <ExpenseSharing 
                        type={type}
                        setType={setType}
                        groupMembers={groupMembers}
                        members={members} 
                        sharings={sharings}
                        total={expenseAmount}
                        setSharings={setSharings}
                    />} 
                />
            </Tab.Navigator>
        </>
    );
}

export default CreateExpenseScreen;
