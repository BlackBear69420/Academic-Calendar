import { Alert } from 'react-native';
url = `https://calenderapp-b6878-default-rtdb.firebaseio.com/`;

export const addEventHandler = async(formData) =>{
    const res1 = await fetch(
      `${url}eventDataForm.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );
     if(res1.ok){
      return true;
     }
     return false;
  }


  export const addStreamHandler = async (data) => {
    const fetchRes = await fetch(`${url}streamData.json`);
    const existingStreams = await fetchRes.json();
  
    const isDuplicate = Object.values(existingStreams).some(
      (streamData) => streamData.stream.toLowerCase() === data.stream.toLowerCase()
    );
  
    if (isDuplicate) {
      Alert.alert('Error', 'Stream already exists');
      return false;
    }
  
    const res = await fetch(
      `${url}streamData.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  
    if (res.ok) {
      return true;
    }
  
    return false;
  };
  
  export const fetchStreamData = async () => {
    try {
      const response = await fetch(`${url}streamData.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch stream data');
      }
      const data = await response.json();
  
      // Process the stream data
      const streams = Object.keys(data).map((key) => {
        const stream = data[key];
        const departmentsCount = stream.departments ? stream.departments.length : 0;
        const departments = stream.departments || [];
        return {
          id: key,
          stream: stream.stream.trim(),
          departmentsCount,
          departments,
          semester: stream.semester,
        };
      });
  
      return streams;
    } catch (error) {
      console.error('Error fetching stream data:', error);
      return [];
    }
  };

  export const deleteStream = async (streamId) => {
    try {
      const response = await fetch(`${url}streamData/${streamId}.json`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete stream');
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return false;
    }
  };

  export const editStream = async (streamId, newData) => {
    try {
      const response = await fetch(`${url}streamData/${streamId}.json`, {
        method: 'PATCH', // or 'PUT' depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit stream');
      }
  
      return true;
    } catch (error) {
      console.error('Error editing stream:', error);
      return false;
    }
  };
  
  export const fetchEventData = async () => {
    
    try {
      const response = await fetch(`${url}eventDataForm.json`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
  
      const data = await response.json();
  
      const eventsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      return eventsArray;
    } catch (error) {
      console.error('Error fetching event data:', error);
      return [];
    }
  };

  export const editEvent = async (eventId, updatedEvent) => {
  
    try {
      const response = await fetch(`${url}eventDataForm/${eventId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit event');
      }
  
      return true;
    } catch (error) {
      console.error('Error editing event:', error);
      return false;
    }
  };
  
  export const deleteEvent = async (eventId) => {
  
    try {
      const response = await fetch(`${url}eventDataForm/${eventId}.json`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };
  
  export const fetchStreamDataArray = async () => {
  
    try {
      const response = await fetch(`${url}streamData.json`);
  
      if (!response.ok) {
        throw new Error('Failed to fetch stream data');
      }
  
      const data = await response.json();
  
      // Process the stream data
      const streams = Object.keys(data).map(key => {
        const stream = data[key];
        return {
          id: key,
          stream: stream.stream.trim(),
          departments: stream.departments || ['no departments'],
          semester: stream.semester,
        };
      });

      return { streams };
    } catch (error) {
      console.error('Error fetching stream data:', error);
      return { streams: [], streamsWithDepartments: [], streamsWithoutDepartments: [] };
    }
  };
  