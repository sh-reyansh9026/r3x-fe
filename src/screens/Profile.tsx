import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import CustomText from '../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileProps {
  isBuyMode: boolean;
}

const Profile: React.FC<ProfileProps> = ({ isBuyMode }) => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  
  const [user,setUser] = useState(null);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      setUser(null); 
      navigation.replace('Login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const [profileData, setProfileData] = useState({
    name: 'Shreyansh',
    email: 'sh.reyansh9026@gmail.com',
    shippingAddress: '123 Main St, City, Country',
    location: '123 Main St, City, Country',
  });

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    setIsEditModalVisible(false);
    // Here you would typically save the data to your backend
  };

  const handleHelpSupport = () => {
    setIsHelpModalVisible(true);
  };

  const handleTermsConditions = () => {
    setIsTermsModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CustomText style={styles.backButton}>←</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.title}>Profile</CustomText>
        <View style={styles.modeIndicator}>
          <CustomText style={styles.modeText}>{isBuyMode ? 'Buyer' : 'Seller'}</CustomText>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Image 
          source={require('../assets/profile.png')} 
          style={styles.profileImage}
        />
        <CustomText style={styles.name}>{profileData.name}</CustomText>
        <CustomText style={styles.email}>{profileData.email}</CustomText>
      </View>

      {/* {isBuyMode ? ( */}
        // Buyer Profile Fields
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Buyer Information</CustomText>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Address</CustomText>
            <CustomText style={styles.value}>{profileData.shippingAddress}</CustomText>
          </View>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Purchase History</CustomText>
            <CustomText style={styles.value}>5 items purchased</CustomText>
          </View>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Rating</CustomText>
            <CustomText style={styles.value}>4.8/5.0</CustomText>
          </View>
        </View>
      {/* ) : ( */}
        // Seller Profile Fields
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>Seller Information</CustomText>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Address</CustomText>
            <CustomText style={styles.value}>{profileData.shippingAddress}</CustomText>
          </View>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Items Listed</CustomText>
            <CustomText style={styles.value}>12 items</CustomText>
          </View>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Sales</CustomText>
            <CustomText style={styles.value}>8 items sold</CustomText>
          </View>
          <View style={styles.infoCard}>
            <CustomText style={styles.label}>Rating</CustomText>
            <CustomText style={styles.value}>4.8/5.0</CustomText>
          </View>
        </View>
      {/* )} */}

      {/* Additional Sections */}
      <View style={styles.section}>
        <CustomText style={styles.sectionTitle}>Account Settings</CustomText>
        <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
          <CustomText style={styles.settingLabel}>Edit Profile</CustomText>
          <CustomText style={styles.settingArrow}>›</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleHelpSupport}>
          <CustomText style={styles.settingLabel}>Help & Support</CustomText>
          <CustomText style={styles.settingArrow}>›</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleTermsConditions}>
          <CustomText style={styles.settingLabel}>Terms & Conditions</CustomText>
          <CustomText style={styles.settingArrow}>›</CustomText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress = {handleLogout}>
        <CustomText style={styles.logoutButtonText}>Logout</CustomText>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CustomText style={styles.modalTitle}>Edit Profile</CustomText>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <CustomText style={styles.closeButton}>✕</CustomText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <CustomText style={styles.inputLabel}>Name</CustomText>
                <TextInput
                  style={styles.input}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData({...profileData, name: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <CustomText style={styles.inputLabel}>Email</CustomText>
                <TextInput
                  style={styles.input}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({...profileData, email: text})}
                />
              </View>
              {isBuyMode ? (
                <>
                  <View style={styles.inputGroup}>
                    <CustomText style={styles.inputLabel}>Shipping Address</CustomText>
                    <TextInput
                      style={styles.input}
                      value={profileData.shippingAddress}
                      onChangeText={(text) => setProfileData({...profileData, shippingAddress: text})}
                    />
                  </View>
                  
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                   
                  </View>
                  <View style={styles.inputGroup}>
                    <CustomText style={styles.inputLabel}>Location</CustomText>
                    <TextInput
                      style={styles.input}
                      value={profileData.location}
                      onChangeText={(text) => setProfileData({...profileData, location: text})}
                    />
                    
                  </View>
                </>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setIsEditModalVisible(false)}>
                <CustomText style={styles.cancelButtonText}>Cancel</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveProfile}>
                <CustomText style={styles.saveButtonText}>Save</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isHelpModalVisible}
        onRequestClose={() => setIsHelpModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CustomText style={styles.modalTitle}>Help & Support</CustomText>
              <TouchableOpacity onPress={() => setIsHelpModalVisible(false)}>
                <CustomText style={styles.closeButton}>✕</CustomText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <CustomText style={styles.helpText}>
                Welcome to R3X Support! Here's how we can help you:
                {'\n\n'}
                1.XYZ
                {'\n\n'}
                2.XYZ
                {'\n\n'}
                3.XYZ
              </CustomText>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setIsHelpModalVisible(false)}>
                <CustomText style={styles.closeButtonText}>Close</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Terms & Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTermsModalVisible}
        onRequestClose={() => setIsTermsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <CustomText style={styles.modalTitle}>Terms & Conditions</CustomText>
              <TouchableOpacity onPress={() => setIsTermsModalVisible(false)}>
                <CustomText style={styles.closeButton}>✕</CustomText>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <CustomText style={styles.termsText}>
                Welcome to R3X! Please read these terms carefully.
                {'\n\n'}
                1.XYZ
                {'\n\n'}
                2.XYZ
                {'\n\n'}
                3.XYZ
                {'\n\n'}
                By using R3X, you agree to these terms and conditions.
              </CustomText>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setIsTermsModalVisible(false)}>
                <CustomText style={styles.closeButtonText}>Close</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F130F",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: "#0F130F",
  },
  backButton: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modeIndicator: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  modeText: {
    color: 'slategray',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#0F130F",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white'
  },
  email: {
    fontSize: 16,
    color: '#666',

  },
  section: {
    padding: 15,
    backgroundColor: "#0F130F",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white'
  },
  infoCard: {
    backgroundColor: "#2E352B",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white'
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: 'white',

  },
  settingArrow: {
    fontSize: 20,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: "#0F130F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white'
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    maxHeight: '70%',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007BFF',
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButtonText: {
    color: 'white',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#2E352B",
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  helpText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  closeButtonText: {
    color: '#666',
  },
});

export default Profile; 