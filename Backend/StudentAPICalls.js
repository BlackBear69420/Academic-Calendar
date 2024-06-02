import { saveRole } from "./InAppStore";

url = `https://calenderapp-b6878-default-rtdb.firebaseio.com/`;

export const signupHandler = async(email,
  password,
  role,
  usn,
  phoneNumber,
  department,
  sem,) =>{
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
          await saveRole(role);
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