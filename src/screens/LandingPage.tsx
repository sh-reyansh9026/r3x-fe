import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native'
import CustomText from '../components/CustomText';

export default function LandingPage({navigation}: {navigation: NavigationProp<any>}) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/top-view-desk-with-black-friday-gifts_23-2148288216.jpg?t=st=1743751466~exp=1743755066~hmac=a1755a92041927b548fb2864a815027247301caf485548baa5098f2d869497a3&w=996' }}
        resizeMode='cover'
        style={styles.background}
      >
        <View>
          <CustomText style={ styles.logoTxt}>R3X</CustomText>
        </View>
        <View>
          <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Login')}>
            <CustomText style={styles.btnText}>Login</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Register')}>
            <CustomText style={styles.btnText}>Register</CustomText>
          </TouchableOpacity>
        </View>
        </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  logoTxt: {
    fontWeight: "bold",
    fontSize: 40,
    color: "#007BFF",
  },
  btn1: {
    width: 300,
    height: 50,
    backgroundColor: "#293333",
    margin: 10,
    borderRadius: 15,
    justifyContent: "center",
    color: "white",
    alignItems: "center",
  },
  btn2: {
    width: 300,
    height: 50,
    backgroundColor: "gray",
    margin: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
