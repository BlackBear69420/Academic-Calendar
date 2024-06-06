import { ScrollView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import colors from '../../assests/colors';
import { Calendar } from 'react-native-calendars';
import { fetchFilterEvents } from '../../../Backend/StudentAPICalls';
import { getUserdata, logout } from '../../../Backend/InAppStore';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging'

const Home = () => {
  const [date, setDate] = React.useState(new Date());
  const [eventData, setEventData] = React.useState([]);
  const [userData, setUserData] = React.useState(null);
  const navigation = useNavigation();

  const transformStreamName = (streamName) => {
    const ignoreWords = ["of", "in"];
    return streamName
      .split(" ")
      .filter(word => !ignoreWords.includes(word.toLowerCase()))
      .map(word => word.charAt(0))
      .join("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserdata();
      console.log('data', user);
      setUserData(user);
      const stream = user.stream;
      const data = await fetchFilterEvents(stream, user.dept, user.sem);
      console.log('Event data', data);
      setEventData(data);
    };
    fetchData();
  }, []);

  // Predefined colors for event types
  const eventColors = {
    'Competition': '#F4A259',
    'Workshop': '#BC4B51',
    'Fest': '#BC4B51',
    'Exam': '#FF4500',
    'Industry Visit': '#BC4B51'
  };

  const getMarkedDates = (events) => {
    let markedDates = {};

    events.forEach(event => {
      const color = eventColors[event.type] || '#000000'; // Default to black if type is not found
      const { startDate, endDate } = event.range;

      if (startDate && endDate) {
        let currentDate = new Date(startDate);
        const end = new Date(endDate);

        while (currentDate <= end) {
          const formattedDate = currentDate.toISOString().split('T')[0];

          markedDates[formattedDate] = {
            ...markedDates[formattedDate],
            color,
            textColor: 'white',
            startingDay: currentDate.toISOString().split('T')[0] === startDate,
            endingDay: currentDate.toISOString().split('T')[0] === endDate
          };

          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else if (startDate) {
        const formattedDate = new Date(startDate).toISOString().split('T')[0];
        markedDates[formattedDate] = {
          color,
          textColor: 'white',
          startingDay: true,
          endingDay: true
        };
      }
    });

    return markedDates;
  };

  // Processed markedDates
  const markedDates = getMarkedDates(eventData);

  // Group events by type
  const groupedEvents = eventData.reduce((acc, event) => {
    (acc[event.type] = acc[event.type] || []).push(event);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1,backgroundColor:colors.lightBackground }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors.primary,
          padding: 10,
          paddingHorizontal:30
        }}>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>
            {userData ? userData.usn : 'User Name'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { userData })} style={{padding:2,borderWidth:2,borderColor:'white',borderRadius:50}}>
          <Avatar.Text
            size={50}
            labelStyle={{ color: colors.primary }}
            label={userData ? userData.email.charAt(0).toUpperCase() : 'S'}
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              justifyContent: 'center',
              borderColor: 'white',
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: '100%', padding: 20 }}>
          <Calendar
            style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 10 }}
            initialNumToRender={10}
            markingType={'period'}
            markedDates={markedDates}
          />
        </View>
      </View>
      <ScrollView
        horizontal
        style={{ flexDirection: 'row', width: '100%' }}>
        {Object.keys(groupedEvents).map((eventType, index) => (
          <ScrollView key={index} style={{ margin: 10 }}>
            <Text style={{ color: eventColors[eventType], fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
              {eventType}
            </Text>
            {groupedEvents[eventType].map((event, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: 'white',
                  marginBottom: 10,
                  borderRadius: 8,
                  padding: 10,
                  borderWidth: 2,
                  borderColor: eventColors[event.type],
                }}>
                <Text style={{ color: eventColors[event.type], fontWeight: 'bold', fontSize: 16 }}>
                  {event.title}
                </Text>
                <Text style={{ color: eventColors[event.type], fontSize: 14 }}>
                  {new Date(event.range.startDate).toDateString()}
                </Text>
                <Text style={{ color: eventColors[event.type], fontSize: 14 }}>
                  {event.time}
                </Text>
              </View>
            ))}
          </ScrollView>
        ))}
      </ScrollView>
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({});
