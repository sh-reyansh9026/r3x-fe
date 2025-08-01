import React, { useState } from "react";
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
import { Button, Snackbar } from 'react-native-paper';



const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short!").required("Required"),
});

const LoginPage = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useAuth();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigation();
  
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    const userData = {
      email: values.email,
      password: values.password,
    };
  
    try {
      console.log("Login request body:", userData);
      const response = await api.post(`/api/users/login`, userData);
      
      // Log the complete response for debugging
      console.log("Complete login response:", JSON.stringify(response, null, 2));
      console.log("Response data:", response.data);
      
      if (!response.data) {
        throw new Error('No data in response');
      }
      
      const { access, refresh, user } = response.data;
      
      if (!access || !refresh) {
        console.error('Missing tokens in response:', { access, refresh });
        throw new Error('Invalid response format from server');
      }
      
      console.log('Access token:', access.token);
      console.log('Refresh token:', refresh.token);
  
      // Store tokens and user data in AsyncStorage
      await AsyncStorage.setItem("accessToken", access.token);
      await AsyncStorage.setItem("refreshToken", refresh.token);
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("user", JSON.stringify(user));
      
      // Set auth state
      setIsLoggedIn(true);
      navigation.navigate("HomePage");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "An unexpected error occurred";
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.statusText || "Login failed";
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        errorMessage = error.message || "Login failed";
      }
      showSnackbar(errorMessage);
    }
  };

  return (
    <>
    <Button onPress={() => navigation.navigate("Landing")}>
    Landing
    </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#ff4444' }}
      >
        {snackbarMessage}
      </Snackbar>
    <View style={styles.container}>
      <CustomText style={styles.logo}>R3X</CustomText>
      <CustomText style={styles.title}>Welcome Back! Login</CustomText>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
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

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <CustomText style={styles.buttonText}>
                {isSubmitting ? "Logging in..." : "Login"}
              </CustomText>
            </TouchableOpacity>

            <CustomText style={styles.footerText}>
              Don’t have an account?{" "}
              <CustomText
                style={styles.link}
                onPress={() => navigation.navigate("Register")}
              >
                Register Now
              </CustomText>
            </CustomText>
          </>
        )}
      </Formik>

      <View style={styles.line} />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F5F8F4', // Soft dusty green
  },
  logo: {
    color: '#708238',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    color: '#3A4D2F',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#E6EDE3',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C3D3BD',
    marginBottom: 12,
    color: '#1A1A1A',
    elevation: 1,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#708238',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 40,
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
    marginTop: 40,
  },
});


export default LoginPage;
