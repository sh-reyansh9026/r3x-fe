import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../components/CustomText';
const BookingDetails = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    gender: '',
    pickupDate: new Date(),
    location: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showPickupDate, setShowPickupDate] = useState(false);

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const validateForm = () => {
    if (!formData.fullName) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.email) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.contact) {
      Alert.alert('Error', 'Please enter your contact number');
      return false;
    }
    if (!formData.gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    return true;
  };

  const handlePayNow = () => {
    if (currentStep === 1) {
      if (validateForm()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      // Move to confirmation step
      setCurrentStep(3);
    } else {
      // Final confirmation
      Alert.alert(
        'Booking Confirmed',
        'Your booking has been confirmed. Please pay cash at the time of pickup.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const onPickupDateChange = (event: any, selectedDate?: Date) => {
    setShowPickupDate(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ 
        ...prev, 
        pickupDate: selectedDate,
      }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name*"
              placeholderTextColor="gray"
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address*"
              keyboardType="email-address"
              placeholderTextColor="gray"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact*"
              keyboardType="phone-pad"
              placeholderTextColor="gray"
              value={formData.contact}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contact: text }))}
            />

            <CustomText style={styles.sectionTitle}>Gender</CustomText>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, formData.gender === 'Male' && styles.selectedGender]}
                onPress={() => handleGenderSelect('Male')}
              >
                <Icon name="person" size={20} color={formData.gender === 'Male' ? '#fff' : '#000'} />
                <CustomText style={[styles.genderText, formData.gender === 'Male' && styles.selectedGenderText]}>Male</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, formData.gender === 'Female' && styles.selectedGender]}
                onPress={() => handleGenderSelect('Female')}
              >
                <Icon name="person" size={20} color={formData.gender === 'Female' ? '#fff' : '#000'} />
                <CustomText style={[styles.genderText, formData.gender === 'Female' && styles.selectedGenderText]}>Female</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, formData.gender === 'Others' && styles.selectedGender]}
                onPress={() => handleGenderSelect('Others')}
              >
                <Icon name="person" size={20} color={formData.gender === 'Others' ? '#fff' : '#000'} />
                <CustomText style={[styles.genderText, formData.gender === 'Others' && styles.selectedGenderText]}>Others</CustomText>
              </TouchableOpacity>
            </View>

            <View style={styles.dateContainer}>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowPickupDate(true)}
              >
                <CustomText style={styles.dateLabel}>Pick up Date</CustomText>
                <CustomText style={styles.dateValue}>{formatDate(formData.pickupDate)}</CustomText>
              </TouchableOpacity>
            </View>

            <CustomText style={styles.sectionTitle}>Item Location</CustomText>
            <TouchableOpacity style={styles.locationInput}>
              <Icon name="location-on" size={20} color="#666" />
              <CustomText style={styles.locationText}>India</CustomText>
            </TouchableOpacity>
          </>
        );
      case 2:
        return (
          <View style={styles.paymentContainer}>
            <Icon name="payments" size={60} color="#1E232C" />
            <CustomText style={styles.paymentTitle}>Cash Payment Only</CustomText>
            <CustomText style={styles.paymentText}>
              Please note that payment will be collected in cash at the time of pickup.
            </CustomText>
            <View style={styles.paymentDetails}>
              <CustomText style={styles.paymentLabel}>Amount to be paid:</CustomText>
              <CustomText style={styles.paymentAmount}>$1400</CustomText>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.confirmationContainer}>
            <Icon name="check-circle" size={80} color="#4CAF50" />
            <CustomText style={styles.confirmationTitle}>Booking Summary</CustomText>
            <View style={styles.summaryItem}>
              <CustomText style={styles.summaryLabel}>Name:</CustomText>
              <CustomText style={styles.summaryValue}>{formData.fullName}</CustomText>
            </View>
            <View style={styles.summaryItem}>
              <CustomText style={styles.summaryLabel}>Pickup Date:</CustomText>
              <CustomText style={styles.summaryValue}>{formatDate(formData.pickupDate)}</CustomText>
            </View>
            <View style={styles.summaryItem}>
              <CustomText style={styles.summaryLabel}>Location:</CustomText>
              <CustomText style={styles.summaryValue}>India</CustomText>
            </View>
            <View style={styles.summaryItem}>
              <CustomText style={styles.summaryLabel}>Amount:</CustomText>
              <CustomText style={styles.summaryValue}>$1400</CustomText>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Shopping Details</CustomText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, styles.activeStep]} />
          <CustomText style={styles.stepText}>Shopping details</CustomText>
        </View>
        <View style={[styles.progressLine, currentStep >= 2 && styles.activeLine]} />
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStep]} />
          <CustomText style={styles.stepText}>Payment</CustomText>
        </View>
        <View style={[styles.progressLine, currentStep === 3 && styles.activeLine]} />
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, currentStep === 3 && styles.activeStep]} />
          <CustomText style={styles.stepText}>Confirmation</CustomText>
        </View>
      </View>

      <ScrollView style={styles.formContainer}>
        {renderStepContent()}
      </ScrollView>

      {showPickupDate && (
        <DateTimePicker
          value={formData.pickupDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickupDateChange}
          minimumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
        <CustomText style={styles.payButtonText}>
          {currentStep === 1 ? 'Continue' : currentStep === 2 ? 'Confirm Payment Method' : 'Confirm'}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginBottom: 4,
  },
  activeStep: {
    backgroundColor: '#1E232C',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: '#1E232C',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  selectedGender: {
    backgroundColor: '#1E232C',
    borderColor: '#1E232C',
  },
  genderText: {
    marginLeft: 8,
    fontSize: 14,
  },
  selectedGenderText: {
    color: '#fff',
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dateInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: '#000',
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 24,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#1E232C',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  paymentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  paymentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  paymentDetails: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E232C',
    marginTop: 8,
  },
  confirmationContainer: {
    alignItems: 'center',
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    flex: 2,
    fontSize: 16,
    color: '#1E232C',
    fontWeight: '500',
  },
});

export default BookingDetails; 