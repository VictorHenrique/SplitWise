import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import styles from './styles/styles.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ip from '../ip.js';

const GroupDetailsScreen = ({route, navigation}) => {
    const { groupID, groupName, groupMembers, username, owner, token } = route.params;
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [userExpensesInGroup, setUEIG] = useState([]);
    const [isExpenseOpen, setIsExpenseOpen] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const apiUrl = 'http://' + ip + ':8083/get-all-expenses-from-group';
                const response = await axios.get(apiUrl, { params: { id: groupID } });
                setGroupExpenses(response.data.expenses || []);
            } catch (error) {
                console.error('Erro ao obter despesas do grupo:', error);
            }

            try {
                const apiUrl = 'http://' + ip + ':8083/get-all-expenses-from-user';
                const response = await axios.get(apiUrl, { params: { token: token } });
                console.log(response.data)
                setUserExpenses(response.data.expenses || []);
            } catch (error) {
                console.error('Error fetching expenses', error);
            } 
        };

        // Chama a função para buscar despesas quando a tela for montada
        fetchExpenses();
    }, [groupID]);

    useEffect(() => {
        const ueig = userExpenses.filter((ue) => ue.group_id === groupID);
        console.log(ueig);
        setUEIG(ueig);
    }, [userExpenses]);

    const calculateTotalExpenses = () => {
        let total = 0;
        userExpensesInGroup.forEach((expense) => {
            total += expense.amount;
        });
        return total;
    }

    const handleToggleExpenses = () => {
        if (userExpenses.length === groupExpenses.length) {
            const filteredExpenses = groupExpenses.filter((expense) => {
                return expense.members.includes(username);
            });
            setUserExpenses(filteredExpenses);
        } else {
            setUserExpenses(groupExpenses);
        }
    }

    const calculateUserShare = (expense) => {
        if (expense.members.includes(username)) {
            return expense.individualPayments[username];
        }
        return 0;
    }

    const addExpense = async (newExpense) => {
        try {
            const apiUrl = 'http://'+ ip +':8083/register-expense';
            const requestBody = {
                debtors_usernames: newExpense.expense_members,
                amount: newExpense.amount,
                title: newExpense.name,
                group_id: groupID,
                payee: owner,
                pay_date: new Date().toISOString(),
                description: "lorem ipsum dolor sit amet",
            }
            const response = await axios.post(apiUrl, requestBody);
            const newExpenseAdded = response.data

            setGroupExpenses((prevExpenses) => [...prevExpenses, newExpenseAdded]);

            // Volta para a tela anterior
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar despesas: ', error);
        }
    };

    return (
        <View style={styles.containerHome}>
            <View style={styles.groupHeader}>
                <Text style={styles.title}>{groupName} Group Details</Text>
            </View>
            <Pressable
                style={styles.createGroupButton}
                onPress={() => 
                    navigation.navigate('CreateExpense', {
                        groupName: groupName,
                        groupMembers: groupMembers,
                        addExpense: addExpense,
                    })
                }
            >
                <Text style={styles.createGroupButtonText}>Add Expense</Text>
            </Pressable>
            <Pressable
                style={styles.createGroupButton}
                onPress={handleToggleExpenses}
            >
                <Text style={styles.createGroupButtonText}>Pay your expenses</Text>
            </Pressable>
            <Text style={styles.groupExpensesTitle}>Group Expenses:</Text>
            <ScrollView>
                {userExpensesInGroup.length === 0 ? (
                    <Text style={styles.noExpenses}>Any expense available.</Text>
                ) : (
                    userExpensesInGroup.map((expense) => (
                        <View key={expense.id}>
                            <Pressable
                                style={styles.expenseDetailButton}
                                onPress={() => {
                                    setIsExpenseOpen((prevState) => ({
                                        ...prevState,
                                        [expense.id]: !prevState[expense.id],
                                    }));
                                }}
                            >
                                <Text style={styles.createGroupButtonText}>{expense.title}</Text>
                            </Pressable>
                            {isExpenseOpen[expense.id] && (
                                <View>
                                    <Text style={styles.titleExpense}>Expense Details: {expense.description}</Text>
                                    <Text style={styles.fieldExpense}>Name: {expense.title}</Text>
                                    {/* <Text style={styles.fieldExpense}>Total Value: ${expense.amount}</Text> */}
                                    <Text style={styles.fieldExpense}>Value to pay: ${expense.amount}</Text>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            <Text style={styles.totalGroupExpenses}>Total Group Expenses: ${calculateTotalExpenses()}</Text>
        </View>
    )
};

export default GroupDetailsScreen;
