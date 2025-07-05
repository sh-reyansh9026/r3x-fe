import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import CustomText from './CustomText';
type CategoryBarProps = {
  category: string;
};

const CategoryBar: React.FC<CategoryBarProps> = ({ category }) => {
  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity style={styles.categoryButton}>
        <CustomText>{category}</CustomText>
      </TouchableOpacity>
    </View>   
  )
}

const styles = StyleSheet.create({
    categoryContainer: {
        flex:1
      },
      categoryButton: {
        flexDirection: "row",
        backgroundColor: "#0F130F",
        borderColor:'slategray'
      }
})
export default CategoryBar