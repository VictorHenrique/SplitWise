import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, Button } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import styles from '../styles.js'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupDetailsAdminScreen = ({route, navigation}) => {
    const { groupName, deleteGroup, groupMembers, username } = route.params;
    const [expenses, setExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [isExpenseOpen, setIsExpenseOpen] = useState({});

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                // Recupera as despesas do AsyncStorage quando a tela é montada
                const expensesJSON = await AsyncStorage.getItem('expenses');
                const expenses = expensesJSON ? JSON.parse(expensesJSON) : [];

                // Define as despesas no estado local
                setExpenses(expenses);
            } catch (error) {
                console.error('Erro ao obter despesas do AsyncStorage: ', error);
            }
        };

        // Chama a função para buscar despesas quando a tela for montada
        fetchExpenses();
    }, []);

    useEffect(() => {
        setUserExpenses(expenses);
    }, [expenses]);

    const calculateTotalExpenses = () => {
        let total = 0;
        expenses.forEach((expense) => {
            total += expense.amount;
        });
        return total;
    }

    const handleToggleExpenses = () => {
        if (userExpenses.length === expenses.length) {
            const filteredExpenses = expenses.filter((expense) => {
                return expense.members.includes(username);
            });
            setUserExpenses(filteredExpenses);
        } else {
            setUserExpenses(expenses);
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
            const existingExpenses = existingExpensesJSON ? JSON.parse(existingExpensesJSON) : [];

            // Adiciona a nova despesa à lista de despesas
            existingExpenses.push(newExpense);

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
                <Text style={styles.label}>Detalhes do Grupo: {groupName}</Text>
                <TouchableOpacity onPress={handleDeleteGroup}>
                    <Fontisto name="trash" size={24} color="black" style={styles.removeMemberButton}/>
                </TouchableOpacity>
            </View>
            <Button
                title="Adicionar Despesa"
                onPress={() =>
                    navigation.navigate('CreateExpense', {
                        groupName,
                        groupMembers,
                        addExpense,
                    })
                }
            />
            <Text style={styles.label}>Total de Despesas do Grupo: ${calculateTotalExpenses()}</Text>
            <Button title="Pay" onPress={handleToggleExpenses} />
            <Text style={styles.label}>Despesas do Grupo:</Text>
            {userExpenses.length === 0 ? (
                <Text>Nenhuma despesa disponível.</Text>
            ) : (
                userExpenses.map((expense) => (
                    <View key={expense.id}>
                        <Button
                            title={expense.name}
                            onPress={() => {
                                setIsExpenseOpen((prevState) => ({
                                    ...prevState,
                                    [expense.id]: !prevState[expense.id],
                                }));
                            }}
                        />
                        {isExpenseOpen[expense.id] && (
                            <View>
                                <Text style={styles.label}>Detalhes da Despesa:</Text>
                                <Text>Nome: {expense.name}</Text>
                                <Text>Valor Total: ${expense.amount}</Text>
                                <Text>Membros: {expense.members.join(',')}</Text>
                                <Text>Valor a Pagar: ${calculateUserShare(expense)}</Text>
                            </View>
                        )}
                    </View>
                ))
            )}
        </View>
    )
};

export default GroupDetailsAdminScreen;

