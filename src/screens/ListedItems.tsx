import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Card from '../components/Card';
import { activeItems, pendingItems } from '../constants/constant';
import CustomText from '../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

type ItemStatus = 'active' | 'pending';

interface Item {
  id: string;
  image: string;
  title: string;
  rating: number;
  location: string;
  price: string;
  description: string;
  status: ItemStatus;
}


const ListedItems: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ItemStatus>('active');

const BASE_URL = "http://192.168.198.27:5000";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return activeItems;
      case 'pending':
        return pendingItems;
      default:
        return activeItems;
    }
  };

  const userData = AsyncStorage.getItem('userId');

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <CustomText style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <CustomText style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</CustomText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={renderTabContent()}
        renderItem={({ item }) => (
          <Card
            image={item.image}
            title={item.title}
            rating={item.rating}
            location={item.location}
            price={item.price}
            description={item.description}
            id={item.id}
            isListed={item.status === 'active'}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1E232C',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    padding: 8,
  },
});

export default ListedItems; 