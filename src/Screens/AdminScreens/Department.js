import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert,ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import colors from '../../assests/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';
import Modal from 'react-native-modal';
import { addStreamHandler } from '../../../Backend/AdminAPICalls';
import { useNavigation } from '@react-navigation/native';

const Department = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sem, setSem] = useState(0);
  const [depts, setDepts] = useState([]);
  const [isTitleEditable, setTitleEditable] = useState(false);
  const [titleValue, setTitleValue] = useState('Edit Stream Name');
  const [editText, setEditText] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation=useNavigation()

  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      Alert.alert('Error', 'Input is required');
    } else {
      setDepts([...depts, inputValue]);
      setModalVisible(false);
      setInputValue('');
    }
  };

  const handleSubmitForm = async() => {
    setLoading(true);
    const formData = {
      stream: titleValue,
      semester: sem,
      departments: depts,
    };
    console.log(formData);
    const res = await addStreamHandler(formData);
    if(res){
      Alert.alert('Success',"Sucessfully added stream");
      navigation.goBack()
    }
    setLoading(false);
  }

  const handleDeletion = (index) => {
    const newDepts = [...depts];
    newDepts.splice(index, 1);
    setDepts(newDepts);
  };

  const handleEdit = (index, text) => {
    const newDepts = [...depts];
    newDepts[index] = text;
    setEditIndex(null);
    setEditText(false);
    setDepts(newDepts);
    setModalVisible(false);
    setInputValue('');
  };

  const incrementSem = () => {
    if (sem < 8) {
      setSem(sem + 1);
    }
  };

  const decrementSem = () => {
    if (sem > 0) {
      setSem(sem - 1);
    }
  };

  const handleTitleSubmit = () => {
    setTitleEditable(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {isTitleEditable ? (
          <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'space-around',gap:10 }}>
            <TextInput
              style={styles.editableTitle}
              value={titleValue}
              autoFocus={true}
              onChangeText={setTitleValue}
              width={250}
            />
              <TouchableOpacity style={{flexDirection:'row',gap:10,backgroundColor:colors.black,padding:8,borderRadius:4}} onPress={handleTitleSubmit}>
              <Text style={{color:colors.white}}>Save</Text>
              <Icon name="save" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{titleValue}</Text>
            <TouchableOpacity onPress={() => setTitleEditable(true)}>
              <Icon name="pencil" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.container}>
        <View style={styles.semesterContainer}>
          <Text style={styles.semesterTitle}>Semesters</Text>
          <View style={styles.semesterControls}>
            <TouchableOpacity
              style={styles.semesterButton}
              onPress={decrementSem}
            >
              <Icon name="minus" size={15} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.semesterText}>{sem}</Text>
            <TouchableOpacity
              style={styles.semesterButton}
              onPress={incrementSem}
            >
              <Icon name="plus" size={15} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          color={colors.white}
          label='Add department'
        />
        {depts.map((dept, index) => (
          <View key={index} style={styles.departmentContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletion(index)}
            >
              <Icon name="minus" size={15} color={colors.white} />
            </TouchableOpacity>
            <View>
              <Text style={styles.departmentText}>{dept}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setEditIndex(index);
                setEditText(true);
                setInputValue(dept);
                setModalVisible(true);
              }}
            >
              <Icon name="pencil" size={20} color={colors.white} />
              </TouchableOpacity>

          </View>
        ))}
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          {editText?<Text style={styles.modalTitle}>Edit Department</Text>:<Text style={styles.modalTitle}>Add Department</Text>}
          <TextInput
            style={[
              styles.input,
              isInputFocused && { borderColor: 'black', borderWidth: 2 }
            ]}
            placeholder="Enter Department name"
            value={inputValue}
            onChangeText={setInputValue}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <TouchableOpacity onPress={()=>{!editText?handleSubmit():handleEdit(editIndex, inputValue)}} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.footer}>
        <View >
          <TouchableOpacity onPress={handleSubmitForm} style={styles.submitButton}>
          {loading ? (
                    <ActivityIndicator size={24} color="white" />
                  ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
                  )}
          </TouchableOpacity>
        </View>
       
      </View>
    </View>
  );
}

export default Department;

const styles = StyleSheet.create({
  title: {
    color: colors.black,
    fontSize: 25,
    padding: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  editableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius:8,
    marginVertical:10,
  },
  container: {
    padding: 20,
    gap: 25,
    borderWidth: 2,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingBottom: 60,
    borderColor: colors.black
  },
  semesterContainer: {
    alignItems: 'center'
  },
  semesterTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold'
  },
  semesterControls: {
    flexDirection: 'row',
    gap: 40,
    paddingVertical: 10
  },
  semesterButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    borderColor: colors.black
  },
  semesterText: {
    fontSize: 25,
    textAlign: 'center',
    color: colors.black
  },
  departmentContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 20,
    borderColor: colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.black,
    marginTop: 10
  },
  deleteButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    borderColor: colors.white
  },
  departmentText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold'
  },
  fab: {
    backgroundColor: colors.black,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#F5F5F5',
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
    color: 'black',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: colors.black,
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal:80,
    elevation:5

  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent:'space-around',
    padding:10
  },
});
