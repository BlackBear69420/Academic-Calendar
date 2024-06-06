import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../assests/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB, Dialog, Portal, Button, ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import { addStreamHandler, deleteSemRelatedData, editStream, editStreamTitleRelatedData } from '../../../Backend/AdminAPICalls';

const EditStream = (props) => {
  const data = props.route.params.stream;
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sem, setSem] = useState(data.semester);
  const [depts, setDepts] = useState(data.departments ? data.departments : []);
  const [isTitleEditable, setTitleEditable] = useState(false);
  const [titleValue, setTitleValue] = useState(data.stream);
  const [editText, setEditText] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [missingDepts, setMissingDepts] = useState([]);
  const [editedDepts, setEditedDepts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(
      data.stream !== titleValue ||
      data.semester !== sem ||
      data.departments.length !== depts.length ||
      JSON.stringify(data.departments) !== JSON.stringify(depts)
    );
  }, [titleValue, sem, depts]);

  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      Alert.alert('Error', 'Input is required');
    } else {
      setDepts([...depts, inputValue]);
      setModalVisible(false);
      setInputValue('');
    }
  };

  const handleSubmitForm = async () => {
    setLoading(true);
    const formData = {
      stream: titleValue,
      semester: sem,
      departments: depts,
    };
    console.log(formData);
    if (data.stream !== titleValue) {
      await editStreamTitleRelatedData(data.stream, titleValue);
    }
    const res = await editStream(data.id, formData, data.stream, missingDepts, editedDepts);

    if (res) {
      Alert.alert("Successfully updated stream");
    }
    setLoading(false);
  }

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setDialogVisible(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newDepts = [...depts];
      const newMissingData = [...missingDepts];
      newMissingData.push(depts[deleteIndex]);
      setMissingDepts(newMissingData);

      newDepts.splice(deleteIndex, 1);
      setDepts(newDepts);
    }
    setDialogVisible(false);
    setDeleteIndex(null);
  };

  const isEdited = (text) => editedDepts.find(item => item.new === text);

  const handleEdit = (index, text) => {
    const editedDataDept = [...editedDepts];
    editedDataDept.push({
      new: text,
      old: depts[index],
    })
    setEditedDepts(editedDataDept);
    console.log(editedDataDept);

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
    if (sem > data.semester) {
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', gap: 10 }}>
            <TextInput
              style={styles.editableTitle}
              value={titleValue}
              autoFocus={true}
              onChangeText={setTitleValue}
              width={250}
            />
            <TouchableOpacity style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.black, padding: 8, borderRadius: 4 }} onPress={handleTitleSubmit}>
              <Text style={{ color: colors.white }}>Save</Text>
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
        label='Add Department'
      />
        {depts.map((dept, index) => (
          <View key={index} style={styles.departmentContainer}>
            <View>
              <Text style={styles.departmentText}>{dept}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(index)}
              >
                <Text style={{ color: colors.black, fontSize: 15 }}>Delete</Text>
                <Icon name="trash" size={18} color={colors.black} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  if (!isEdited(dept)) {
                    setEditIndex(index);
                    setEditText(true);
                    setInputValue(dept);
                    setModalVisible(true);
                  }
                }}
              >
                <Text style={{ color: colors.black, fontSize: 15 }}>Edit</Text>
                <Icon name="pencil" size={18} color={colors.black} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          {editText ? <Text style={styles.modalTitle}>Edit Department</Text> : <Text style={styles.modalTitle}>Add Department</Text>}
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
          <TouchableOpacity onPress={() => { !editText ? handleSubmit() : handleEdit(editIndex, inputValue) }} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    
      <Portal>
        <Dialog style={{ backgroundColor: colors.lightBackground }} visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this department?</Text>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: 'space-around' }}>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {hasChanges && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSubmitForm} style={styles.submitButton} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
   
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
    textAlign: 'center',
    maxWidth: '100%'
  },
  editableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 8,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 8,
    marginVertical: 10,
  },
  container: {
    padding: 20,
    gap: 15,
    borderWidth: 2,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingBottom: 60,
    borderColor: colors.black
  },
  semesterContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  semesterTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold'
  },
  semesterControls: {
    flexDirection: 'row',
    gap: 20,
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
    borderRadius: 8,
    padding: 15,
    backgroundColor: colors.black,
    gap: 15
  },
  deleteButton: {
    borderRadius: 4,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.white
  },
  departmentText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  fab: {
    backgroundColor: colors.black,
    color: colors.white,
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
    paddingVertical: 14,
    borderRadius: 8,
    paddingHorizontal: 40,
    elevation: 5
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
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
});
