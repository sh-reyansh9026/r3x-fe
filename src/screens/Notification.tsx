import React, { useEffect, useState } from 'react';
import CustomText from '../components/CustomText';
import { StyleSheet, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
const Notification = () => {
  const [notifications, setNotifications] = useState<any>([]);
  let userId: any;
  const getNotification = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) {
        console.error('No user found in AsyncStorage');
        return;
      }
      
      // Parse the user object and extract the ID
      
      try {
        const user = JSON.parse(userString);
        userId = user._id;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return;
      }
      
      if (!userId) {
        console.error('No user ID found in user data');
        return;
      }
      
      const response = await api.get('/api/notifications/get-notification', {
        params: { user: userId }
      });
      
      if (response.data.success && response.data.data) {
        // The backend already filters notifications for the current user
        // So we can directly use the returned notifications
        setNotifications(response.data.data);
      } else {
        console.error('Failed to fetch notifications:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // You might want to show an error message to the user here
    }
  };
  useEffect(() => {
    getNotification();
  }, []);
  const handleAvailability = async (notificationId: string, isAvailable: boolean) => {
    try {
      
      const response = await api.put(`/api/notifications/update-availability/${notificationId}`, 
        {
        isAvailable: isAvailable,
      });

      if (response.data.success) {
        // Update the local state to reflect the change
        setNotifications(notifications.map((notif: { _id: string; }) => 
          notif._id === notificationId 
            ? { ...notif, status: isAvailable ? 'available' : 'not_available' } 
            : notif
        ));
        
        // Show success message
        Alert.alert(
          'Success', 
          `Marked as ${isAvailable ? 'Available' : 'Not Available'}. The buyer has been notified.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update availability');
      }
    } catch (error: any) {
      console.error('Error updating availability:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update availability. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      {notifications.map((notification: any) => (
        <View key={notification._id} style={styles.notificationItem}>
          <CustomText style={styles.notificationText}>{notification.message}</CustomText>
          {!notification.status && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.availabilityButton, styles.availableButton]}
                onPress={() => handleAvailability(notification._id, true)}
              >
                <CustomText style={styles.buttonText}>Available</CustomText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.availabilityButton, styles.notAvailableButton]}
                onPress={() => handleAvailability(notification._id, false)}
              >
                <CustomText style={styles.buttonText}>Not Available</CustomText>
              </TouchableOpacity>
            </View>
          )}
          {notification.status === 'available' && (
            <CustomText style={styles.statusText}>Status: Available</CustomText>
          )}
          {notification.status === 'not_available' && (
            <CustomText style={styles.statusText}>Status: Not Available</CustomText>
          )}
        </View>
      ))}
      </ScrollView>
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6fb',
  },
  notificationItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  availabilityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  availableButton: {
    backgroundColor: '#4CAF50',
  },
  notAvailableButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
