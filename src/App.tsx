import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserContext';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LandingPage from './screens/LandingPage';
import RegisterPage from './screens/RegisterPage';
import LoginPage from './screens/LoginPage';
import HomePage from './screens/HomePage';
import RequestForm from './screens/RequestForm';
import Details from './screens/Details';
import ListItems from './screens/ListItems';
import Profile from './screens/Profile';
import BookingDetails from './screens/BookingDetails';
import Chat from './screens/Chat';
import Rating from './screens/Rating';
import Notification from './screens/Notification';
import FilteredResultsPage from './screens/FilteredResultsPage';
import Items from './screens/Items';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import api from './config/api';
import { navigationRef } from './services/navigationService';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  RequestForm: undefined;
  HomePage: undefined;
  Notification: { isBuyMode?: boolean };
  Details: {
    item: {
      id: string;
      name: string;
      description: string;
      price: string;
      location: string;
      image: { uri: string };
      seller?: { name: string; id: string };
    };
  };
  ListItems: undefined;
  Profile: { isBuyMode?: boolean };
  BookingDetails: {
    item: { id: string; name: string; price: string; location: string };
  };
  Chat: {
    item: { id: string; name: string; price: string; location: string };
  };
  Rating: undefined;
  FilteredResultsPage: { filteredItems: any[] };
  Items: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="Items" component={Items} options={{ headerShown: false }} />
      <Stack.Screen name="RequestForm" component={RequestForm} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
      <Stack.Screen name="ListItems" component={ListItems} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }}>
        {({ route }) => <Profile isBuyMode={route.params?.isBuyMode ?? true} />}
      </Stack.Screen>
      <Stack.Screen name="BookingDetails" component={BookingDetails} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Rating" component={Rating} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="FilteredResultsPage" component={FilteredResultsPage} />
    </Stack.Navigator>
  );
};

const LandingPageStack = () => {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Login" component={LoginPage} />
    </Stack.Navigator>
  );
};

const AppNavigation = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const fetchLoginState = async () => {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(data === 'true');
    };
    fetchLoginState();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <AppContent /> : <LandingPageStack />}
    </NavigationContainer>
  );
};

const App = () => {
  useEffect(() => {
    requestPermissionAndToken();
    listenForNotifications();
  }, []);

  const requestPermissionAndToken = async () => {
    await notifee.requestPermission();
    await messaging().requestPermission();
    const fcmToken = await messaging().getToken();
    const loggedInUserId = await AsyncStorage.getItem('user');
    console.log("User ID:", loggedInUserId);
    if (fcmToken && loggedInUserId) {
      await api.post('/save-token', {
        token: fcmToken,
        userId: loggedInUserId,
      });
    }
  };

  const listenForNotifications = () => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground FCM:', remoteMessage);
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'default',
        },
      });
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <AuthProvider>
              <AppNavigation />
            </AuthProvider>
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
