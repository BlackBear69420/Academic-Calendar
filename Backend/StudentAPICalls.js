import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveRole } from "./InAppStore";

url = `https://calenderapp-b6878-default-rtdb.firebaseio.com/`;

export const signupHandler = async(email,
  password,
  role,
  usn,
  phoneNumber,
  department,
  sem,
  stream
) =>{
    const res = await fetch(
      `${url}studentData.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
          usn,
          phoneNumber,
          department,
          sem,
          stream
        }),
      }
    );
     if(res.ok){
      return true;
     }
     return false;
  }

export const checkUSNExists = async(usnToCheck) => {  
    try {
      const response = await fetch(`${url}studentData.json`);
      const data = await response.json();
  
      let usnExists = false;
  
      for (let key in data) {
        if (data[key].usn === usnToCheck) {
          usnExists = true;
          break;
        }
      }
  
      if (usnExists) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


export const checkCredentials = async(emailToCheck, passwordToCheck) => {
  
    try {
      const response = await fetch(`${url}studentData.json`);
      const data = await response.json();
  
      let loginSuccessful = false;
  
      for (let key in data) {
        if (data[key].email === emailToCheck && data[key].password === passwordToCheck) {
          loginSuccessful = true;
          const role = data[key].role;

          await saveRole(role, data[key]);
          break;
        }
      }
  
      if (loginSuccessful) {
        console.log(`Login successful for email: ${emailToCheck}`);
        return true;
      } else {
        console.log(`Invalid email or password for email: ${emailToCheck}`);
        return false;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  }

  export const fetchFilterEvents = async(stream, dept, sem) => {
    try {
      const response = await fetch(`${url}eventDataForm.json`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
  
      const data = await response.json();
  
      const eventsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      if(dept === 'no departments'){
        return eventsArray.filter(event => 
          event.stream === stream && 
          event.sem === sem
        );
      }
      return eventsArray.filter(event => 
        event.stream === stream && 
        event.dept === dept && 
        event.sem === sem
      );    } catch (error) {
      console.error('Error fetching event data:', error);
      return [];
    }
    
  };