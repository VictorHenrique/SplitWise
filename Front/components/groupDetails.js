import { View, Text, Button, Pressable } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import styles from './styles/styles.js';
import theme from './styles/theme.js';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupDetailsScreen = ({route, navigation}) => {
    const { groupName, deleteGroup, groupMembers, username } = route.params;
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [isExpenseOpen, setIsExpenseOpen] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                // Recupera as despesas do AsyncStorage quando a tela é montada
                const expensesJSON = await AsyncStorage.getItem('expenses');
                const expenses = expensesJSON ? JSON.parse(expensesJSON) : {};

                console.log('expenses')
                console.log(expenses[groupName])
                console.log('groupName',groupName);

                // Define as despesas no estado local
                setGroupExpenses(expenses[groupName] || []);
            } catch (error) {
                console.error('Erro ao obter despesas do AsyncStorage: ', error);
            }
        };

        // Chama a função para buscar despesas quando a tela for montada
        fetchExpenses();
    }, [groupName]);

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

    const handleDeleteGroup = () => {
        deleteGroup(groupName);
        navigation.goBack();
    }

    const addExpense = async (newExpense) => {
        try {
            // Obtém as despesas atuais do AsyncStorage (se houver)
            const existingExpensesJSON = await AsyncStorage.getItem('expenses');
            let existingExpenses = existingExpensesJSON ? JSON.parse(existingExpensesJSON) : {};

            // Certifique-se de que groupName não seja nulo ou indefinido
            if (!groupName) {
                console.error('Nome do grupo inválido');
                return;
            }

            // Certifique-se de que groupName está definido como uma chave válida
            if (!existingExpenses[groupName]) {
                existingExpenses[groupName] = [];
            }

            // Adiciona a nova despesa à lista de despesas do grupo
            existingExpenses[groupName].push(newExpense);

            // Salva a lista atualizada de despesas no AsyncStorage
            await AsyncStorage.setItem('expenses', JSON.stringify(existingExpenses));

            console.log(existingExpenses);

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
                                <Text style={styles.fieldExpense}>Members: {expense.members.join(',')}</Text>
                                <Text style={styles.fieldExpense}>Value to pay: ${calculateUserShare(expense)}</Text>
                            </View>
                        )}
                    </View>
                ))
            )}

            <Text style={styles.totalGroupExpenses}>Total Group Expenses: ${calculateTotalExpenses()}</Text>
        </View>
    )
};

export default GroupDetailsScreen;
