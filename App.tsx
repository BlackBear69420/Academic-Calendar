import { StyleSheet, View } from 'react-native'
import React from 'react'
import Picker from './src/Screens/Picker'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import AddEvent from './src/Screens/AddEvent';
import { enGB, registerTranslation } from 'react-native-paper-dates'



const App = () => {
  registerTranslation('en-GB', enGB)
  return (
<ApplicationProvider {...eva} theme={eva.light}>
  
      <AddEvent/>
    </ApplicationProvider>
  )
}

export default App

const styles = StyleSheet.create({})