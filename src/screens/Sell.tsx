import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card';
import { requestedItems, listedItems } from '../constants/constant';
import Footer from '../components/Footer';
import CustomText from '../components/CustomText';
import { RootStackParamList } from '../types/navigation';
import api from '../config/api';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 36) / 2.5; // 16 padding + 4*2 spacing // 36 = paddingHorizontal * 2 + margin between cards

type SellScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sell'>;

const Sell = () => {
  const navigation = useNavigation<SellScreenNavigationProp>();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [apiItems, setApiItems] = useState<any>([]);
  const [requestedItems, setRequestedItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);

  // Get current user ID from your authentication context or storage
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Replace this with your actual method of getting the current user ID
        // For example, if you're using AsyncStorage:
        // const userData = await AsyncStorage.getItem('userData');
        // const user = userData ? JSON.parse(userData) : null;
        // setUserId(user?._id);
        
        // For demo, we'll use a placeholder user ID
        const user = await AsyncStorage.getItem('userId');
        setUserId(user);
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getCurrentUser();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await api.get(`/api/categories`);
      const categoryArray = response.data.data;
      const formatted = categoryArray.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
        }));
  
      setCategories(formatted);
    } catch (error: any) {
      console.error("Error fetching categories:", error?.response?.data || error.message);
    } finally {
      setIsLoadingCategories(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    if (!userId) return; // Don't fetch if user ID is not available
    
    try {
      const response = await api.get(`/api/v1/items`, {
        params: {
          page: 1,
          limit: 100, // Increased limit to show more items
          //userId: userId, // Filter items by user ID
        },
      });
      const items = response.data?.data?.results || [];
      // for listing items
      const formatted = items.map((item: any) => ({
        id: item._id,
        username: item.username,
        title: item.title,
        user: item.user,
        price: item.price,
        location: item.location,
        description: item.description,
        category: item.category,
        image: item.images?.[0],
        rating: item.rating,
        isRequested: item.isRequested || false,
        isListed: item.isListed || true,
      }));
      setApiItems(formatted);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch your listed items. Please check your connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  const fetchRequestedItems = async () => {
    if (!userId) return;
    
    try {
      
      setRequestsError(null);
      
      const token = await AsyncStorage.getItem('token');
      const response = await api.get(`/api/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // for requested items
      const formattedItems = response.data.data.map((item: any) => ({
        id: item._id,
        username: item.username,
        title: item.title,
        price: item.price,
        location: item.location,
        description: item.description,
        category: item.category?.name || 'Other',
        image: item.images?.[0],
        rating: 0,
        isRequested: true,
        isListed: false
      }));
      
      setRequestedItems(formattedItems);
    } catch (err: any) {
      console.error('Error fetching requested items:', err);
      setRequestsError('Failed to load requested items. Please try again.');
    } finally {
      setIsLoadingRequests(false);
    }
  };
  // Main effect to fetch data when component mounts or when userId changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchItems();
      await fetchRequestedItems();
    };
    
    fetchData();
  }, [userId, fetchCategories, fetchItems, fetchRequestedItems]);

  const filteredItems = apiItems.filter((item: any) => {
    const matchedItems = item.user === userId;
    return matchedItems;
  });

  return (
    <View style={styles.container}>
      <View>
        {/* Listed Items Section */}
        <View style={styles.section}>
          <CustomText weight="bold" style={styles.heading}>Listed Items</CustomText>
          {isLoading ? (
            <CustomText style={styles.loadingText}>Loading your items...</CustomText>
        ) : error ? (
          <CustomText style={styles.errorText}>{error}</CustomText>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <CustomText style={styles.emptyText}>You haven't listed any items yet.</CustomText>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <Card
                  id={item.id}
                  title={item.name || item.title}
                  price={item.price}
                  location={item.location}
                  category={item.category || 'Other'}
                  image={typeof item.image === 'string' ? { uri: item.image } : item.image}
                  rating={item.rating || 0}
                  isRequested={item.isRequested}
                  isListed={item.isListed}
                  description={item.description}
                  username={item.username}
                />
              </View>
            )}
          />
        )}
      </View>
      {/* these requested items are items which are requested by other users */}
      {/* <View style={styles.section}>
        <CustomText weight="bold" style={styles.heading}>
          Requested Items
        </CustomText>
        <View style={styles.comingSoonContainer}>
          <CustomText style={styles.comingSoonText}>Items Requested by the users</CustomText>
        </View>
      </View> */}
      {/* Requested Items Section */}
      <View style={styles.section}>
          <CustomText weight="bold" style={styles.heading}>Requested Items</CustomText>
          {isLoadingRequests ? (
            <CustomText style={styles.loadingText}>Loading requested items...</CustomText>
          ) : requestsError ? (
            <CustomText style={styles.errorText}>{requestsError}</CustomText>
          ) : requestedItems.length === 0 ? (
            <View style={styles.emptyState}>
              <CustomText style={styles.emptyText}>No requested items found</CustomText>
            </View>
          ) : (
            <FlatList
              data={requestedItems}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Card
                    id={item.id}
                    title={item.name || item.title}
                    price={item.price}
                    location={item.location}
                    description={item.description}
                    category={item.category}
                    image={item.image ? { uri: item.image } : ''}
                    rating={item.rating || 0}
                    isRequested={true}
                    isListed={false}
                    username={item.username}
                  />
                </View>
              )}
            />
          )}
        </View>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('ListItems')}
      >
        <CustomText style={styles.buttonText}>List New Item</CustomText>
      </TouchableOpacity>
      
    </View>
    <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 12,
    backgroundColor: '#0F130F',
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    paddingLeft: 8,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  horizontalList: {
    paddingRight: 12,
  },
  cardContainer: {
    width: cardWidth,
    marginRight: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    marginTop: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: 200,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comingSoonContainer: {
    padding: 20,
    backgroundColor: 'rgba(26, 31, 26, 0.8)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  comingSoonText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  listedItemsContainer: {
    flex: 1,
  },
  // addButton: {
  //   backgroundColor: '#4CAF50',
  //   padding: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   marginVertical: 16,
  // },
  // addButtonText: {
  //   color: '#fff',
  //   fontWeight: 'bold',
  // }
});

export default Sell;
