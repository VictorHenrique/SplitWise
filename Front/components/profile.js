import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from './styles/styles.js';

const ProfileScreen = () => {
    const [userData, setUserData] = useState({
        name: 'Seu Nome',
        socialName: 'Seu Nome Social',
        email: 'seuemail@example.com',
        phone: 'Seu Telefone',
        pix: 'Chave Pix',
        monthlyIncome: 'Sua Renda Mensal',
        password: 'Sua Senha',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ ...userData });

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const saveChanges = () => {
        setUserData({ ...editedData });
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Perfil do Usuário</Text>
            <View>
                <Text>Nome:</Text>
                {isEditing ? (
                    <TextInput
                        value={editedData.name}
                        onChangeText={(text) => setEditedData({ ...editedData, name: text })}
                        style={styles.input}
                    />
                ) : (
                    <Text>{userData.name}</Text>
                )}
            </View>
            <View>
                <Text>Nome Social:</Text>
                {isEditing ? (
                    <TextInput
                        value={editedData.socialName}
                        onChangeText={(text) => setEditedData({ ...editedData, socialName: text })}
                        style={styles.input}
                    />
                ) : (
                    <Text>{userData.socialName}</Text>
                )}
            </View>
            <View>
                <Text>Email:</Text>
                {isEditing ? (
                    <TextInput
                        value={editedData.email}
                        onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                        style={styles.input}
                    />
                ) : (
                    <Text>{userData.email}</Text>
                )}
            </View>
            <View>
                <Text>Telefone:</Text>
                {isEditing ? (
                    <TextInput
                        value={editedData.phone}
                        onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
                        style={styles.input}
                    />
                ) : (
                    <Text>{userData.phone}</Text>
                )}
            </View>
            <View>
                <Text>Chave Pix:</Text>
                {isEditing ? (
                    <TextInput
                        value={editedData.pix}
                        onChangeText={(text) => setEditedData({ ...editedData, pix: text })}
                        style={styles.input}
                    />
                ) : (
                    <Text>{userData.pix}</Text>
                )}
            </View>
            <View>
                <Text>Renda Mensal:</Text>
                {isEditing ? (
                    <TextInput
                        value={editedData.monthlyIncome}
                        onChangeText={(text) => setEditedData({ ...editedData, monthlyIncome: text })}
                        style={styles.input}
                    />
                ) : (
                    <Text>{userData.monthlyIncome}</Text>
                )}
            </View>
            {isEditing ? (
                <Button title="Salvar Alterações" onPress={saveChanges} />
            ) : (
                <Button title="Editar Perfil" onPress={toggleEdit} />
            )}
        </View>
    );
};

export default ProfileScreen;

