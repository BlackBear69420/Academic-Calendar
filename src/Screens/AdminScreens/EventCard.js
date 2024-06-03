import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EventCard = ({ event, onEdit, onDelete }) => {
  const { title, description, dept, stream, sem, type } = event;
  const date = event.range.startDate;
  const day =  date.slice(-2);
  const suffix = getDaySuffix(day);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.largeDate}>{day}</Text>
        <Text style={styles.smallSuffix}>{suffix}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventDetails}>{description}</Text>
        <View style={styles.inlineDetails}>
          <Text style={styles.eventDetails}>Department: {dept}</Text>
          <Text style={styles.eventDetails}>Stream: {stream}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  largeDate: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 72,
  },
  smallSuffix: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  contentContainer: {
    marginLeft: 20,
    flex: 1,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetails: {
    fontSize: 13,
    color: '#666',
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
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
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
