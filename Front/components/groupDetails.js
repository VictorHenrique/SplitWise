import { View, Text, Button, Pressable, ScrollView } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import styles from './styles/styles.js';
import React, { useState, useEffect } from 'react';
import theme from './styles/theme.js';

const GroupDetailsScreen = ({route, navigation}) => {
    const { groupID, groupName, deleteGroup, groupMembers, username } = route.params;
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [isExpenseOpen, setIsExpenseOpen] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const apiUrl = 'http://192.168.15.24:8083/get-all-expenses-from-group'
                const requestBody = {
                    id: groupID,
                };
                const response = await axios.post(apiUrl, requestBody);
                setGroupExpenses(response.data.expenses || []);
            } catch (error) {
                console.error('Erro ao obter despesas do grupo:', error);
            }
        };

        // Chama a função para buscar despesas quando a tela for montada
        fetchExpenses();
    }, [groupID]);

    useEffect(() => {
        setUserExpenses(groupExpenses);
    }, [groupExpenses]);

    const calculateTotalExpenses = () => {
        let total = 0;
        groupExpenses.forEach((expense) => {
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
            const apiUrl = 'http://192.168.15.24:8083/register-expense'
            const requestBody = {
                payee: newExpense.payee,
                amout: newExpense.amount,
                payDate: newExpense.payDate,
                description: newExpense.description,
                title: newExpense.title,
                groupId: groupID,
                debtors_usernames: newExpense.debtors_usernames
            };
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
                <Pressable onPress={handleDeleteGroup} style={{marginRight: 10}}>
                    <Fontisto name="trash" size={24} color={theme.md_sys_color_error} />
                </Pressable>
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
                {userExpenses.length === 0 ? (
                    <Text style={styles.noExpenses}>Any expense available.</Text>
                ) : (
                    userExpenses.map((expense) => (
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
                                <Text style={styles.createGroupButtonText}>{expense.name}</Text>
                            </Pressable>
                            {isExpenseOpen[expense.id] && (
                                <View>
                                    <Text style={styles.titleExpense}>Expense Details:</Text>
                                    <Text style={styles.fieldExpense}>Name: {expense.name}</Text>
                                    <Text style={styles.fieldExpense}>Total Value: ${expense.amount}</Text>
                                    <Text style={styles.fieldExpense}>Value to pay: ${calculateUserShare(expense)}</Text>
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
