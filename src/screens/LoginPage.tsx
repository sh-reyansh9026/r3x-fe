import React from "react";
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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short!").required("Required"),
});

const LoginPage = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    const userData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await api.post(`/api/users/login`, userData);
      const { user, accessToken, refreshToken, expiresIn } = response.data.data;

      // Store tokens and user data in AsyncStorage
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      navigation.navigate("HomePage");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: "#111510",
  },
  logo: {
    color: "slategray",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 100,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    paddingTop: 20,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#2E352B",
    padding: 12,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 10,
    marginRight: 20,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#8BD379",
    alignItems: "center",
    padding: 12,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 16,
    marginRight: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    color: "white",
    textAlign: "center",
    marginTop: 30,
    paddingBottom: 10,
  },
  link: {
    color: "#50D3A7",
    fontWeight: "bold",
  },
  line: {
    width: 200,
    height: 10,
    backgroundColor: "slategray",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 100,
    marginBottom: 50,
  },
});

export default LoginPage;
