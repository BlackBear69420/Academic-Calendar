import React, { useState, useEffect } from 'react';
import { StyleSheet, View,StatusBar, TouchableOpacity } from 'react-native';
import { Datepicker, Layout, Text, Input, Button, Spinner,RangeDatepicker } from '@ui-kitten/components';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker2 from 'react-native-date-picker'
import colors from '../../assests/colors';
import { TextInput } from 'react-native-paper';
import {editEvent, fetchStreamDataArray } from '../../../Backend/AdminAPICalls';

const EditEvent = (props) => {
  const data = props.route.params.item;
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false)
  const [range, setRange] = React.useState({});

  const [open2, setOpen2] = useState(false);
  const [value, setValue] = useState(data.stream);
  const [items, setItems] = useState([
    {label: 'select stream', value: 'select stream'}
  ]);

  const [semopen, semsetOpen] = useState(false);
  const [semvalue, semsetValue] = useState(data.sem);
  const [semitems, semsetItems] = useState([
    {label: 'select stream', value: 'select stream'}
  ]);

  const [deptopen, deptsetOpen] = useState(false);
  const [deptvalue, deptsetValue] = useState(data.dept);
  const [deptitems, deptsetItems] = useState([
    {label: 'select stream', value: 'select stream'},
  ]);

  const [typeopen, typesetOpen] = useState(false);
  const [typevalue, typesetValue] = useState(data.type?data.type:null);
  const [typeitems, typesetItems] = useState([
    {label: 'Competition', value: 'Competition'},
    {label: 'Workshop', value: 'Workshop'},
    {label: 'Fest ', value: 'Fest'},
    {label: 'Exam', value: 'Exam'},
    {label: 'Industry Visit', value: 'Industry Visit'},
  ]);

  const [streamData, setStreamData] = useState(null);
  
  const transformStreamName = (streamName) => {
    const ignoreWords = ["of","in"];
    return streamName
      .split(" ")
      .filter(word => !ignoreWords.includes(word.toLowerCase()))
      .map(word => word.charAt(0))
      .join("");
  };

  useEffect(()=>{
    const fetchData = async()=>{

      const streamRes = await fetchStreamDataArray();
      setStreamData(streamRes.streams);
      const extractedStreams = streamRes?.streams.map(stream => ({
        label: transformStreamName(stream.stream),
        value: stream.stream,
      }));
      console.log(extractedStreams);
      setItems(extractedStreams);
      setValue(data.dept)
    }
    fetchData();
  },[])

  useEffect(()=>{
    if(streamData){
      const d = extractDepartments(streamData, value);
      const s = extractSemesters(streamData, value);
      deptsetItems(d);
      semsetItems(s);
    }
  },[value]);


  const extractSemesters = (data, streamName) => {
  const filteredData = data.filter(stream => stream.stream === streamName);
  if (filteredData.length === 0) return [];
  
  const maxSemester = Math.max(...filteredData.map(stream => stream.semester));
  return Array.from({ length: maxSemester }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString()
  }));
};

const extractDepartments = (data, streamName) => {
  const filteredData = data.filter(stream => stream.stream === streamName);
  if (filteredData.length === 0) return [];
  
  const departmentsSet = new Set(filteredData.flatMap(stream => stream.departments));
  return Array.from(departmentsSet).map(department => ({
    label: department,
    value: department
  }));
};



  const validateForm = () => {
    const errors = {};
    if (!(Object.keys(range).length>0)) errors.date = "Date is required.";
    if (!time) errors.time = "Time is required.";
    if (!title.trim()) errors.title = "Title is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if(!value) errors.stream = "Stream is required.";
    if(!semvalue) errors.sem = "Semester is required.";
    if(!deptvalue) errors.dept = "Department is required.";
    if(!typevalue) errors.type = "Event type is required.";

    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async() => {
    if (validateForm()) {
      const dateData = {};
      if(range.endDate){
        const datePart = new Date(range.endDate).toISOString().split('T')[0];
        console.log(datePart);
        dateData.endDate = datePart;
      }
      if(range.startDate){
        const datePart = new Date(range.startDate).toISOString().split('T')[0];
        console.log(datePart);
        dateData.startDate = datePart;
      }
      setIsLoading(true); 
      const formData = { 
        time: time.toLocaleTimeString(),
        title: title,
        description: description,
        stream:value,
        sem:semvalue,
        dept: deptvalue,
        range:dateData,
        type: typevalue
      };
      console.log(formData);
      try{
        const res = await editEvent(data.id,formData);
        if (res) {
          console.log('Added event successfully');
          setIsLoading(false); 
        } else {
          console.log('Failed to add event. Please try again.');
        }
      }catch(error){
        console.log("Error handling the firebase addition")
      }
    }
  };

  return (
    <Layout style={styles.container} level='1'>
      <StatusBar backgroundColor={colors.primary} barStyle='light-content'/>
      <Text style={styles.title}>Add Event</Text>
        <View style={{padding:20,gap:10}}>
        <View style={{
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        paddingBottom:10
    }}>
      
      <RangeDatepicker
        range={range}
        onSelect={nextRange => setRange(nextRange)}
        style={{width:'100%'}}
        status='primary'
        placeholder='Pick a date or a range of dates'
        size='large'
      />
    </View>
    {errors.date && <Text style={{ color: 'red' }}>{errors.date}</Text>}
    <View style={{flexDirection:'row',
        justifyContent:'space-between',
        alignSelf:'center'
    }}>
         <TouchableOpacity  onPress={() => setOpen(true)} style={{width:'100%',alignItems:'center',borderWidth:1,paddingVertical:12,borderRadius:6,borderColor:colors.primary}}>
        <Text style={{color:colors.primary}}>
          {time?time.toLocaleTimeString():'Select Time'}
        </Text>
      </TouchableOpacity>
     
      <DatePicker2
        modal
        open={open}
        date={time}
        mode='time'
        onConfirm={(time) => {
          setOpen(false)
          setTime(time)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </View>
      {errors.time && <Text style={{ color: 'red' }}>{errors.time}</Text>}
  
      <TextInput
      label="Title"
      value={title}
      onChangeText={text => setTitle(text)}
      mode='outlined'
      />
       {errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}
       <TextInput
      label="Description"
      multiline={true}
      value={description}
      onChangeText={text => setDescription(text)}
      mode='outlined'
      />
      {errors.description && <Text style={{ color: 'red' }}>{errors.description}</Text>}


      <DropDownPicker
      placeholder='select a type of event'
      open={typeopen}
      value={typevalue}
      items={typeitems}
      setOpen={typesetOpen}
      setValue={typesetValue}
      setItems={typesetItems}
      zIndex={4000}
      zIndexInverse={4000}
    />
      {errors.type && <Text style={{ color: 'red' }}>{errors.type}</Text>}

      <DropDownPicker
      placeholder='select a stream'
      open={open2}
      value={value}
      items={items}
      setOpen={setOpen2}
      setValue={setValue}
      setItems={setItems}
      zIndex={3000}
      zIndexInverse={3000}
    />
          {errors.stream && <Text style={{ color: 'red' }}>{errors.stream}</Text>}

      <DropDownPicker
      placeholder='select a department'
      open={deptopen}
      value={deptvalue}
      items={deptitems}
      setOpen={deptsetOpen}
      setValue={deptsetValue}
      setItems={deptsetItems}
      zIndex={2000}
      zIndexInverse={2000}
    />
      {errors.sem && <Text style={{ color: 'red' }}>{errors.sem}</Text>}

    <DropDownPicker
      placeholder='select a sem'
      open={semopen}
      value={semvalue}
      items={semitems}
      setOpen={semsetOpen}
      setValue={semsetValue}
      setItems={semsetItems}
      zIndex={1000}
      zIndexInverse={1000}
    />
      {errors.dept && <Text style={{ color: 'red' }}>{errors.dept}</Text>}

      <Button
        onPress={onSubmit}
        style={styles.button}
        size='medium'
        disabled={isLoading} // Disable button while loading
        accessoryLeft={isLoading ? LoadingIndicator : null} // Show loading indicator if loading
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
        </View>
    </Layout>
  );
};

export default EditEvent;

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size='small' />
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap:8,
    flex:1
  },
  button: {
    margin: 2,
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'RobotoSlab-Bold',
    alignSelf: 'center',
    paddingVertical: 20,
    backgroundColor:'#1338be',
    width:'100%',
    paddingHorizontal:20
  },
});
