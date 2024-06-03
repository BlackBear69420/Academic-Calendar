import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../assests/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fetchStreamData, deleteStream } from '../../../Backend/AdminAPICalls';

const Streams = () => {
  const navigation = useNavigation();
  const [streams, setStreams] = useState([]);
  const [call, setCall] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStreamData();
      setStreams(data);
    };

    fetchData();
  }, [call]);

  const handleDelete = async (streamId) => {
    const isSuccess = await deleteStream(streamId);
    if (isSuccess) {
      setStreams((prevStreams) => prevStreams.filter(stream => stream.id !== streamId));
      Alert.alert('Success', 'Stream deleted successfully');
    } else {
      Alert.alert('Error', 'Failed to delete stream');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Streams</Text>
      <View style={styles.streamsContainer}>
        {streams.map((stream, index) => (
          <View key={index} style={styles.streamButton}>
            <View>
              <Text style={styles.streamTitle}>{stream.stream}</Text>
              <Text style={styles.streamDetails}>Departments: {stream.departmentsCount}</Text>
              <Text style={styles.streamDetails}>Semester: {stream.semester}</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => {
                setCall(!call);
                navigation.navigate('EditStream', { stream })
                }}>
                <Icon name="pencil" size={18} color={colors.white} style={styles.iconStyle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(stream.id)}>
                <Icon name="trash" size={18} color={colors.white} style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() =>{ 
          setCall(!call);
          navigation.navigate('AddDepartment')
        }}
        color={colors.white}
      />
    </View>
  );
};

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
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 18
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
    backgroundColor: colors.black
  },
  streamTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold'
  },
  streamDetails: {
    color: colors.white,
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconStyle: {
    borderWidth: 2,
    borderRadius: 40,
    padding: 6,
    borderColor: colors.white,
    marginLeft: 10
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
