import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import DateTimePickerModal from '../components/DateTimePickerModal';
import { Alert } from 'react-native';
import CustomText from '../components/CustomText';

type ChatRouteParams = {
  item?: { name: string; price: string; location: string; description: string; image: { uri: string } };
  buyer?: { name: string };
  seller?: { name: string };
  // suggestions?: string[];
};

const Chat = () => {
  const route = useRoute<RouteProp<Record<string, ChatRouteParams>, string>>();
  const navigation = useNavigation();
  // Add fallback/default values for buyer, seller, and item for robustness
  const { item = { name: '', price: '', location: '', description: '', image: { uri: '' } }, buyer = { name: 'You' }, seller = { name: 'Seller' }} = route.params || {};
  // Define local mock data
// const buyer = { name: 'You' }; // or any default/mock name
// const seller = { name: 'Seller' }; // or any default/mock name
// const item = {}; // or provide mock item data if needed
  const [messages, setMessages] = useState([
    { id: '1', sender: seller?.name || 'Seller', text: 'Hello! How can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now().toString(), sender: buyer?.name || 'You', text: input }]);
      setInput('');
    }
  };

  // If critical chat params are missing, show a helpful message
  if (!buyer || !seller) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.header}>Chat cannot be started. Missing chat participants.</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.header}>Chat with {seller?.name || 'Seller'}</CustomText>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={item.sender === (buyer?.name || 'You') ? styles.buyerMsg : styles.sellerMsg}>
            <CustomText>{item.text}</CustomText>
          </View>
        )}
        style={styles.messages}
      />
      {/* {suggestions.length > 0 && (
  <View style={styles.suggestionContainer}>
    {suggestions.map((msg, index) => (
      <TouchableOpacity
        key={index}
        style={styles.suggestionChip}
        onPress={() => {
          setMessages([...messages, {
            id: Date.now().toString(),
            sender: buyer?.name || 'You',
            text: msg
          }]);
        }}
      >
        <CustomText style={styles.suggestionText}>{msg}</CustomText>
      </TouchableOpacity>
    ))}
  </View>
)} */}

      {/* Date & Time Picker Button */}
      <TouchableOpacity style={styles.dateTimeButton} onPress={() => setDateTimeModalVisible(true)}>
        <CustomText style={styles.dateTimeButtonText}>Pick Date & Time</CustomText>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor={'gray'}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <CustomText style={styles.sendButtonText}>Send</CustomText>
        </TouchableOpacity>
      </View>

      {/* DateTimePickerModal */}
      <DateTimePickerModal
        visible={dateTimeModalVisible}
        onClose={() => setDateTimeModalVisible(false)}
        onConfirm={(date) => {
          setSelectedDateTime(date); // Save to variable
          setMessages([
            ...messages,
            {
              id: Date.now().toString(),
              sender: buyer?.name || 'You',
              text: `Selected Date & Time: ${date.toLocaleString()}`
            }
          ]);
          setDateTimeModalVisible(false);
        }}
      />
      {selectedDateTime && (
        (() => { Alert.alert(
          'Deal Confirmation',
          'Confirm your deal within 48 hours on the app from the selected date and time.',
          [
            {
              text: 'Confirm',
              onPress: () => {
                // Handle confirmation logic here
                navigation.navigate('Rating');
                
              }
            },
            {
              text: 'Cancel',
              onPress: () => {
                // Handle cancellation logic here
              }
            }
          ]
          );
        return null; })()
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  messages: { flex: 1 },
  buyerMsg: { alignSelf: 'flex-end', backgroundColor: '#d1ffd1', padding: 8, borderRadius: 8, marginVertical: 2 },
  sellerMsg: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0', padding: 8, borderRadius: 8, marginVertical: 2 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
  sendButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  dateTimeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  suggestionChip: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#333',
  },
  
});

export default Chat;
