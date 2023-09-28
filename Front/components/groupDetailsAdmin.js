import { TouchableOpacity } from "react-native-gesture-handler";
import { View, Text } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import styles from '../styles.js'
import { useEffect } from "react";


const GroupDetailsAdminScreen = ({route, navigation}) => {
    const { groupName, deleteGroup } = route.params;
    const [expenses, setExpenses] = useState([]);
    const [userExpenses, setUserExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const calculateUserShare = (expense) => {
        const totalMembers = expense.members.length;
        const totalAmount = expense.amount;
        const userShare = totalAmount / totalMembers;
        return userShare;
    }

    const filterUserExpenses = () => {
        const userExpenses = expenses.filter((expense) => {
            expense.members.includes(username);
        });
        setUserExpenses(userExpenses);
    }

    useEffect(() => {
        const initialExpenses = [
            {
                id: 1,
                name: 'Jantar Fora',
                amount: 100,
                owner: 'John',
                members: ['John', 'Alice', 'Bob'],
            },
        ];
        setExpenses(initialExpenses);

        filterUserExpenses();
    }, []);

    const handlePayExpense = (expense) => {

    };

    const handleDeleteGroup = () => {
        deleteGroup(groupName);
        navigation.goBack();
    }

    return (
        <View style={styles.containerHome}>
            <Text style={styles.label}>Detalhes do Grupo: {groupName}</Text>
            <Text style={styles.label}>Despesas do Grupo:</Text>
            {expenses.map((expense) => (
                <TouchableOpacity
                    key={expense.id}
                    onPress={() => setSelectedExpense(expense)}
                >
                    <Text>{expense.name}</Text>
                </TouchableOpacity>
            ))}
            <Text style={styles.groupName}>{groupName}</Text>
            <TouchableOpacity onPress={handleDeleteGroup}>
                <Fontisto name="trash" size={24} color="black" style={styles.removeMemberButton}/>
            </TouchableOpacity>
        </View>
    )
};

export default GroupDetailsAdminScreen;
