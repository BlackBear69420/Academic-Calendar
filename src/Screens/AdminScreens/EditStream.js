import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import colors from '../../assests/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';
import Modal from 'react-native-modal';
import { addStreamHandler, editStream } from '../../../Backend/AdminAPICalls';

const EditStream = (props) => {
  const data = props.route.params.stream;
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sem, setSem] = useState(data.semester);
  const [depts, setDepts] = useState(data.departments?data.departments:[]);
  const [isTitleEditable, setTitleEditable] = useState(false);
  const [titleValue, setTitleValue] = useState(data.stream);
  const [editText, setEditText] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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
    const formData = {
      stream: titleValue,
      semester: sem,
      departments: depts,
    };
    console.log(formData);
    const res = await editStream(data.id, formData);
    if(res){
      Alert.alert("Sucessfully added stream");
    }
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styles.editableTitle}
              value={titleValue}
              onChangeText={setTitleValue}
            />
            <TouchableOpacity onPress={handleTitleSubmit}>
              <Icon name="save" size={20} color={colors.black} />
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
        <View style={{flex:0.7}}>
          <TouchableOpacity onPress={handleSubmitForm} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
      </View>
    </View>
  );
}

export default EditStream;

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
    padding: 20,
    borderBottomWidth: 1,
    borderColor: colors.black,
    marginRight: 10,
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
    backgroundColor: '#F0F8FF',
    color: '#007FFF',
    height:60
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
    backgroundColor: '#007FFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 40,
    paddingHorizontal: 40,
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
    justifyContent:'space-between',
    padding: 20,
    backgroundColor: '#F0F8FF',
  },
});
