import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Datepicker, Layout, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { useForm } from 'react-hook-form';
import DatePicker2 from 'react-native-date-picker'


const AddEvent = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false)


  const validateForm = () => {
    const errors = {};
    if (!time) errors.time = "Time is required.";
    if (!date) errors.date = "Date is required.";
    if (!title.trim()) errors.title = "Title is required.";
    if (!description.trim()) errors.description = "Description is required.";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = () => {
    if (validateForm()) {
      setIsLoading(true); 
      const formData = {
        date: date.toLocaleDateString(), 
        time: time.toLocaleTimeString(),
        title: title,
        description: description,
      };
      console.log(formData);
      setIsLoading(false); 
    }
  };

  return (
    <Layout style={styles.container} level='1'>
    <View style={{flexDirection:'row',
        justifyContent:'space-between',
    }}>
      <Datepicker
      
        date={date}
        onSelect={nextDate => setDate(nextDate)}
        style={{width:'60%'}}
      />
    </View>
    <View style={{flexDirection:'row',
        justifyContent:'space-between',
    }}>
      <Button onPress={() => setOpen(true)} >
        Select Time
      </Button>
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
      {errors.date && <Text style={{ color: 'red' }}>{errors.date}</Text>}

      <Input
        style={{ marginVertical: 8 }}
        placeholder='Title'
        value={title}
        onChangeText={setTitle}
      />
      {errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}

      <Input
        style={{ marginVertical: 8 }}
        placeholder='Description'
        value={description}
        onChangeText={setDescription}
      />
      {errors.description && <Text style={{ color: 'red' }}>{errors.description}</Text>}

      <Button
        onPress={onSubmit}
        style={styles.button}
        size='medium'
        disabled={isLoading} // Disable button while loading
        accessoryLeft={isLoading ? LoadingIndicator : null} // Show loading indicator if loading
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </Layout>
  );
};

export default AddEvent;

const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size='small' />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap:8,
    justifyContent:'center',
    flex:1
  },
  button: {
    margin: 2,
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
