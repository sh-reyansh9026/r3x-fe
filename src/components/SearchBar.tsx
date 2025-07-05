import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Image,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSearch }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="gray" />
        <View style={styles.inputWrapper}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={({ nativeEvent: { text } }) => onSearch(text)}
            style={styles.input}
            placeholder="Search items..."
            placeholderTextColor="#aaa"
            returnKeyType="search"
          />
        </View>
        {value ? (
          <TouchableOpacity 
          onPress={() => {
            onChangeText('');
            onSearch('');
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="times-circle" size={20} color="gray" style={styles.clearIcon} />
        </TouchableOpacity>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1F18',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'slategray',
    paddingHorizontal: 10,
    margin: 10,
    marginBottom:30,
  },

  clearIcon: {
    marginLeft: 8,
    marginRight: 4,
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    position: 'relative',
    },
  input: {
    fontSize: 16,
    color: 'white',
    paddingVertical:10
  },
});

export default SearchBar;
