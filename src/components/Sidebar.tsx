import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomText from './CustomText';

type SidebarProps = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, setSelectedCategory }) => {
  const navigation = useNavigation();

  const categories = [
    { name: 'Toys', icon: require('../assets/toys.jpg') },
    { name: 'Books', icon: require('../assets/books.jpg') },
    { name: 'Sports', icon: require('../assets/sports.png') },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.sidebar}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => {
              setSelectedCategory(category.name);
              navigation.navigate(category.name);
            }}
            style={[
              styles.category,
              selectedCategory === category.name && styles.activeCategory,
            ]}
          >
            <Image source={category.icon} style={styles.icon} />
            <CustomText style={[styles.text, selectedCategory === category.name && styles.activeText]}>
              {category.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sidebar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginHorizontal: 4,
  },
  activeCategory: {
    backgroundColor: '#1E232C',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 50,
  },
  text: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
});

export default Sidebar;
