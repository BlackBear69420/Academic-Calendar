import { Alert } from 'react-native';
import { sendMessageEvent } from './Notification';
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
      await sendMessageEvent(formData);
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
      // Fetch the stream to get its name
      const streamResponse = await fetch(`${url}streamData/${streamId}.json`);
      if (!streamResponse.ok) {
        throw new Error('Failed to fetch stream data');
      }
      const streamData = await streamResponse.json();
      const streamName = streamData.stream;
  
      // Fetch all students
      const studentsResponse = await fetch(`${url}studentData.json`);
      if (!studentsResponse.ok) {
        throw new Error('Failed to fetch students');
      }
      const studentsData = await studentsResponse.json();
  
      // Filter students that have the same stream as the one being deleted
      const studentIdsToDelete = Object.keys(studentsData).filter(studentId => studentsData[studentId].stream === streamName);
  
      // Delete each filtered student
      const deleteStudentPromises = studentIdsToDelete.map(studentId => {
        return fetch(`${url}studentData/${studentId}.json`, { method: 'DELETE' });
      });
  
      // Wait for all student deletions to complete
      const deleteStudentResponses = await Promise.all(deleteStudentPromises);
      if (deleteStudentResponses.some(response => !response.ok)) {
        throw new Error('Failed to delete one or more students');
      }
  
      // Fetch all events
      const eventsResponse = await fetch(`${url}eventDataForm.json`);
      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events');
      }
      const eventsData = await eventsResponse.json();
  
      // Filter events that have the same stream as the one being deleted
      const eventIdsToDelete = Object.keys(eventsData).filter(eventId => eventsData[eventId].stream === streamName);
  
      // Delete each filtered event
      const deleteEventPromises = eventIdsToDelete.map(eventId => {
        return fetch(`${url}eventDataForm/${eventId}.json`, { method: 'DELETE' });
      });
  
      // Wait for all event deletions to complete
      const deleteEventResponses = await Promise.all(deleteEventPromises);
      if (deleteEventResponses.some(response => !response.ok)) {
        throw new Error('Failed to delete one or more events');
      }
  
      // Delete the stream
      const streamDeleteResponse = await fetch(`${url}streamData/${streamId}.json`, { method: 'DELETE' });
      if (!streamDeleteResponse.ok) {
        throw new Error('Failed to delete stream');
      }
  
      return true;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return false;
    }
  };
  

  export const editStream = async (streamId, newData,streamName, depts, editedDepts) => {
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
      await deletedepartmentRelatedData(streamName,depts);
      await editdepartmentRelatedData(streamName, editedDepts);
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


  
  
  export const deletedepartmentRelatedData = async (streamName,dept) => {
    try {
  
      // Fetch all students
      const studentsResponse = await fetch(`${url}studentData.json`);
      if (!studentsResponse.ok) {
        throw new Error('Failed to fetch students');
      }
      const studentsData = await studentsResponse.json();
  
      // Filter students that have the same stream as the one being deleted
      const studentIdsToDelete = Object.keys(studentsData).filter(studentId => studentsData[studentId].stream === streamName && dept.includes(studentsData[studentId].department) );
  
      // Delete each filtered student
      const deleteStudentPromises = studentIdsToDelete.map(studentId => {
        return fetch(`${url}studentData/${studentId}.json`, { method: 'DELETE' });
      });
  
      // Wait for all student deletions to complete
      const deleteStudentResponses = await Promise.all(deleteStudentPromises);
      if (deleteStudentResponses.some(response => !response.ok)) {
        throw new Error('Failed to delete one or more students');
      }
  
      // Fetch all events
      const eventsResponse = await fetch(`${url}eventDataForm.json`);
      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events');
      }
      const eventsData = await eventsResponse.json();
  
      // Filter events that have the same stream as the one being deleted
      const eventIdsToDelete = Object.keys(eventsData).filter(eventId => eventsData[eventId].stream === streamName && dept.includes(eventsData[eventId].dept));
  
      // Delete each filtered event
      const deleteEventPromises = eventIdsToDelete.map(eventId => {
        return fetch(`${url}eventDataForm/${eventId}.json`, { method: 'DELETE' });
      });
  
      // Wait for all event deletions to complete
      const deleteEventResponses = await Promise.all(deleteEventPromises);
      if (deleteEventResponses.some(response => !response.ok)) {
        throw new Error('Failed to delete one or more events');
      }
  
  
      return true;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return false;
    }
  };


  export const editdepartmentRelatedData = async (streamName, editedDepts) => {
    try {
  
      const isEdited = (text) => editedDepts.find(item => item.old === text);

    // Fetch all students
    const studentsResponse = await fetch(`${url}studentData.json`);
    if (!studentsResponse.ok) {
      throw new Error('Failed to fetch students');
    }
    const studentsData = await studentsResponse.json();

    // Filter students that have the same stream and department to be edited
    const studentIdsToEdit = Object.keys(studentsData).filter(studentId => 
      studentsData[studentId].stream === streamName && isEdited(studentsData[studentId].department)
    );

    // Edit the studentsData[studentId].department to item.new for each filtered student
    studentIdsToEdit.forEach(studentId => {
      const editedDept = isEdited(studentsData[studentId].department);
      if (editedDept) {
        studentsData[studentId].department = editedDept.new;
      }
    });

    // Save the updated students data back to the server
    const updateStudentsResponse = await fetch(`${url}studentData.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentsData)
    });

    if (!updateStudentsResponse.ok) {
      throw new Error('Failed to update students data');
    }

    // Fetch all events
    const eventsResponse = await fetch(`${url}eventDataForm.json`);
    if (!eventsResponse.ok) {
      throw new Error('Failed to fetch events');
    }
    const eventsData = await eventsResponse.json();

    // Filter events that have the same stream and department to be edited
    const eventIdsToEdit = Object.keys(eventsData).filter(eventId => 
      eventsData[eventId].stream === streamName && isEdited(eventsData[eventId].dept)
    );

    // Edit the eventsData[eventId].dept to item.new for each filtered event
    eventIdsToEdit.forEach(eventId => {
      const editedDept = isEdited(eventsData[eventId].dept);
      if (editedDept) {
        eventsData[eventId].dept = editedDept.new;
      }
    });

    // Save the updated events data back to the server
    const updateEventsResponse = await fetch(`${url}eventDataForm.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventsData)
    });

    if (!updateEventsResponse.ok) {
      throw new Error('Failed to update events data');
    }
  
  
      return;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return;
    }
  };


  export const editStreamTitleRelatedData = async (streamName, newStreamName) => {
    try {
  

    // Fetch all students
    const studentsResponse = await fetch(`${url}studentData.json`);
    if (!studentsResponse.ok) {
      throw new Error('Failed to fetch students');
    }
    const studentsData = await studentsResponse.json();

    // Filter students that have the same stream and department to be edited
    const studentIdsToEdit = Object.keys(studentsData).filter(studentId => 
      studentsData[studentId].stream === streamName 
    );

    // Edit the studentsData[studentId].department to item.new for each filtered student
    studentIdsToEdit.forEach(studentId => {
        studentsData[studentId].stream = newStreamName;
    });

    // Save the updated students data back to the server
    const updateStudentsResponse = await fetch(`${url}studentData.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentsData)
    });

    if (!updateStudentsResponse.ok) {
      throw new Error('Failed to update students data');
    }

    // Fetch all events
    const eventsResponse = await fetch(`${url}eventDataForm.json`);
    if (!eventsResponse.ok) {
      throw new Error('Failed to fetch events');
    }
    const eventsData = await eventsResponse.json();

    // Filter events that have the same stream and department to be edited
    const eventIdsToEdit = Object.keys(eventsData).filter(eventId => 
      eventsData[eventId].stream === streamName
    );

    // Edit the eventsData[eventId].dept to item.new for each filtered event
    eventIdsToEdit.forEach(eventId => {
        eventsData[eventId].stream = newStreamName;
    });

    // Save the updated events data back to the server
    const updateEventsResponse = await fetch(`${url}eventDataForm.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventsData)
    });

    if (!updateEventsResponse.ok) {
      throw new Error('Failed to update events data');
    }
  
  
      return;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return;
    }
  };