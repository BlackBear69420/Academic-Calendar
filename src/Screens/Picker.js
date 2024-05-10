import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import { Datepicker, Layout, Text } from '@ui-kitten/components';

const Picker = () => {
  const [date, setDate] = useState(new Date())
  const [date2, setDate2] = useState(new Date());
  const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  useEffect(()=>{
    console.log(date)
  },[date])
  return (
    <Layout
      style={styles.container}
      level='1'
    >

      <Text category='h6'>
        {`Selected date: ${date2.toLocaleDateString()}`}
      </Text>

      <Datepicker
        date={date2}
        onSelect={nextDate => setDate2(nextDate)}
      />

    </Layout>
  )
}

export default Picker

const styles = StyleSheet.create({
  container: {
    padding:20
  },
})
