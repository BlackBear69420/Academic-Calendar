import React from 'react';
import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import EventCard from './EventCard';
import { FAB } from 'react-native-paper';
import colors from '../../assests/colors';

const HomeScreen = ({navigation}) => {
  const events = [
    {
      date: new Date(2024, 5, 23),
      title: 'Annual Science Fair',
      description: 'Showcase of projects from various science departments.',
      department: 'Computer Science',
      stream: 'BE',
      semester: '1',
      type: 'Workshop',
    },
    {
      date: new Date(2024, 6, 15),
      title: 'Math Olympiad',
      description: 'Competitive event for mathematics enthusiasts.',
      department: 'dept',
      stream: 'MBA',
      semester: '1',
      type: 'Competition',
    },
    {
      date: new Date(2024, 7, 5),
      title: 'Art Exhibition',
      description: 'Display of artwork from students and faculty.',
      department: 'dept',
      stream: 'BCA',
      semester: '1',
      type: 'Exhibition',
    },
  ];

  const onEdit = (item)=>{
    navigation.navigate("AddEvent");
  };

  const onDelete = ()=>{

  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {events.map((event, index) => (
          <EventCard key={index} event={event} onEdit={onEdit} onDelete={onDelete}/>
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEvent')}
        color={colors.white}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    color: colors.white
  },
});

export default HomeScreen;
