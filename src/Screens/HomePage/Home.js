import { ScrollView, StatusBar, StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { Avatar } from 'react-native-paper';
import colors from '../../assests/colors';
import { CalendarList } from 'react-native-calendars';

const Home = () => {
  const [date, setDate] = React.useState(new Date());

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content' />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primary, padding: 20 }}>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>User Name</Text>
        </View>
        <Avatar.Text size={50} labelStyle={{ color: colors.primary }} label="S" style={{ backgroundColor: 'white', borderWidth: 1, justifyContent: 'center', borderColor: 'white' }} />
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View >
          <CalendarList
            calendarHeight={150}
            calendarWidth={230}
            pastScrollRange={3}
            futureScrollRange={3}
            showScrollIndicator
            scrollEnabled={true}
            style={{paddingBottom:50}}
          />
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ backgroundColor: 'yellow', margin: 10, borderRadius: 8, padding: 5, paddingHorizontal: 10, gap: 40 }}>
            <Text>event 1</Text>
            <Text>event 2</Text>
            <Text>event 3</Text>
            <Text>event 4</Text>
            <Text>event 5</Text>
            <Text>event 6</Text>
            <Text>event 7</Text>
            <Text>event 8</Text>
            <Text>event 9</Text>
            <Text>event 10</Text>
            <Text>event 11</Text>
          </View>
          <View style={{ backgroundColor: 'yellow', margin: 10, borderRadius: 8, padding: 5, paddingHorizontal: 10 }}>
            <Text>event 1</Text>
            <Text>event 2</Text>
          </View>
          <View style={{ backgroundColor: 'yellow', margin: 10, borderRadius: 8, padding: 5, paddingHorizontal: 10 }}>
            <Text>event 1</Text>
            <Text>event 2</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({});
