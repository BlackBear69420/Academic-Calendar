import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Platform, StatusBar, ScrollView } from 'react-native';
import { TextInput, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { UserContext } from '../../../UserContext';
import { checkCredentials } from '../../../Backend/StudentAPICalls';
import Icon from 'react-native-vector-icons/Entypo';
import colors from '../../assests/colors';

const Login = () => {
  const { userId, setUserId } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarType, setSnackbarType] = useState('error');

  const navigation = useNavigation();

  const handleLogin = async () => {
    setSnackbarMessage('');
    setSnackbarType('error');
    setLoading(true);

    if (!email || !password) {
      setSnackbarMessage('Please fill in both fields.');
      setSnackbarVisible(true);
      setLoading(false);
      return;
    }

    try {
      const check = await checkCredentials(email, password);
      if (!email.includes('@')) {
        setSnackbarMessage('Invalid email');
        setSnackbarVisible(true);
      } else if (email !== '' && password !== '' && check) {
        setSnackbarMessage('Registered successfully');
        setSnackbarType('success');
        setSnackbarVisible(true);
        setUserId(email);
      } else if (!check) {
        setSnackbarMessage('Invalid Email or password');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
          <StatusBar backgroundColor='#1338be' barStyle='light-content' />
         
            <View
              style={{
                width: '100%',
                marginTop: '30%',
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
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: '10%' }}>
                <Text style={{ fontSize: 30, fontFamily: 'RobotoSlab-Black', color: 'black' }}>
                  Welcome Back!
                </Text>
                <Text style={{ fontSize: 15, fontFamily: 'RobotoSlab-Bold', marginBottom: 30 }}>
                  Fill in the credentials to Login
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email"
                  activeOutlineColor={colors.primary}
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
                  label="Password"
                  activeOutlineColor={colors.primary}
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
                      icon={props => <Icon {...props} name={passwordVisible ? "eye" : "eye-with-line"} />}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  }
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleLogin}
                  style={[styles.button, styles.buttonOutline]}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size={24} color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', paddingTop: 10 }}
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={{ fontSize: 17, color: 'black' }}>Not a user? </Text>
                  <Text style={{ fontSize: 18, color: '#1338be', fontWeight: '700' }}>
                    Click here
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{ flexDirection: 'row', paddingTop: 10 }}
                onPress={() => navigation.navigate('Forgot')}
              >
                <Text style={{ fontSize: 17, color: 'black' }}>Forgot Password? </Text>
              </TouchableOpacity>
            </View>
            </View>
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

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    gap: 30,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 15,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
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
