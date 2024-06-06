import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import EventCard from './EventCard';
import { FAB } from 'react-native-paper';
import colors from '../../assests/colors';
import { fetchEventData, deleteEvent, fetchStreamDataArray } from '../../../Backend/AdminAPICalls';
import { useFocusEffect } from '@react-navigation/native';
import { logout } from '../../../Backend/InAppStore';

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(null);
  const [events, setEvent] = useState(null);
  const [call, setCall] = useState(true);

  const onEdit = (item) => {
    setCall(!call);
    navigation.navigate("EditEvent", { item });
  };

  const onDelete = async (eventId) => {
    const success = await deleteEvent(eventId);
    if (success) {
      setEvent(events.filter(event => event.id !== eventId));
    }
  };

  const filterEvents = (category) => {
    setSelectedCategory(category);
  };

  const transformStreamName = (streamName) => {
    const ignoreWords = ["of", "in"];
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

      console.log('Transformed streams:', transformedStreams);

        const uniqueCategories = ['All', ...new Set(transformedStreams.map(stream => stream.stream))];
        console.log(uniqueCategories);
        setCategories(uniqueCategories);
      };
      fetchData();
    }, [call])
  );

  const filteredEvents = selectedCategory === 'All' ? events : events?.filter(event => transformStreamName(event.stream) === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.black} barStyle='light-content'></StatusBar>
      <View style={styles.categoryFilter}>
        {categories?.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
            onPress={() => filterEvents(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {events && filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <EventCard key={index} event={event} onEdit={() => onEdit(event)} onDelete={() => onDelete(event.id)} />
          ))
        ) : (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>
              No Data Found
            </Text>
          </View>
        )}
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
    backgroundColor:colors.lightBackground,
  },
  categoryFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: colors.black,
    elevation: 2,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectedCategoryButton: {
    backgroundColor: colors.white,
  },
  categoryText: {
    fontSize: 16,
    color: colors.white,
  },
  selectedCategoryText: {
    color: colors.black,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  noDataText: {
    color: colors.black,
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
    color: colors.white,
  },
});

export default HomeScreen;
