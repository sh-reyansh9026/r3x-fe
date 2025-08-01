// import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import { NavigationProp } from '@react-navigation/native'
// import CustomText from '../components/CustomText';

// export default function LandingPage({navigation}: {navigation: NavigationProp<any>}) {
//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={{ uri: 'https://img.freepik.com/free-photo/top-view-desk-with-black-friday-gifts_23-2148288216.jpg?t=st=1743751466~exp=1743755066~hmac=a1755a92041927b548fb2864a815027247301caf485548baa5098f2d869497a3&w=996' }}
//         resizeMode='cover'
//         style={styles.background}
//       >
//         <View>
//           <CustomText style={ styles.logoTxt}>R3X</CustomText>
//         </View>
//         <View>
//           <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Login')}>
//             <CustomText style={styles.btnText}>Login</CustomText>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Register')}>
//             <CustomText style={styles.btnText}>Register</CustomText>
//           </TouchableOpacity>
//         </View>
//         </ImageBackground>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',

//   },
//   logoTxt: {
//     fontWeight: "bold",
//     fontSize: 40,
//     color: "#007BFF",
//   },
//   btn1: {
//     width: 300,
//     height: 50,
//     backgroundColor: "#293333",
//     margin: 10,
//     borderRadius: 15,
//     justifyContent: "center",
//     color: "white",
//     alignItems: "center",
//   },
//   btn2: {
//     width: 300,
//     height: 50,
//     backgroundColor: "gray",
//     margin: 10,
//     borderRadius: 15,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btnText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import CustomText from '../components/CustomText';

export default function LandingPage({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=800&q=80',
        }}
        resizeMode="cover"
        style={styles.background}>
        <View style={styles.overlay} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeIn,
              transform: [{translateY: slideUp}],
            },
          ]}>
          <CustomText style={styles.logo}>R3X</CustomText>
          <CustomText style={styles.subtitle}>
            Green. Smarter. Together.
          </CustomText>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}>
            <CustomText style={styles.buttonText}>Login</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}>
            <CustomText style={styles.buttonText}>Register</CustomText>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 24, 20, 0.65)', // muted green-black overlay
  },
  content: {
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    fontSize: 52,
    color: '#DDE5B6', // pale olive green
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#BFD8B8', // soft dusty green
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
  loginButton: {
    width: 280,
    height: 50,
    backgroundColor: '#6B8E23', // olive
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButton: {
    width: 280,
    height: 50,
    backgroundColor: '#A3B18A', // dusty green
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
