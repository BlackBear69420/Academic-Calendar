import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import EventCard from './EventCard';
import { FAB } from 'react-native-paper';
import colors from '../../assests/colors';
import { fetchEventData, deleteEvent, fetchStreamDataArray } from '../../../Backend/AdminAPICalls';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(null);
  const [events, setEvent] = useState(null);
  const [call, setCall] = useState(true);

  const onEdit = (item)=>{
    setCall(!call);
    navigation.navigate("EditEvent", {item});
  };

  const onDelete = async (eventId) => {
    const success = await deleteEvent(eventId);
    if (success) {
      setEvent(events.filter(event => event.id !== eventId));
    }
  };


  const filterEvents = (category) => {
    setSelectedCategory(category);
  }

  const transformStreamName = (streamName) => {
    const ignoreWords = ["of","in"];
    return streamName
      .split(" ")
      .filter(word => !ignoreWords.includes(word.toLowerCase()))
      .map(word => word.charAt(0))
      .join("");
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const res = await fetchEventData();
        setEvent(res);
        const streamRes = await fetchStreamDataArray();
        console.log(streamRes);
        const transformedStreams = streamRes?.streams.map(stream => ({
          stream: transformStreamName(stream.stream),
        }));

        console.log(transformedStreams);

        const uniqueCategories = ['All', ...new Set(transformedStreams.map(stream => stream.stream))];
        console.log(uniqueCategories);
        setCategories(uniqueCategories);
      };
      fetchData();
    }, [call])
  );

  const filteredEvents = selectedCategory === 'All' ? events : events?.filter(event => event.stream === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoryFilter}>
        {categories?.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
            onPress={() => filterEvents(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {events?filteredEvents.map((event, index) => (
          <EventCard key={index} event={event} onEdit={()=>{onEdit(event)}} onDelete={()=>{onDelete(event.id)}}/>
        )):<></>}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
            setCall(!call);
            navigation.navigate('AddEvent',{setCall, call})
        }}
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
  categoryFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: colors.white,
    elevation: 2,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: colors.black,
  },
  categoryText: {
    fontSize: 16,
    color: colors.black,
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
