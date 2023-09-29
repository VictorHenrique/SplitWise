import { View, Text, Button } from 'react-native';
import styles from '../styles.js'
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
                <Text style={styles.label}>Detalhes do Grupo: {groupName}</Text>
            </View>
            <Button
                title="Adicionar Despesa"
                onPress={() =>
                    navigation.navigate('CreateExpense', {
                        groupName: groupName,
                        groupMembers: groupMembers,
                        addExpense: addExpense,
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

export default GroupDetailsScreen;


