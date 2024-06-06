import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar, Dialog, Portal, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgComponent from '../../assests/icons/settings';
import Exams from '../../assests/icons/exams';
import Notification from '../../assests/icons/notification';
import Help from '../../assests/icons/help';
import Save from '../../assests/icons/save';
import colors from '../../assests/colors';
import { useNavigation } from '@react-navigation/native';
import { getUserdata, logout } from '../../../Backend/InAppStore';
import { UserContext } from '../../../UserContext';

const AdminProfile = () => {
  const showDialog = () => setVisible(true);
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  const { userId,setUserId } = useContext(UserContext);
  const [userData, setUserData] = React.useState(null);

  const handleLogout = async () => {
      await logout();
      setUserId(null)
    }
    const navigation = useNavigation();
    useEffect(() => {
        const fetchData = async () => {
          const user = await getUserdata();
          console.log('data', user);
          setUserData(user);
        };
        fetchData();
      }, []);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.lightBackground }}>
            <StatusBar backgroundColor={colors.black} barStyle='light-content' />
            <View style={styles.container}>
                {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 25, left: 10, zIndex: 1000 }} ><Icon name='arrow-left' size={20} color='white' /></TouchableOpacity> */}
                <Text style={styles.title}>My Profile</Text>
                <View style={styles.card}>
                    <Avatar.Text style={{ borderColor: colors.black, borderWidth: 2, backgroundColor: colors.lightBackground }} size={70} label={userData?.email.charAt(0).toUpperCase()} />
                    <View style={{paddingVertical: 5 }}>
                        <Text style={{ fontSize:18, color: colors.black }}>
                            {/* {userData.usn ? userData.usn : 'Name'} */}
                        </Text>
                        {/* <Text style={{ color: colors.grey, fontWeight: '700' }}>
                            {userData.phone ? userData.email : 'Phone Number'}
                        </Text> */}
                    </View>
                </View>
                <View style={{
                    padding: 20,
                    marginBottom: 10,
                    justifyContent: 'center',
                    width: '100%',
                }}>
                    {/* {userData.sem && (
                        <View style={styles.button}>
                            <Exams />
                            <Text style={styles.btntext}>Semester: {userData.sem}</Text>
                        </View>
                    )} */}
                    {/* {userData.dept && (
                        <View style={styles.button}>
                            <SvgComponent />
                            <Text style={styles.btntext}>Department: {userData.dept}</Text>
                        </View>
                    )}
                    {userData.stream && (
                        <View style={styles.button}>
                            <Notification />
                            <Text style={styles.btntext}>Stream: {userData.stream}</Text>
                        </View>
                    )} */}
                    {userData?.email && (
                        <View style={styles.button}>
                            <Save />
                            <Text style={styles.btntext}>Email: {userData.email}</Text>
                        </View>
                    )}
                    {/* <TouchableOpacity style={styles.button}>
                        <Help />
                        <Text style={styles.btntext}>Help & support</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingVertical: 20,position:'absolute',bottom:20,width:'100%' }}>
                    <TouchableOpacity onPress={showDialog} style={{ flexDirection: 'row', backgroundColor: colors.black, padding: 10, paddingHorizontal: 80, borderRadius: 8 }}>
                        <Icon name="sign-out" size={20} color="#fff" />
                        <Text style={{ paddingHorizontal: 10, color: colors.white }}>
                            Sign out
                        </Text>
                    </TouchableOpacity>
                </View>
                <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialogContainer}>
                <Dialog.Title style={styles.title2}>Logout</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.content}>Are you sure you want to logout?</Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button onPress={handleLogout} style={styles.button2}>Yes</Button>
                    <Button onPress={hideDialog} style={styles.button2}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
            </View>
        </ScrollView>
    );
};

export default AdminProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBackground
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'RobotoSlab-Bold',
        alignSelf: 'center',
        paddingVertical: 20,
        backgroundColor: colors.black,
        width: '100%',
        paddingHorizontal: 50,
        textAlign:'center',
        fontWeight:'bold'
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 10,
        alignItems:'center',

    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 12,
        alignSelf: 'center',
        paddingHorizontal: 30,
        marginVertical: 8,
        borderRadius: 8,
        minWidth:'100%'
    },
    btntext: {
        color: colors.black,
        fontSize: 15,
        paddingLeft:10
    },
    dialogContainer: {
      backgroundColor: colors.white,
      borderRadius: 10,
  },
  title2: {
      color: colors.black,
      fontSize: 20,
      fontWeight: 'bold',
  },
  content: {
      color: colors.black,
      fontSize: 16,
  },
  actions: {
      justifyContent: 'space-around',
  },
  button2: {
    paddingHorizontal: 10,
    paddingVertical: 5,
},
});
