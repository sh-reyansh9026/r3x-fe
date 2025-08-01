import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types/navigation';
import CustomText from './CustomText';

interface UserData {
  _id?: string;
  username?: string;
  email?: string;
}

type CardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

interface CarCardProps {
  image: string | { uri: string };
  title: string;
  rating: number;
  location: string;
  price: string;
  description?: string;
  id: string;
  category: string;
  isRequested?: boolean;
  isListed?: boolean;
  user?: string | UserData;
  userId?: string;
  username?: string;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 36) / 2; // 16 padding + 4*2 spacing

const Card: React.FC<CarCardProps> = ({ 
  image, 
  title, 
  rating, 
  location, 
  price, 
  category, 
  description = '', 
  id, 
  isRequested = false, 
  isListed = false, 
  user, 
  userId,
  username 
}) => {
  const navigation = useNavigation<CardNavigationProp>();
 
  const handleViewDetails = () => {
    try {
      // Helper function to extract seller information
      console.log("user in handle view details",user);
      const getSellerInfo = () => {
        // If we have a complete user object with _id and name
        if (user && typeof user === 'object' && (user._id || user.username)) {
          return {
            id: user._id || '',
            name: user.username || 'Unknown Seller',
            email: user.email || ''
          };
        }
        
        // If we have a username prop
        if (username) {
          return {
            id: userId || '',
            name: username,
            email: ''
          };
        }
        
        // If we have a userId string
        if (userId) {
          return {
            id: userId,
            name: `User ${String(userId).substring(0, 6)}`,
            email: ''
          };
        }
        
        // Default fallback
        return {
          id: '',
          name: 'Unknown Seller',
          email: ''
        };
      };

      const sellerInfo = getSellerInfo();
      
      // Create the item object with seller information
      const itemData = {
        id,
        name: title,
        price,
        location,
        image: typeof image === 'string' ? { uri: image } : image,
        description: description || '',
        category,
        userId: sellerInfo.id,
        user: sellerInfo,
        username: sellerInfo.name,
        rating: rating || 0
      }
      
      navigation.navigate('Details', {
        item:itemData,
        isRequested,
        isListed
      });
      console.log("items............",itemData);
    } catch (error) {
      console.error('Error in handleViewDetails:', error);
      // Navigate with default values if there's an error
      navigation.navigate('Details', {
        item: {
          id,
          name: title,
          price,
          location,
          image: typeof image === 'string' ? { uri: image } : image,
          description: description || '',
          category,
          user: 'Unknown Seller',
          username: 'Unknown Seller'
        },
        isRequested,
        isListed
      });
    }
  
  };
  


  return (
    <View>
      <View style={styles.imageWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
          <Image 
            source={typeof image === 'string' ? { uri: image } : image} 
            style={styles.image} 
            resizeMode="cover" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
  <View style={styles.left}>
    <CustomText weight="medium" style={styles.title}>{title}</CustomText>
    <View style={styles.row}>
      <CustomText style={styles.price}>{price}</CustomText>
      <CustomText style={styles.location}>{location}</CustomText>
    </View>
   </View>
 </View>

    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft:12,
    marginTop:8
  },
  
  left: {
    flex: 1,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight:6
    },
  
  location:{
    fontSize: 12,
    color: 'white',
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    color: 'white',
  },
  
  price: {
    fontSize: 12,
    color: 'slategray',
    },
  button: {
    backgroundColor: '#1E232C',
    borderRadius: 20,
    marginHorizontal  : 10,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Card;
