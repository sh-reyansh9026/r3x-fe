// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../types/navigation';
// import { itemsToys, itemsBook, itemsSport } from '../constants/constant';
// import Card from '../components/Card';
// import Footer from '../components/Footer';
// import Icon from 'react-native-vector-icons/FontAwesome'
// import Items from './Items';
// import CustomText from '../components/CustomText';
// import api from '../config/api';
// // import { BASE_URL } from '@env';


// interface ItemType {
//   id: string;
//   name?: string;
//   title?: string;
//   price: string;
//   location: string;
//   description?: string;
//   category: string;
//   image: string | { uri: string };
//   rating?: number;
// }

// const screenWidth = Dimensions.get('window').width;
// const cardWidth = (screenWidth - 36) / 2.5; // 16 padding + 4*2 spacing // 36 = paddingHorizontal * 2 + margin between cards

// type BuyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// const Buy = () => {
//   const navigation = useNavigation<BuyScreenNavigationProp>();

// const [categories, setCategories] = useState<any>([]);
// const [isLoadingCategories, setIsLoadingCategories] = useState(true);
// const [isLoading, setIsLoading] = useState(false);
// const [apiItems, setApiItems] = useState<any>([]);
// const [error, setError] = useState<string | null>(null);
// const [isRefreshing, setIsRefreshing] = useState(true);

// const fetchCategories = async () => {
//   try {
//     const response = await api.get(`/api/categories`);

//     const categoryArray = response.data.data;
//     const formatted = categoryArray.map((cat: any) => ({
//         id: cat._id,
//         name: cat.name,
//       }));

//     setCategories(formatted);
//   } catch (error: any) {
//     console.error("Error fetching categories:", error?.response?.data || error.message);
//   } finally {
//     setIsLoadingCategories(false);
//   }
// };

// useEffect(() => {
//   const loadData = async () => {
//     await fetchCategories();
//     await fetchItems();
//   };
//   loadData();
// }, []);

// const fetchItems = async () => {
//   //if (!userId) return; // Don't fetch if user ID is not available
  
//   try {
//     setIsLoading(true);
//     const response = await api.get(`/api/v1/items`, {
//       params: {
//         page: 1,
//         limit: 100, // Increased limit to show more items
//         //userId: userId, // Filter items by user ID
//       },
//     });

//     const items = response.data?.data?.results || [];
//     const formatted = items.map((item: any) => ({
//       id: item._id,
//       name: item.name,
//       title: item.title,
//       price: item.price,
//       location: item.location,
//       description: item.description,
//       category: item.category,
//       image: item.images?.[0],
//       rating: item.rating,
//       isRequested: item.isRequested || false,
//       isListed: item.isListed || true,
//     }));

//     setApiItems(formatted);
//     setError(null);
//   } catch (err: any) {
//     console.error('Error fetching items:', err);
//     setError('Failed to fetch your listed items. Please check your connection.');
//   } finally {
//     setIsLoading(false);
//     setIsRefreshing(false);
//   }
// };


// // Group items by category name
// const groupedItemsByCategory = categories.map((category: any) => {
//   const items = apiItems.filter(
//     (item: any) => {
//       const matches = item.category &&
//         item.category.toLowerCase() === category.name.toLowerCase() &&
//         item.isListed !== false; // Ensure we only show listed items
     
//       return matches;
//     }
//   );
  
//   return {
//     ...category,
//     items,
//   };
// });



//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.buyPage}>
//         {isLoading ? (
//           <Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>Loading items...</Text>
//         ) : error ? (
//           <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>{error}</Text>
//         ) : (
//           groupedItemsByCategory.map((categoryGroup: any) => (
//             <View key={categoryGroup.id}>
//               <View style={styles.categoryTextContainer}>
//                 <CustomText style={styles.categoryText}>{categoryGroup.name}</CustomText>
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('Items', {
//                       item: {
//                         category: categoryGroup.name,
//                       },
//                     })
//                   }
//                 >
//                   <Icon name="arrow-right" size={20} color="white" style={styles.arrow} />
//                 </TouchableOpacity>
//               </View>
//               {categoryGroup.items.length > 0 ? (
//                 <FlatList
//                   data={categoryGroup.items}
//                   keyExtractor={(item) => item.id}
//                   horizontal={true}
//                   showsHorizontalScrollIndicator={false}
//                   renderItem={({ item }) => (
//                     <View style={styles.cardContainer}>
//                       <Card
//                         id={item.id}
//                         title={item.name || item.title}
//                         price={item.price}
//                         location={item.location}
//                         description={item.description}
//                         category={item.category}
//                         image={typeof item.image === 'string' ? { uri: item.image } : item.images}
//                         rating={item.rating || 0}
//                         isRequested={false}
//                         isListed={false}
//                       />
//                     </View>
//                   )}
//                 />
//               ) : (
//                 <Text style={{color: 'white', textAlign: 'center', marginVertical: 10}}>
//                   No items in this category
//                 </Text>
//               )}
//             </View>
//           ))
//         )}
//       </ScrollView>


//       <Footer/>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//   },
//   buyPage:{
//     marginBottom:82
//   },
//   categoryText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: 'white',
//     marginHorizontal: 10,
//     marginTop: 10,
//     marginBottom: 16
//   },
//   categoryTextContainer:{
//     flexDirection:"row",
//     alignItems:"center",
//     justifyContent:"space-between",
//     marginHorizontal:10,
//   },
//   arrow:{
//     paddingLeft: 8
//   },
//   cardContainer: {
//     width: cardWidth,
//     marginBottom: 32,
//   },

// });

// export default Buy;
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { itemsToys, itemsBook, itemsSport } from '../constants/constant';
import Card from '../components/Card';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome'
import Items from './Items';
import CustomText from '../components/CustomText';
import api from '../config/api';
// import { BASE_URL } from '@env';


interface ItemType {
  id: string;
  name?: string;
  title?: string;
  price: string;
  location: string;
  description?: string;
  category: string;
  image: string | { uri: string };
  rating?: number;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 36) / 2.5; // 16 padding + 4*2 spacing // 36 = paddingHorizontal * 2 + margin between cards

type BuyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Buy = () => {
  const navigation = useNavigation<BuyScreenNavigationProp>();

const [categories, setCategories] = useState<any>([]);
const [isLoadingCategories, setIsLoadingCategories] = useState(true);
const [isLoading, setIsLoading] = useState(false);
const [apiItems, setApiItems] = useState<any>([]);
const [error, setError] = useState<string | null>(null);
const [isRefreshing, setIsRefreshing] = useState(true);

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
  const loadData = async () => {
    await fetchCategories();
    await fetchItems();
  };
  loadData();
}, []);

const fetchItems = async () => {
  //if (!userId) return; // Don't fetch if user ID is not available
  
  try {
    setIsLoading(true);
    const response = await api.get(`/api/v1/items`, {
      params: {
        page: 1,
        limit: 100, // Increased limit to show more items
        //userId: userId, // Filter items by user ID
      },
    });

    const items = response.data?.data?.results || [];
    const formatted = items.map((item: any) => ({
      id: item._id,
      name: item.name,
      title: item.title,
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


// Group items by category name
const groupedItemsByCategory = categories.map((category: any) => {
  const items = apiItems.filter(
    (item: any) => {
      const matches = item.category &&
        item.category.toLowerCase() === category.name.toLowerCase() &&
        item.isListed !== false; // Ensure we only show listed items
     
      return matches;
    }
  );
  
  return {
    ...category,
    items,
  };
});



  return (
    <View style={styles.container}>
      <ScrollView style={styles.buyPage}>
        {isLoading ? (
          <Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>Loading items...</Text>
        ) : error ? (
          <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>{error}</Text>
        ) : (
          groupedItemsByCategory.map((categoryGroup: any) => (
            <View key={categoryGroup.id}>
              <View style={styles.categoryTextContainer}>
                <CustomText style={styles.categoryText}>{categoryGroup.name}</CustomText>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Items', {
                      item: {
                        category: categoryGroup.name,
                      },
                    })
                  }
                >
                  <Icon name="arrow-right" size={20} color="white" style={styles.arrow} />
                </TouchableOpacity>
              </View>
              {categoryGroup.items.length > 0 ? (
                <FlatList
                  data={categoryGroup.items}
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
                        description={item.description}
                        category={item.category}
                        image={typeof item.image === 'string' ? { uri: item.image } : item.images}
                        rating={item.rating || 0}
                        isRequested={false}
                        isListed={false}
                      />
                    </View>
                  )}
                />
              ) : (
                <Text style={{color: 'white', textAlign: 'center', marginVertical: 10}}>
                  No items in this category
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>


      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F4EF',
  },
  headerBanner: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 180,
    backgroundColor: '#E9DED1',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlayTextContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#E1E8D9',
  },
  marqueeWrapper: {
    backgroundColor: '#A3B18A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  marqueeText: {
    color: '#2F3E2E',
    fontSize: 14,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A5A40',
  },
  cardContainer: {
    width: cardWidth,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D6DBD2',
  },
  cardDetails: {
    padding: 10,
    backgroundColor: '#F9F9F7',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F3E2E',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5A40',
    marginTop: 2,
  },
  itemLocation: {
    fontSize: 12,
    color: '#78866B',
    marginTop: 1,
  },
  buyPage: {
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
});

export default Buy;
