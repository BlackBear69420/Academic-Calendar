import { StyleSheet, Text, View, TouchableOpacity,ScrollView, StatusBar} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgComponent from '../../assests/icons/settings';
import Exams from '../../assests/icons/exams';
import Notification from '../../assests/icons/notification';
import Help from '../../assests/icons/help';
import Save from '../../assests/icons/save';
import colors from '../../assests/colors';


const Profile = () => {
    const handleSignOut = async () => {
    console.log('logged out')
    };

  return (
    <ScrollView>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content'/>
    <View style={styles.container}>
    <TouchableOpacity style={{position:'absolute',top:25,left:10,zIndex:1000}} ><Icon name='arrow-left' size={20} color='white'/></TouchableOpacity>
      <Text style={styles.title}>My Profile</Text>
      <View style={styles.card}>
      <Avatar.Text style={{borderColor:colors.black,borderWidth:2,backgroundColor:colors.primary}} size={80} label='S' />
      <View style={{paddingHorizontal:30,paddingVertical:10}}>
        <Text style={{fontSize:25,color:colors.black}}>
        Sumit
        </Text>
        <Text style={{color:colors.grey,fontWeight:'700'}}>9844172496</Text>
      </View>
      </View>
      <View style={{
         backgroundColor: 'white',
         padding: 20,
         marginBottom:10,
         justifyContent:'center',
         width:'100%'
      }}>
        <TouchableOpacity style={styles.button}>
        <Exams/>
        <Text style={styles.btntext}>Semester</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <SvgComponent/>
        <Text style={styles.btntext}>Department</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Notification/>
        <Text style={styles.btntext}>Stream</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Save/>
        <Text style={styles.btntext}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
        <Help/>
        <Text style={styles.btntext}>Help & support</Text>
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor:'white',justifyContent:'center',alignItems:'center',paddingVertical:20}}>
       <TouchableOpacity onPress={handleSignOut} style={{flexDirection:'row',backgroundColor:colors.black,padding:10,paddingHorizontal:20,borderRadius:8}}>
       <Icon name="sign-out" size={20} color="#fff" />
        <Text style={{paddingHorizontal:10,color:colors.white}}>
          Sign out
        </Text>
       </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.lightBackground
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'RobotoSlab-Bold',
    alignSelf: 'center',
    paddingVertical: 20,
    backgroundColor:'#1338be',
    width:'100%',
    paddingHorizontal:50
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical:10,
    flexDirection:'row',
  },
  button:{
   flexDirection:'row',
   alignItems:'center',
   width:'70%',
   backgroundColor:colors.lightBackground,
   padding:12,
   alignSelf:'center',
   paddingHorizontal:30,
   marginVertical:8,
   borderRadius:8
  },
  btntext:{
    color:colors.black,
     paddingHorizontal:'15%',
     fontSize:15
  }
});
