import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../components/CustomText";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/api";
import { Snackbar } from 'react-native-paper';
import { getFCMToken } from "../utils/fcm";

const RegistrationSchema = Yup.object().shape({
  name: Yup.string().min(3, "Too short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
});

const RegisterPage = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useAuth();

  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    // Get FCM token when component mounts
    const getToken = async () => {
      const token = await getFCMToken();
      setFcmToken(token);
    };
    getToken();
  }, []);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log("Submitting form with values:", values);

    const userData = {
      username: values.name,
      email: values.email,
      password: values.password,
      fcmToken: fcmToken
    };
    
    console.log("Sending registration data:", userData);

    try {
      const response = await api.post(`/api/users/register`, userData);
      console.log("Registration success:", response.data);

      const { accessToken, refreshToken } = response.data.data;

      // Store tokens in AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true); // switch to authenticated stack
      navigation.navigate("HomePage");
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.logo}>R3X</CustomText>
      <CustomText style={styles.title}>Hello! Register to get started</CustomText>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <CustomText style={styles.error}>{errors.name}</CustomText>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <CustomText style={styles.error}>{errors.email}</CustomText>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <CustomText style={styles.error}>{errors.password}</CustomText>
            )}

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <CustomText style={styles.error}>{errors.confirmPassword}</CustomText>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <CustomText style={styles.buttonText}>Register</CustomText>
            </TouchableOpacity>

            <CustomText style={styles.footerText}>
              Already have an account?{" "}
              <CustomText
                style={styles.link}
                onPress={() => navigation.navigate("Login")}
              >
                Login Now
              </CustomText>
            </CustomText>
          </>
        )}
      </Formik>

      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F5F8F4', // Light dusty green
  },
  logo: {
    color: '#708238', // Olive green
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 10,
  },
  title: {
    color: '#3A4D2F',
    fontSize: 26,
    fontWeight: 'bold',
    paddingTop: 10,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#E6EDE3', // Pale green
    padding: 14,
    borderColor: '#C3D3BD',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
    color: '#1A1A1A',
    marginRight: 10,
    elevation: 1,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#708238', // Olive green
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginRight: 10,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 30,
    paddingBottom: 10,
  },
  link: {
    color: '#3F5E2A',
    fontWeight: 'bold',
  },
  line: {
    width: 160,
    height: 6,
    backgroundColor: '#B8CBA8',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
});

export default RegisterPage;
