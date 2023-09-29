import { useState } from "react";
import { View, Text, Button, Switch } from 'react-native';
import styles from '../styles.js'
import { TextInput } from "react-native-gesture-handler";
import {v4 as uuidv4 } from 'uuid';

const CreateExpenseScreen = ({route, navigation}) => {
    const { groupName, groupMembers, addExpense } = route.params;
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [selectedMembers, setSelectedMembers] = useState('');
    const [isRawValue, setIsRawValue] = useState(false);
    const [individualPayments, setIndividualPayments] = useState({});

    const generateUniqueId = () => {
        return uuidv4();
    };

    const handlePaymentChange = (member, text) => {
        const numericValue = parseFloat(text)
        if (!isNaN(numericValue)) {
            setIndividualPayments({...individualPayments, [member]: numericValue});
        } else {
            setIndividualPayments({...individualPayments, [member]: 0});
        }
    };

    const handleSubmit = () => {
        if (!expenseName || !expenseAmount || selectedMembers.length === 0) {
            alert('Preencha todos os campos');
            return;
        }
        const amount = parseFloat(expenseAmount);
        let totalPayment = 0;
        let payments = {}
        if (isRawValue) {
            for (const member of selectedMembers) {
                totalPayment += individualPayments[member] || 0;
            }
            if (totalPayment !== amount) {
                alert('O valor somado deve ser igual ao valor total da despesa');
                return;
            }
            payments = individualPayments;
        } else {
            for (const member of selectedMembers) {
                totalPayment += individualPayments[member] || 0;
            }
            if (totalPayment !== 100) {
                alert('O valor somado deve ser igual a 100%');
                return;
            }
            for (const member of selectedMembers) {
                payments[member] = (individualPayments[member] * amount) / 100;
            }
        }

        const newExpense = {
            id: generateUniqueId(),
            name: expenseName,
            amount: amount,
            members: selectedMembers,
            individualPayments: payments,
        };

        addExpense(newExpense);

        navigation.goBack();
    };

    const toggleMemberSelection = (member) => {
        if (selectedMembers.includes(member)) {
            setSelectedMembers(selectedMembers.filter((m) => m !== member));
        } else {
            setSelectedMembers([...selectedMembers, member]);
        }
    };

    return (
        <View style={styles.containerHome}>
            <Text style={styles.label}>Criar Nova Despesa em {groupName}</Text>
            <Text>Nome da Despesa:</Text>
            <TextInput value={expenseName} onChangeText={(text) => setExpenseName(text)} style={styles.inputCreateGroup}/>
            <Text>Valor da Despesa:</Text>
            <TextInput value={expenseAmount} onChangeText={(text) => setExpenseAmount(text)} style={styles.inputCreateGroup} keyboardType="numeric"/>
            <Text>Valores em:</Text>
            <Switch
                value={isRawValue}
                onValueChange={(value) => setIsRawValue(value)}
            />
            <Text style={styles.label}>Membros Envolvidos:</Text>
            {groupMembers.map((member) => (
                <View key={member}>
                    <Text styles={styles.username}>{member}</Text>
                    <Button
                        title={selectedMembers.includes(member) ? 'Selecionado' : 'Selecionar'}
                        onPress={() => toggleMemberSelection(member)}
                    />
                    <TextInput
                        placeholder={`Valor para ${member}`}
                        value={individualPayments[member] ? individualPayments[member].toString() : ""}
                        onChangeText={(text) => handlePaymentChange(member, parseFloat(text))}
                        style={styles.inputCreateGroup}
                        keyboardType="numeric"
                    />
                </View>
            ))}
            <Button title="Criar Despesa" onPress={handleSubmit}/>
        </View>
    )
}

export default CreateExpenseScreen;
