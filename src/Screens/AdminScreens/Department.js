import { StyleSheet, Text, TouchableOpacity, View,TextInput,Alert } from 'react-native'
import React,{useState} from 'react'
import colors from '../../assests/colors'
import Icon from 'react-native-vector-icons/FontAwesome';
import { FAB } from 'react-native-paper';
import Modal from 'react-native-modal';

const Department = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleSubmit = () => {
      if (inputValue.trim() === '') {
        Alert.alert('Error', 'Input is required');
      } else {
        console.log(inputValue);
        setModalVisible(false);
        setInputValue('');
      }
    };
  return (
    <View style={{flex:1}}>
      <Text style={{color:colors.black,fontSize:25,padding:20,fontWeight:'bold',textAlign:'center'}}>Bachelor of Engineering</Text>
      <View style={{padding:20,gap:25,borderWidth:2,marginHorizontal:20,borderRadius:20,paddingBottom:60,borderColor:colors.black}}>

        <View style={{alignItems:'center'}}>
            <Text style={{color:colors.black,fontSize:20,fontWeight:'bold'}}>
                Semesters
            </Text>
            <View style={{flexDirection:'row',gap:40,paddingVertical:10}}>
                <TouchableOpacity
                style={{borderWidth:2,borderRadius:8,padding:10,borderColor:colors.black}}
                ><Icon name="minus" size={15} color={colors.black} /></TouchableOpacity>

            <Text style={{fontSize:25,textAlign:'center',color:colors.black}}>
                8
            </Text>
            <TouchableOpacity style={{borderWidth:2,borderRadius:8,padding:10,borderColor:colors.black}}>
            <Icon name="plus" size={15} color={colors.black}/> 
            </TouchableOpacity>

            </View>
        </View>
        <TouchableOpacity style={{borderWidth:2,borderRadius:12,padding:10,paddingHorizontal:20,borderColor:colors.black,flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:colors.black}}>
           <View>
           <Text style={{color:colors.white,fontSize:20,fontWeight:'bold'}}>
                Computer Science
            </Text>
           </View>

           <Icon name="pencil" size={20} color={colors.white} style={{}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{borderWidth:2,borderRadius:12,padding:10,paddingHorizontal:20,borderColor:colors.black,flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:colors.black}}>
           <View>
           <Text style={{color:colors.white,fontSize:20,fontWeight:'bold'}}>
                Electrical
            </Text>
           </View>

           <Icon name="pencil" size={20} color={colors.white} style={{}}/>
        </TouchableOpacity>

      </View>
      <FAB
    icon="plus"
    style={styles.fab}
    onPress={()=>setModalVisible(true)}
  />
         <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Department</Text>
          <TextInput
            style={[
              styles.input,
              isInputFocused && { borderColor: 'black', borderWidth: 2 }
            ]}
            placeholder="Enter Department name"
            value={inputValue}
            onChangeText={setInputValue}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
         <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

export default Department

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor:'#F0F8FF',
        color:'#007FFF'
      },
      modal: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      modalContainer: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: 550,
        minHeight:200,
        paddingHorizontal:40
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        color: 'black',
      },
      input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 40,
        paddingHorizontal: 10,
        borderRadius:8,
      },
      submitButton: {
        backgroundColor: '#007FFF',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom:40
      },
      submitButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign:'center',
        fontWeight:'bold'
      },
})