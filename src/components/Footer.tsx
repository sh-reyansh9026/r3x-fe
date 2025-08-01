// import React from 'react'
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation } from '@react-navigation/native';
// import HomePage from '../screens/HomePage';
// import Notification from '../screens/Notification';
// import RequestForm from '../screens/RequestForm';
// import Profile from '../screens/Profile';
// import CustomText from './CustomText';

// const Footer = () => {
//       const navigation = useNavigation();
//   return (
//     <View style={styles.container}>
//         <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('HomePage')}>
//         <Icon name="home" size={30} color="white" />
//             <CustomText style={styles.text}>Home</CustomText>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('Notification')}>
//         <Icon name="bell" size={30} color="white" />

//             <CustomText style={styles.text}>Notifications</CustomText>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('RequestForm')}>
//         <Icon name="plus" size={30} color="white" />

//             <CustomText style={styles.text}>Request</CustomText>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('Profile')}>
//         <Icon name="user" size={30} color="white" />

//             <CustomText style={styles.text}>Profile</CustomText>
//         </TouchableOpacity>
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         paddingVertical: 16,
//         backgroundColor: '#1B1F18',
//         position: 'absolute',
//         bottom: 0,
//         left: -16,
//         right: -16,
//     },
//     text: {
//         color: 'white',
//         fontSize: 12,
//         marginTop: 4,
//         paddingLeft: 4
//       },
//       item: {
//         alignItems: 'center', // Center icon and text
//       },

// })

// export default Footer
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('HomePage')}>
        <Icon name="home" size={26} color="#F0F0ED" />
        <CustomText style={styles.label}>Home</CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Notification')}>
        <Icon name="bell" size={24} color="#F0F0ED" />
        <CustomText style={styles.label}>Alerts</CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, styles.centerItem]}
        onPress={() => navigation.navigate('RequestForm')}>
        <View style={styles.plusButton}>
          <Icon name="plus" size={16} color="#2F3E2E" />
        </View>
        <CustomText style={[styles.label, styles.centerLabel]}>
          Request
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" size={26} color="#F0F0ED" />
        <CustomText style={styles.label}>Profile</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2F3E2E', // Soft dark olive
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#F0F0ED',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  centerItem: {
    marginTop: 0,
  },
  plusButton: {
    backgroundColor: '#f0f0ed', // Soft green
    borderRadius: 24,
    padding: 7,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  centerLabel: {
    marginTop: 0,
  },
});

export default Footer;
