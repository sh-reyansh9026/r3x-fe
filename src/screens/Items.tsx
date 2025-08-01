import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList, Dimensions, RefreshControl, TextInput } from 'react-native';

import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import CustomText from '../components/CustomText';
import api from '../config/api';

type ItemsRouteProp = RouteProp<RootStackParamList, 'Items'>;

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 36) / 2;

const Items = ({navigation}: any) => {
  const route = useRoute<ItemsRouteProp>();
  const { category } = route.params.item;

  const [filteredItems, setFilteredItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category);

  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiItems, setApiItems] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/api/categories`, {
        params: {
          page: 1,
          limit: 100,
        },
      });

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

  // Filter items based on current filters
  const applyFilters = () => {
    let result = [...apiItems];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.username && item.name.toLowerCase().includes(query)) ||
        (item.title && item.title.toLowerCase().includes(query))
      );
    }
    
    return result;
  };


  // Handle search input change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category selection
  const handleCategoryPress = (category: string | null) => {
    setSelectedCategory(category);
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/v1/items`, {
        params: {
          page: 1,
          limit: 100,
        },
      });
      console.log("response",response);

      const itemsData = response.data?.data?.results || [];
      const formatted = itemsData.map((item: any) => ({
        id: item._id,
        username: item.user.username,
        title: item.title,
        price: item.price,
        location: item.location,
        description: item.description,
        category: item.category,
        image: item.images?.[0],
        rating: item.rating,
        user: item.user, 
      // "user": {
      //     "_id": "685432b67d7fe39dbf1c558d",
      //     "username": "sh.reyansh"
      // },
        isListed: item.isListed,
        isRequested: item.isRequested,
      }));

      setApiItems(formatted);
      // The useEffect will handle updating filteredItems
      console.log("formatted",formatted);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching items:', err);
      setError('Failed to fetch items. Please check your connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
 

 
  useEffect(() => {
    fetchItems();
  }, []);

   // Update filtered items when dependencies change
   useEffect(() => {
    if (apiItems.length > 0) {
      const filtered = applyFilters();
      setFilteredItems(filtered);
    }
  }, [apiItems, selectedCategory, searchQuery]);
  
  console.log("apiItems",apiItems);
  return (
    <View style={styles.container}>
      <CustomText style={styles.header}>{selectedCategory || 'All Items'}</CustomText>
      <SearchBar 
        value={searchQuery}
        onChangeText={handleSearch}
        onSearch={handleSearch}
      />

      <View style={styles.categoriesOuterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat: any) => (
            <TouchableOpacity 
              key={cat.id}
              style={[
                styles.categoryButton,
                selectedCategory === cat.name && styles.selectedCategory
              ]} 
              onPress={() => handleCategoryPress(cat.name)}
            >
              <CustomText style={styles.categoryButtonText}>
                {cat.name}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.flatListContainer}
        ListHeaderComponent={<View style={styles.headerSpacer} />}
        ListFooterComponent={<View style={styles.footerSpacer} />}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <Card
                id={item.id}
                title={item.name || item.title}
                price={item.price}
                location={item.location}
                description={item.description}
                category={item.category}
                image={typeof item.image === 'string' ? { uri: item.image } : item.images}
                rating={item.rating || 0}
                user={item.user}
                userId={item.userId}
                username={item.username}
                isListed={item.isListed}
                isRequested={item.isRequested}
              />
          </View>
        )}
      />
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F130F",
    paddingHorizontal: 12,
    paddingTop: 16
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center'
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "#0F130F",
  //   paddingHorizontal: 12,
  //   paddingTop: 16
  // },
  // header: {
  //   fontSize: 22,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  //   color: 'white',
  //   textAlign: 'center'
  // },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    width: cardWidth,
  },
  categoriesOuterContainer: {
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  flatListContainer: {
    paddingBottom: 80, // Space for the footer
    paddingTop: 8,
  },
  headerSpacer: {
    height: 16,
  },
  footerSpacer: {
    height: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#2A2E25',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Items;