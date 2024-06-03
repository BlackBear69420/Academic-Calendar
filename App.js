import React, { useContext, useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { UserContext, UserProvider } from './UserContext';
import AuthNavigation from './Navigation/AuthNavigation';
import StudentNav from './Navigation/StudentNav';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import AdminNav from './Navigation/AdminNav';
import { getRole } from './Backend/InAppStore';
import { AdminTab } from './Navigation/AdminTab';

function AppWrapper() {
  const isDarkMode = useColorScheme() === 'dark';
  const { userId } = useContext(UserContext);
  const [role, setRole] = useState(null);

  const fetchRole = async()=>{
    if(userId){
      const r = await getRole();
      setRole(r);
    }
  }


  useEffect(()=>{
    fetchRole();
  },[userId]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      {userId && role ? (role=== 'admin'?<AdminNav/>: <StudentNav />) : <AuthNavigation />}
    </View>
  );
}

const App = () => {
  return (
    <UserProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppWrapper />
      </ApplicationProvider>
    </UserProvider>
  );
};

export default App;
