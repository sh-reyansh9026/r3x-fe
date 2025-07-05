import React,{useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../context/UserContext';
import { Alert } from 'react-native';
import CustomText from '../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType } from '@notifee/react-native';
import api from '../config/api';

interface UserType {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  [key: string]: any; // Allow additional properties
}

interface ItemType {
  id: string;
  name: string;
  description: string;
  price: string;
  location: string;
  image: string | { uri: string };
  category: string;
  userId?: string;
  user?: string | UserType;
  userName?: string;
}

type DetailsRouteProp = RouteProp<{ Details: { item: ItemType } }, 'Details'>;
type DetailsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getSellerName = (item: ItemType): string => {
  if (!item) return 'Unknown Seller';
  
  console.log('Item in getSellerName:', JSON.stringify({
    user: item.user,
    userName: item.userName,
    userId: item.userId
  }, null, 2));
  
  // If user is a complete object with name
  if (item.user && typeof item.user === 'object') {
    if ('name' in item.user && item.user.name) {
      return item.user.name;
    }
    if ('username' in item.user && item.user.username) {
      return item.user.username;
    }
    if (item.user._id) {
      return `User ${item.user._id.substring(0, 6)}`;
    }
  }
  
  // If we have a direct userName
  if (item.userName) {
    return item.userName;
  }
  
  // If user is a string (could be name, email, or ID)
  if (typeof item.user === 'string' && item.user) {
    // Check if it's an email
    if (item.user.includes('@')) {
      return item.user.split('@')[0];
    }
    return item.user;
  }
  
  // If we only have userId
  if (item.userId) {
    return `User ${item.userId.substring(0, 6)}`;
  }
  
  return 'Unknown Seller';
};

const Details: React.FC = () => {
  const navigation = useNavigation<DetailsNavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const { item } = route.params;
  const { user } = useUser();
  
  // Log detailed user information for debugging
  useEffect(() => {
    console.log('Item data in Details:', {
      user: item.user,
      userName: item.userName,
      userId: item.userId,
      fullItem: item
    });
    
    // Log the seller name that will be displayed
    console.log('Seller name to display:', getSellerName(item));
  }, [item]);

  const handleCheckAvailability = async () => {
    try {
      // Debug log to see the item structure
      console.log('Item in handleCheckAvailability:', JSON.stringify(item, null, 2));
      
      // Try different ways to get the seller ID
      let sellerId = '';
      
      // Case 1: User is a full object with _id
      if (item.user && typeof item.user === 'object' && item.user._id) {
        sellerId = item.user._id;
      } 
      // Case 2: User is a string (could be the ID directly)
      else if (typeof item.user === 'string') {
        sellerId = item.user;
      }
      // Case 3: userId is directly on the item
      else if (item.userId) {
        sellerId = item.userId;
      }
      
      console.log('Extracted sellerId:', sellerId);
  
      if (!sellerId) {
        console.error('Seller ID not found in item:', item);
        Alert.alert('Error', 'Unable to identify the seller. Please try again later.');
        return;
      }

      // Get the current user's auth token
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please log in to send notifications.');
        return;
      }

      try {
        const response = await api.post(
          '/api/notifications/send',
          {
            userId: sellerId,
            title: 'Someone is interested in your item!',
            message: `${user?.name || 'A buyer'} wants to know if "${item.name}" is available.`,
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        console.log('Notification sent response:', response.data);
        Alert.alert('Success', 'Notification sent to the seller!');
      } catch (error: any) {
        console.error('Error sending notification:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        
        let errorMessage = 'Failed to send notification. ';
        if (error.response?.status === 401) {
          errorMessage += 'Please log in again.';
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message;
        } else {
          errorMessage += 'Please try again later.';
        }
        
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.error('Notification error:', error);
      Alert.alert('Error', 'Failed to send notification. ' + (error.response?.data?.message || 'Please try again later.'));
    }
  };
  

  // const handleBookNow = () => {
  //   if (!isRequested) {
  //     Alert.alert(
  //       'Notification sent',
  //       'Notification sent to seller',
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             Alert.alert('Notification came','Notification from seller that item is avilable',
  //               [
  //                 {
  //                   text: 'OK',
  //                   onPress: () => {
  //                     navigation.navigate('Chat', {
  //                       item,
  //                       buyer: { id: user?.email || 'buyer1', name: user?.name || 'Buyer' },
  //                       // Use mock/default seller data since backend is not maintained
  //                       seller: { id: 'seller1', name: 'Seller' },
  //                       // suggestions: [
  //                       //   'Is this item still available?',
  //                       //   'Can you reduce the price?',
  //                       //   'What’s the condition of the item?',
  //                       //   'When can I pick it up?',
  //                       // ],
  //                     });
  //                   }
  //                 }
  //               ]
  //             );
  //           }
  //         }
  //       ]
  //     );

  //     // // Open chat between buyer (current user) and seller (from item)
  //     // navigation.navigate('Chat', {
  //     //   item,
  //     //   buyer: { id: user?.email || 'buyer1', name: user?.name || 'Buyer' },
  //     //   // Use mock/default seller data since backend is not maintained
  //     //   seller: { id: 'seller1', name: 'Seller' },
  //     // });
  //   } else {
  //     // Handle "I Have" action for requested items
  //     navigation.navigate('ListItems');
  //   }
  // };

  // useEffect(() => {
  //   const debugStorage = async () => {
  //     const id = await AsyncStorage.getItem("userId");
  //     const name = await AsyncStorage.getItem("userName");
  //     console.log("DEBUG >>> userId:", id, "userName:", name);
  //   };
  //   debugStorage();
  // }, []);

  // const handleCheckAvailability = () => {
  //   notifee.onForegroundEvent(({ type, detail }) => {
  //     if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'available') {
  //       const { itemId, buyerId } = detail.notification.data;
  //       axios.post('http://your-backend/api/notify-buyer', { itemId, buyerId });
  //     }
  //   });
  // }

  // messaging().onMessage(async remoteMessage => {
  //   if (remoteMessage.data.type === 'item_available') {
  //     navigation.navigate('ChatScreen', {
  //       itemId: remoteMessage.data.itemId,
  //       sellerId: remoteMessage.data.sellerId,
  //     });
  //   }
  // });
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CustomText style={styles.backButton}>←</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.title}>Item Details</CustomText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.imageContainer}>
      <Image 
        source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
        style={styles.image} 
      />
      </View>
      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <View>
            <CustomText style={styles.name}>{item.name}</CustomText>
            <View style={styles.sellerContainer}>
              <CustomText style={styles.sellerLabel}>Listed by: </CustomText>
              <CustomText style={styles.sellerName}>
                {getSellerName(item) || 'Unknown Seller'}
              </CustomText>
            </View>
          </View>
          <View>
            <CustomText style={styles.category}>
              Category
            </CustomText>
            <View style={styles.categoryContainer}>
              <CustomText style={styles.categoryValue}>{item.category}</CustomText>
            </View>
          </View>
        </View>
        <CustomText style={styles.price}>{item.price}</CustomText>
        {/* <View style={styles.locationContainer}>
          <CustomText style={styles.locationLabel}>Location:</CustomText>
          <CustomText style={styles.location}>{item.location}</CustomText>
        </View> */}
        {/* {!isListed && (
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <CustomText style={styles.bookButtonText}>
            {isRequested ? 'List Item' : 'Shop Now'}
          </CustomText>
        </TouchableOpacity>
        )} */}
      </View>
      <View style={styles.descriptionContainer}>

        <CustomText style={styles.description}>
          {item.description ? item.description : 'No description available'}
        </CustomText>
      </View>
      <TouchableOpacity style={styles.bookButton}
      onPress={handleCheckAvailability}
      >
        <CustomText style={styles.bookButtonText}>Available or Not ?</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111510',
    padding: 16,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  sellerLabel: {
    fontSize: 14,
    color: '#888',
  },
  sellerName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#111510',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#111510'
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 24,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  imageContainer:{
    margin: 16,
    borderRadius: 10,
  },
  category: {
    flexDirection: 'row',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FF6B6B',
    padding:5,
    borderRadius:10,
    marginVertical:10,
  },
  categoryValue: {
    fontSize: 16,
    color: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  price: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
  location: {
    fontSize: 16,
    color: 'white',
  },
  descriptionContainer: {
    marginBottom: 20,
    color: 'white',
    padding: 16
  },
  description: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  bookButton: {
    backgroundColor: '#55D934',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Details;
