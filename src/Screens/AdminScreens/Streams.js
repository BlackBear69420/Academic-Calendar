import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import colors from '../../assests/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

const Streams = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      Alert.alert('Error', 'Input is required');
    } else {
      console.log(inputValue);
      setModalVisible(false);
      setInputValue('');
    }
  };

  const streams = [
    { name: 'BE', departments: 5 },
    { name: 'MCA', departments: 5 },
    { name: 'MBA', departments: 5 },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Streams</Text>
      <View style={styles.streamsContainer}>
        {streams.map((stream, index) => (
          <View key={index} style={styles.streamButton}>
            <View>
              <Text style={styles.streamTitle}>{stream.name}</Text>
              <Text style={styles.streamDetails}>Departments: {stream.departments}</Text>
            </View>
            <TouchableOpacity onPress={()=> navigation.navigate('AddDepartment')}>
                <Icon name="pencil" size={20} color={colors.white} style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        color={colors.white}
      />
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add stream</Text>
          <TextInput
            style={[
              styles.input,
              isInputFocused && { borderColor: colors.black, borderWidth: 2 }
            ]}
            placeholder="Enter stream name"
            placeholderTextColor={colors.grey}
            value={inputValue}
            onChangeText={setInputValue}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default Streams;

const styles = StyleSheet.create({
  header: {
    color: colors.black,
    fontSize: 25,
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: 'bold'
  },
  streamsContainer: {
    margin: 20,
    padding: 20,
    gap: 25,
    borderWidth:1,
    borderColor:colors.black,
    borderRadius:18
  },
  streamButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 20,
    borderColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:colors.black
  },
  streamTitle: {
    color: colors.white,
    fontSize: 25,
    fontWeight: 'bold'
  },
  streamDetails: {
    color: colors.white,
    fontSize: 16,
  },
  iconStyle: {
    borderWidth: 2,
    borderRadius: 50,
    padding: 15,
    borderColor: colors.white
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    color: colors.white
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: colors.lightBackground,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 550,
    minHeight: 200,
    paddingHorizontal: 40
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: colors.black,
  },
  input: {
    borderColor: colors.black,
    borderWidth: 1,
    marginVertical: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: colors.grey
  },
  submitButton: {
    backgroundColor: colors.black,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 40
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
