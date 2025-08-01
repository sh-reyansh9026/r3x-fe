import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, FlatList, Image, TextInput, Switch,
  TouchableOpacity, StyleSheet, Animated, Modal, ScrollView
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Sell from "./Sell";
import { recommendations } from '../constants/constant';
import Buy from "./Buy";
import CustomText from '../components/CustomText';
import api from '../config/api';


type HomePageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomePage'>;

const HomePage = () => {
  const placeholderTexts = [`"Toys"`, `"Books"`, `"Sports"`];
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<HomePageNavigationProp>();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [location, setLocation] = useState('');
  const [isBuyMode, setIsBuyMode] = useState(true);
  const [filters, setFilters] = useState<{ min?: number; max?: number; location?: string }>({});
  const isMounted = useRef(true);
  const [inputRange, setInputRange] = useState<number[]>([]);
  const [inputLocation, setInputLocation] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selected, setSelected] = useState('HomePage');

  // Backend category data
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const fetchCategories = async () => {
    try {
      const response = await api.get(`/api/categories`); // replace with your actual backend URL
      const data = response.data?.data?.results || [];
      setCategories(data);
    } catch (err) {
      console.log("Error fetching categories", err);
      setError("Failed to load categories");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredRecommendations = recommendations.filter(item => {
    let passes = true;
    const priceNum = parseInt(item.price.replace(/\D/g, ""), 10);
    if (filters.min !== undefined && filters.min !== null) {
      passes = passes && priceNum >= filters.min;
    }
    if (filters.max !== undefined && filters.max !== null) {
      passes = passes && priceNum <= filters.max;
    }
    if (filters.location && filters.location.trim() !== "") {
      passes = passes && item.location.toLowerCase().includes(filters.location.trim().toLowerCase());
    }
    return passes;
  });

  useEffect(() => {
    isMounted.current = true;
    let animationInterval: NodeJS.Timeout;

    const animateText = () => {
      if (!isMounted.current) return;

      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -20, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        if (!isMounted.current) return;
        setIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    };

    animationInterval = setInterval(animateText, 2000);

    return () => {
      isMounted.current = false;
      clearInterval(animationInterval);
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const openCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const rotateInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.mainContainer}>
      {/* upper header */}
      <View style={styles.upperHeader}>
        <TouchableOpacity onPress={openCategory}>
          <Image source={require("../assets/menu.png")} style={styles.menuIcon} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <CustomText style={styles.logo}>R3X</CustomText>
        </View>
      <Animated.Image
          // source={require('../assets/menu.png')}
          style={[styles.loader, {transform: [{rotate: rotateInterpolate}]}]}
        />
      </View>

      {isCategoryOpen && (
        <ScrollView
          style={styles.categoryContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {categories.map((category, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => navigation.navigate(category.name)}
              style={styles.categoryButton}>
              <Image
                source={{uri: category.icon}}
                style={styles.categoryImage}
              />
              <CustomText style={styles.categoryName}>
                {category.name}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* buy/sell toggle
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setSelected('HomePage')}
          style={[styles.option, selected === 'HomePage' && styles.activeOption]}>
          <CustomText style={[styles.optionText, selected === 'HomePage' && styles.activeText]}>
            Buy
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected('Sell')}
          style={[styles.option, selected === 'Sell' && styles.activeOption]}>
          <CustomText style={[styles.optionText, selected === 'Sell' && styles.activeText]}>
            Sell
          </CustomText>
        </TouchableOpacity>
      </View> */}

      {/* Toggle Buy/Sell */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setSelected('HomePage')}
          style={[
            styles.toggleButton,
            selected === 'HomePage' && styles.activeToggle,
          ]}>
          <CustomText
            style={[
              styles.toggleText,
              selected === 'HomePage' && styles.activeText,
            ]}>
            Buy
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected('Sell')}
          style={[
            styles.toggleButton,
            selected === 'Sell' && styles.activeToggle,
          ]}>
          <CustomText
            style={[
              styles.toggleText,
              selected === 'Sell' && styles.activeText,
            ]}>
            Sell
          </CustomText>
        </TouchableOpacity>
      </View>

      {selected === 'Sell' ? <Sell /> : <Buy />}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  upperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  loader: {
    width: 24,
    height: 24,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#2E3628',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 22,
    alignSelf: 'center',
    width: '100%',
  },
  option: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOption: {
    backgroundColor: '#1E232C',
  },
  optionText: {
    color: '#A0A0A0',
    fontWeight: '600',
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: '#DCE3D3',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 16,
  },
  categoryButton: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: 'black',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E1E8D9',
    borderRadius: 24,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggle: {
    backgroundColor: '#78866B',
  },
  toggleText: {
    fontSize: 16,
    color: '#5A6B4D',
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default HomePage;
