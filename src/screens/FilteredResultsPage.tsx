import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Card from '../components/Card';
import CustomText from '../components/CustomText';

type Props = NativeStackScreenProps<RootStackParamList, 'FilteredResultsPage'>;

const FilteredResultsPage: React.FC<Props> = ({ navigation, route }) => {
  const { filteredItems } = route.params;

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { item })}>
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
        <CustomText style={styles.itemName}>{item.title || item.name}</CustomText>
        <CustomText style={styles.itemPrice}>{item.price}</CustomText>
        <CustomText style={styles.itemLocation}>{item.location}</CustomText>
      </View>
    </TouchableOpacity>
  );

  const renderCard = ({ item }: any) => <Card {...item} />;

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Filtered Results</CustomText>
      <FlatList
        data={filteredItems}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderCard}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    flex: 1,
    alignItems: 'center',
    padding: 12,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#1E232C',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 12,
    color: '#666',
  },
});

export default FilteredResultsPage;
