import React, { useState } from 'react';
import { View, Image, Pressable, PermissionsAndroid } from 'react-native';
import styles from './styles/styles.js';
import ProfileField from './profileField.js';
import ImagePicker from 'react-native-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const [userData, setUserData] = useState({
        name: 'Seu Nome',
        socialName: 'Seu Nome Social',
        email: 'seuemail@example.com',
        phone: 'Seu Telefone',
        pix: 'Chave Pix',
        monthlyIncome: 'Sua Renda Mensal',
        password: 'Sua Senha',
        photo: "https://thispersondoesnotexist.com/"
    });

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };
        
        ImagePicker.launchImageLibrary(options, (response) => {
            console.log(response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            console.log(imageUri);
            // setUserData({...userData, photo: imageUri});
            }
        });
    };


    const handleChangePhoto = async() => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, {
                title: 'Choose from device',
                message:'Allow gallery access',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("ALO")
                openImagePicker();
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    return (
        <View style={styles.container}>
            <View> 
                <Image style={styles.bigProfilePic} source={{uri: userData.photo}}/>
                <Pressable style={styles.changeProfilePic} onPress={handleChangePhoto}>
                    <MaterialIcons name="add-a-photo" size={24} color="black" />
                </Pressable>
            </View>
            
            <ProfileField isEditable={true} fieldName={"name"} label={"Name"} iconName={"idcard"} user={userData} setUser={setUserData} />
            <ProfileField isEditable={true} fieldName={"socialName"} label={"Social Name"} iconName={"user"} user={userData} setUser={setUserData} />
            <ProfileField isEditable={true} fieldName={"email"} label={"Email"} iconName={"mail"} user={userData} setUser={setUserData} />
            <ProfileField isEditable={true} fieldName={"phone"} label={"Phone Number"} iconName={"phone"} user={userData} setUser={setUserData} />
            <ProfileField isEditable={true} fieldName={"pix"} label={"Pix Key"} iconName={"user"} user={userData} setUser={setUserData} />
            <ProfileField isEditable={false} fieldName={"monthlyIncome"} label={"Monthly Income"} iconName={"wallet"} user={userData} setUser={setUserData} />
            <ProfileField isEditable={true} fieldName={"password"} label={"Password"} iconName={"lock"} user={userData} setUser={setUserData} />
        </View>
    );
};

export default ProfileScreen;

