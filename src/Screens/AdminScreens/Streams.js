import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import colors from '../../assests/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB, Dialog, Portal, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fetchStreamData, deleteStream } from '../../../Backend/AdminAPICalls';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const Streams = () => {
  const navigation = useNavigation();
  const [streams, setStreams] = useState([]);
  const [call, setCall] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedStreamId, setSelectedStreamId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await fetchStreamData();
        setStreams(data);
      };

      fetchData();
    }, [call])
  );

  const handleDelete = (streamId) => {
    setSelectedStreamId(streamId);
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    const isSuccess = await deleteStream(selectedStreamId);
    if (isSuccess) {
      setStreams((prevStreams) => prevStreams.filter(stream => stream.id !== selectedStreamId));
      Alert.alert('Success', 'Stream deleted successfully');
    } else {
      Alert.alert('Error', 'Failed to delete stream');
    }
    setDialogVisible(false);
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.header}>Streams</Text>
        <View style={styles.streamsContainer}>
          {streams.map((stream, index) => (
            <View key={index} style={styles.streamButton}>
              <Text style={styles.streamTitle}>{stream.stream}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.streamDetails}>Departments: {stream.departmentsCount}</Text>
                <Text style={styles.streamDetails}>Semester: {stream.semester}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconStyle} onPress={() => {
                  setCall(!call);
                  navigation.navigate('EditStream', { stream });
                }}>
                  <Text style={{ color: colors.black }}>
                    Edit
                  </Text>
                  <Icon name="pencil" size={18} color={colors.black} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconStyle} onPress={() => handleDelete(stream.id)}>
                  <Text style={{ color: colors.black }}>
                    Delete
                  </Text>
                  <Icon name="trash" size={18} color={colors.black} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          setCall(!call);
          navigation.navigate('AddDepartment');
        }}
        color={colors.white}
      />
      <Portal>
        <Dialog style={{backgroundColor:colors.lightBackground}} visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this stream?</Text>
          </Dialog.Content>
          <Dialog.Actions style={{justifyContent:'space-around'}}>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default Streams;

const styles = StyleSheet.create({
  header: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: 'bold',
    backgroundColor: colors.black
  },
  streamsContainer: {
    margin: 20,
    padding: 20,
    gap: 25,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 18
  },
  streamButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 20,
    borderColor: colors.white,
    backgroundColor: colors.black,
    gap: 8
  },
  streamTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  streamDetails: {
    color: colors.white,
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  iconStyle: {
    borderRadius: 4,
    padding: 8,
    flexDirection: 'row',
    backgroundColor: colors.white,
    gap: 15,
    marginVertical: 10
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
