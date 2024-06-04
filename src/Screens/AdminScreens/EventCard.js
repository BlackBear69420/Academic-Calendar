import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../assests/colors';

const EventCard = ({ event, onEdit, onDelete }) => {
  const { title, description, dept, stream, sem, type } = event;
  const date = event.range.startDate;
  const day =  date.slice(-2);
  const suffix = getDaySuffix(day);

  return (
    <View style={styles.cardContainer}>
      
      <View style={styles.contentContainer}>
        <Text style={styles.eventTitle}>{title}</Text>
        <View style={styles.dateContainer}>
        <Text style={styles.largeDate}>{date}</Text>
      </View>
        <Text style={styles.eventDetails}>{description}</Text>
        <View style={styles.inlineDetails}>
        <Text style={styles.eventDetails}>Stream: {stream}</Text>
          <Text style={styles.eventDetails}>{dept}</Text>
        </View>
        <View style={styles.inlineDetails}>
          <Text style={styles.eventDetails}>Semester: {sem}</Text>
          <Text style={styles.eventDetails}>Type: {type?type: "Type"}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => onEdit(event)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => onDelete(event)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  largeDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  smallSuffix: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetails: {
    fontSize: 14,
    color: colors.black,
    marginTop: 5,
  },
  inlineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent:'space-between'
  },
  button: {
    padding: 10,
    borderRadius: 5,
    paddingHorizontal:20,
    minWidth:80,
    alignItems:'center'
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#ff6666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EventCard;
