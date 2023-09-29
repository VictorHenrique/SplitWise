import { View, Text, Button } from 'react-native';
import styles from '../styles.js'
import React, { useState, useEffect } from 'react';

const GroupDetailsScreen = ({route, navigation}) => {
    const { groupName, deleteGroup, groupMembers, username } = route.params;
    const [expenses, setExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [isExpenseOpen, setIsExpenseOpen] = useState({});

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

    const addExpense = (newExpense) => {
        setExpenses([...expenses, newExpense]);
    }

    return (
        <View style={styles.containerHome}>
            <View style={styles.groupHeader}>
                <Text style={styles.label}>Detalhes do Grupo: {groupName}</Text>
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

export default GroupDetailsScreen;

