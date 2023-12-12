import { View, Text, Button, Pressable } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import styles from './styles/styles.js';
import theme from './styles/theme.js';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from '../ip.js';
import axios from 'axios';

const GroupDetailsAdminScreen = ({route, navigation}) => {
    const { groupName, deleteGroup, groupMembers, username, groupID, owner, token } = route.params;
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [isExpenseOpen, setIsExpenseOpen] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const apiUrl = 'http://' + ip + ':8083/get-all-expenses-from-group';
                const response = await axios.get(apiUrl, { params: { id: groupID } });
                setGroupExpenses(response.data.expenses || []);
            } catch (error) {
                console.error('Error fetching expenses', error);
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
            const apiUrl = 'http://' + ip + ':8083/register-expense';

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
            console.log('Expense successfully added');

            // Adiciona a nova despesa à lista de despesas do grupo
            existingExpenses[groupName].push(newExpense);

            // Salva a lista atualizada de despesas no AsyncStorage
            await AsyncStorage.setItem('expenses', JSON.stringify(existingExpenses));

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
                <Pressable onPress={handleDeleteGroup}>
                    <Fontisto name="trash" size={24} color={theme.md_sys_color_error} style={styles.removeMemberButton}/>
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
                            <Text style={styles.createGroupButtonText}>{expense.title}</Text>
                        </Pressable>
                        {isExpenseOpen[expense.id] && (
                            <View>
                                <Text style={styles.titleExpense}>Expense Details: {expense.description}</Text>
                                <Text style={styles.fieldExpense}>Name: {expense.title}</Text>
                                <Text style={styles.fieldExpense}>Total Value: ${expense.amount}</Text>
                            </View>
                        )}
                    </View>
                ))
            )}

            <Text style={styles.totalGroupExpenses}>Total Group Expenses: ${calculateTotalExpenses()}</Text>
        </View>
    )
};

export default GroupDetailsAdminScreen;

