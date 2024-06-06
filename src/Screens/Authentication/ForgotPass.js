import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Platform, StatusBar,ScrollView } from 'react-native';
import { TextInput, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { checkUSNExists, signupHandler, updatePassword } from '../../../Backend/StudentAPICalls';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [usn, setUSN] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarType, setSnackbarType] = useState('error');
  

  const navigation = useNavigation();

  const handleSignUp = async () => {
    setSnackbarMessage('');
    setSnackbarType('error');
  
    if (!email || !password || !usn ) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }
  
    try {
      const check = await checkUSNExists(usn);
      console.log(check);
      if (!email.includes('@')) {
        setSnackbarMessage('Invalid email');
        setSnackbarVisible(true);

      } else if(!check){
          setSnackbarMessage('Usn doesnt exisit. Please try register.');
          setSnackbarVisible(true);
      }else {
        const res = await updatePassword(
          usn,
          email,
          password,
        );
  
        if (res) {
          setSnackbarMessage('Password set successfully');
          setSnackbarType('success');
          setSnackbarVisible(true);
        } else {
          setSnackbarMessage('Failed to change password. Please try again.');
          setSnackbarVisible(true);
        }
      }
    } catch (error) {
      console.error('Error during changing password:', error);
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <LinearGradient
      colors={['#1338be', '#8235cf']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar backgroundColor='#1338be' barStyle='light-content'></StatusBar>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <View
            style={{
              width: '100%',
              marginTop: '5%',
              flex: 1,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopEndRadius: 30,
              borderTopLeftRadius: 30,
              backgroundColor: 'white',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
                android: {
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                },
              }),
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center',paddingVertical:'7%' }}>
              <Text style={{ fontSize: 30, fontFamily: 'RobotoSlab-Black', color: 'black' }}>
                Forgot Password
              </Text>
              <Text style={{ fontSize: 15, fontFamily: 'RobotoSlab-Bold', marginBottom: 10 }}>
                Fill in the credentials
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setSnackbarMessage('');
                }}
                style={styles.input}
                textColor='black'
                mode='outlined'
              />
              <TextInput
                label="USN"
                value={usn}
                onChangeText={text => {
                  setUSN(text);
                  setSnackbarMessage('');
                }}
                style={styles.input}
                textColor='black'
                mode='outlined'
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setSnackbarMessage('');
                }}
                style={styles.input}
                secureTextEntry={!passwordVisible}
                textColor='black'
                mode='outlined'
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? "eye-off" : "eye"}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline]}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', paddingTop: 10 }}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={{ fontSize: 17, color: 'black' }}>Already an user? </Text>
                <Text style={{ fontSize: 18, color: '#1338be', fontWeight: '700' }}>
                  Click here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={snackbarType === 'success' ? styles.snackbarSuccess : styles.snackbarError}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </LinearGradient>
    </ScrollView>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    gap: 10,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 15,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  button: {
    backgroundColor: '#1338be',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    marginTop: 5,
    borderColor: 'white',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  snackbarError: {
    backgroundColor: '#ff4d4d',
  },
  snackbarSuccess: {
    backgroundColor: '#4CAF50',
  },
});