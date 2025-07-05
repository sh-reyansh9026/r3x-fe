import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import HomePage from '../screens/HomePage';
import Notification from '../screens/Notification';
import RequestForm from '../screens/RequestForm';
import Profile from '../screens/Profile';
import CustomText from './CustomText';

const Footer = () => {
      const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('HomePage')}>
        <Icon name="home" size={30} color="white" />
            <CustomText style={styles.text}>Home</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('Notification')}>
        <Icon name="bell" size={30} color="white" />

            <CustomText style={styles.text}>Notifications</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('RequestForm')}>
        <Icon name="plus" size={30} color="white" />

            <CustomText style={styles.text}>Request</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('Profile')}>
        <Icon name="user" size={30} color="white" />

            <CustomText style={styles.text}>Profile</CustomText>
        </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#1B1F18',
        position: 'absolute',
        bottom: 0,
        left: -16,
        right: -16,
    },
    text: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
        paddingLeft: 4
      },
      item: {
        alignItems: 'center', // Center icon and text
      },

})

export default Footer