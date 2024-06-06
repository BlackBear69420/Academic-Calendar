import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { RangeDatepicker, Layout, Text } from "@ui-kitten/components";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker2 from "react-native-date-picker";
import colors from "../../assests/colors";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation , useRoute} from "@react-navigation/native";
import {
  addEventHandler,
  fetchStreamDataArray,

} from "../../../Backend/AdminAPICalls";

const AddEvent = (props) => {
  const route = useRoute();
  const { setCall, call } = route.params;
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState({});
  const navigation = useNavigation();
  const [open2, setOpen2] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "select stream", value: "select stream" },
  ]);

  const [semopen, semsetOpen] = useState(false);
  const [semvalue, semsetValue] = useState("select stream");
  const [semitems, semsetItems] = useState([
    { label: "select stream", value: "select stream" },
  ]);

  const [deptopen, deptsetOpen] = useState(false);
  const [deptvalue, deptsetValue] = useState("select stream");
  const [deptitems, deptsetItems] = useState([
    { label: "select stream", value: "select stream" },
  ]);

  const [typeopen, typesetOpen] = useState(false);
  const [typevalue, typesetValue] = useState(null);
  const [typeitems, typesetItems] = useState([
    { label: "Competition", value: "Competition" },
    { label: "Workshop", value: "Workshop" },
    { label: "Fest ", value: "Fest" },
    { label: "Exam", value: "Exam" },
    { label: "Industry Visit", value: "Industry Visit" },
  ]);

  const [streamData, setStreamData] = useState(null);

  const transformStreamName = (streamName) => {
    const ignoreWords = ["of", "in"];
    return streamName
      .split(" ")
      .filter((word) => !ignoreWords.includes(word.toLowerCase()))
      .map((word) => word.charAt(0))
      .join("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const streamRes = await fetchStreamDataArray();
      setStreamData(streamRes.streams);
      const extractedStreams = streamRes?.streams.map((stream) => ({
        label: transformStreamName(stream.stream),
        value: stream.stream,
      }));
      console.log(extractedStreams);
      setItems(extractedStreams);
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (streamData) {
      const d = extractDepartments(streamData, value);
      const s = extractSemesters(streamData, value);
      deptsetItems(d);
      semsetItems(s);
    }
  }, [value]);

  const extractSemesters = (data, streamName) => {
    const filteredData = data.filter((stream) => stream.stream === streamName);
    if (filteredData.length === 0) return [];

    const maxSemester = Math.max(
      ...filteredData.map((stream) => stream.semester)
    );
    return Array.from({ length: maxSemester }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    }));
  };

  const extractDepartments = (data, streamName) => {
    const filteredData = data.filter((stream) => stream.stream === streamName);
    if (filteredData.length === 0) return [];

    const departmentsSet = new Set(
      filteredData.flatMap((stream) => stream.departments)
    );
    return Array.from(departmentsSet).map((department) => ({
      label: department,
      value: department,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!(Object.keys(range).length > 0)) errors.date = "Date is required.";
    if (!time) errors.time = "Time is required.";
    if (!title.trim()) errors.title = "Title is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!value) errors.stream = "Stream is required.";
    if (!semvalue || semvalue === "select stream")
      errors.sem = "Semester is required.";
    if (!deptvalue || deptvalue === "select stream")
      errors.dept = "Department is required.";
    if (!typevalue) errors.type = "Event type is required.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      const dateData = {};
      if (range.endDate) {
        const datePart = new Date(range.endDate).toISOString().split("T")[0];
        console.log(datePart);
        dateData.endDate = datePart;
      }
      if (range.startDate) {
        const datePart = new Date(range.startDate).toISOString().split("T")[0];
        console.log(datePart);
        dateData.startDate = datePart;
      }
      setIsLoading(true);
      const formData = {
        time: time.toLocaleTimeString(),
        title: title,
        description: description,
        stream: value,
        sem: semvalue,
        dept: deptvalue,
        range: dateData,
        type: typevalue,
      };
      console.log(formData);
      try {
        const res = await addEventHandler(formData);
        if (res) {
          console.log('Added event successfully');
          Alert.alert('Success','Added event successfully')
          navigation.goBack()
          setIsLoading(false); 
        } else {
          Alert.alert('Failed to add event successfully')
          console.log('Failed to add event. Please try again.');
        }
      } catch (error) {
        console.log("Error handling the firebase addition");
      }
    }
  };

  return (
    <Layout style={styles.container}>
      <StatusBar backgroundColor={colors.black} barStyle="light-content" />
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.black,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical:20,
          gap:20,
          alignItems:'center'
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{}}>
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Event</Text>
      </View>

      <ScrollView >
      <View style={{padding:20,gap: 10}}>
      <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <RangeDatepicker
            range={range}
            onSelect={(nextRange) => setRange(nextRange)}
            style={{ width: "100%" }}
            placeholder="Pick a date or a range of dates"
            size="large"
          />
        </View>
        {errors.date && <Text style={{ color: "red" }}>{errors.date}</Text>}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={{
              width: "100%",
              alignItems: "center",
              borderWidth: 1,
              paddingVertical: 12,
              borderRadius: 6,
              borderColor: colors.black,
            }}
          >
            <Text style={{ color: colors.black }}>
              {time ? time.toLocaleTimeString() : "Select Time"}
            </Text>
          </TouchableOpacity>

          <DatePicker2
            modal
            open={open}
            date={time}
            mode="time"
            onConfirm={(time) => {
              setOpen(false);
              setTime(time);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        {errors.time && <Text style={{ color: "red" }}>{errors.time}</Text>}

        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          mode="outlined"
          activeOutlineColor={colors.black}
        />
        {errors.title && <Text style={{ color: "red" }}>{errors.title}</Text>}
        <TextInput
          label="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          mode="outlined"
          activeOutlineColor={colors.black}
        />
        {errors.description && (
          <Text style={{ color: "red" }}>{errors.description}</Text>
        )}

        <DropDownPicker
          placeholder="select a type of event"
          open={typeopen}
          value={typevalue}
          items={typeitems}
          setOpen={typesetOpen}
          setValue={typesetValue}
          setItems={typesetItems}
          zIndex={4000}
          zIndexInverse={4000}
          listMode="SCROLLVIEW"
        />
        {errors.type && <Text style={{ color: "red" }}>{errors.type}</Text>}

        <DropDownPicker
          placeholder="select a stream"
          open={open2}
          value={value}
          items={items}
          setOpen={setOpen2}
          setValue={setValue}
          setItems={setItems}
          zIndex={3000}
          zIndexInverse={3000}
          listMode="SCROLLVIEW"
        />
        {errors.stream && <Text style={{ color: "red" }}>{errors.stream}</Text>}

        <DropDownPicker
          placeholder="select a department"
          open={deptopen}
          value={deptvalue}
          items={deptitems}
          setOpen={deptsetOpen}
          setValue={deptsetValue}
          setItems={deptsetItems}
          zIndex={2000}
          zIndexInverse={2000}
          listMode="SCROLLVIEW"
        />
        {errors.dept && <Text style={{ color: "red" }}>{errors.dept}</Text>}

        <DropDownPicker
          placeholder="select a sem"
          open={semopen}
          value={semvalue}
          items={semitems}
          setOpen={semsetOpen}
          setValue={semsetValue}
          setItems={semsetItems}
          zIndex={1000}
          zIndexInverse={1000}
          listMode="SCROLLVIEW"
        />
        {errors.sem && <Text style={{ color: "red" }}>{errors.sem}</Text>}

        <TouchableOpacity
          onPress={onSubmit}
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
    </Layout>
  );
};

export default AddEvent;

const styles = StyleSheet.create({
  container: {
    gap: 8,
    flex: 1,

  },
  button: {
    margin: 2,
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontFamily: "RobotoSlab-Bold",
  },
});
