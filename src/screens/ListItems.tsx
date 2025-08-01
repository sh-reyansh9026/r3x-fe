import React, { useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { uploadToCloudinary } from '../utils/cloudinary';

type RootStackParamList = {
  Login: undefined;
  // Add other screen names as needed
};
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary, launchCamera, Asset } from 'react-native-image-picker';
import CustomText from '../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';


const validationSchema = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  title: Yup.string().required('Item name is required'),
  description: Yup.string().required('Description is required'),
  //availableDate: Yup.date().required('Available date is required'),
  price: Yup.number().typeError('Must be a number').required('Expected price is required'),
  location: Yup.string().required('Location is required'),
  images: Yup.array().min(1, 'At least one image or video is required'),
});


const ListItems = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const requestPermissions = async () => {
    try{
    if (Platform.OS === 'android') {
      const grantedStorage = await PermissionsAndroid.request(
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs permission to access your media.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      const grantedCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs permission to use the camera.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      return (
        grantedStorage === PermissionsAndroid.RESULTS.GRANTED ||
        grantedCamera === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
    }catch(e){
      console.log(e);
    }
    };

  const pickMedia = async (setFieldValue: (field: string, value: any) => void, values: any) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'App needs permission to access your media and camera.');
      return;
    }

    launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 5,
      quality: 1,
    }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Something went wrong.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const newImages = [...(values.images || []), ...response.assets];
        setFieldValue('images', newImages);
      }
    });
  };

  const captureMedia = async (setFieldValue: (field: string, value: any) => void, values: any) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'App needs permission to use the camera.');
      return;
    }

    launchCamera({
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Something went wrong.');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const newImages = [...(values.images || []), ...response.assets];
        setFieldValue('images', newImages);
      }
    });
  };

  const removeMedia = (index: number, setFieldValue: (field: string, value: any) => void, values: any) => {
    const newImages = values.images.filter((_: any, i: number) => i !== index);
    setFieldValue('images', newImages);
  };

  const addForm = () => {
    setFormKey((prevKey) => prevKey + 1);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user");
      console.log(user);
      const userData = user ? JSON.parse(user) : null;
      setUserId(userData?._id || '');
      setUserName(userData?.username || '');
    };
    fetchUser();
  }, []);

  // Helper function to create proper file object for upload
  const createFormData = (photo: any, body: any = {}) => {
    const data = new FormData();
    
    // Extract file extension from URI or default to jpg
    const uriParts = photo.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    // Create file object
    const file = {
      uri: photo.uri,
      type: `image/${fileType}`,
      name: `image-${Date.now()}.${fileType}`,
    };
    
    // Append file and other fields to form data
    data.append('file', file as any);
    
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    
    return data;
  };
  
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
    fetchCategories();
  }, []);


  const handleSubmit = async (values: {
    title: string;
    description: string;
    category: string;
    price: string;
    location: string;
    images: any[];
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (values.images.length === 0) {
        throw new Error("Please select at least one image");
      }

      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found. Please log in again.');
      }
      const user = JSON.parse(userJson);

      // Create FormData
      const formData = new FormData();
      
      // Append text fields
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('category', values.category);
      formData.append('location', values.location);
      formData.append('user', user._id);

      // Append images
      values.images.forEach((image, index) => {
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1].toLowerCase();
        const mimeType = image.type || `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;
        
        // Create a file object from the image URI
        const file = {
          uri: image.uri,
          type: mimeType,
          name: `image-${Date.now()}-${index}.${fileType}`
        };
        
        // @ts-ignore - Append the file object directly
        formData.append('images', file);
      });

      console.log('Submitting item with data:', {
        title: values.title,
        category: values.category,
        imageCount: values.images.length,
        userId: user._id
      });

      // Make the API call
      const response = await api.post('/api/v1/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data) {
        Alert.alert("Success", "Item listed successfully");
        setFormKey(prevKey => prevKey + 1);
        return response.data;
      } else {
        throw new Error("No response data received from server");
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      
      let errorMessage = "Failed to list item. Please try again.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        await AsyncStorage.clear();
        Alert.alert('Session Expired', 'Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
        ]);
        return;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <CustomText style={styles.heading}>List an item</CustomText>
      <Formik
      key={formKey}
        initialValues={{
          category: '',
          title: '',
          description: '',
          // availableDate: new Date(),
          price: '',
          location: 'lko',
          images: [],
          user: userId,
          userName: userName
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.formWrapper}>
            {/* Category */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={values.category}
                onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                style={styles.picker}
                dropdownIconColor="#333"
              >
                <Picker.Item 
                  label="Select category" 
                  value=""
                  color="#808080" 
                />
                {categories.map((cat:any) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
                ))}
              </Picker>
            </View>
            {touched.category && errors.category && <CustomText style={styles.error}>{errors.category}</CustomText>}

            {/* Item Name */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && <CustomText style={styles.error}>{errors.title}</CustomText>}

            {/* Description */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              multiline
              numberOfLines={4}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
            {touched.description && errors.description && <CustomText style={styles.error}>{errors.description}</CustomText>}

            {/* Available Date */}
            {/* <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar" size={18} color="white" />
              <CustomText style={{ marginLeft: 10,color:"white" }}>{values.availableDate.toDateString()}</CustomText>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={values.availableDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setFieldValue('availableDate', selectedDate);
                }}
              />
            )}
            {touched.availableDate && errors.availableDate && (
              <CustomText style={styles.error}>{String(errors.availableDate)}</CustomText>
            )} */}

            {/* Expected Price */}
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              onChangeText={handleChange('price')}
              onBlur={handleBlur('price')}
              value={values.price}
            />
            {touched.price && errors.price && <CustomText style={styles.error}>{errors.price}</CustomText>}

            {/* Location */}
            {/* <CustomText style={styles.label}>Location</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              onChangeText={handleChange('location')}
              onBlur={handleBlur('location')}
              value={values.location}
            />
            {touched.location && errors.location && <CustomText style={styles.error}>{errors.location}</CustomText>} */}

            {/* Media Upload */}
              {/* <TouchableOpacity
                style={[styles.mediaButton, styles.galleryButton]}
                onPress={() => pickMedia(setFieldValue, values)}
              >
                <Icon name="photo" size={20} color="#333" />
                <CustomText style={styles.mediaButtonText}>Gallery</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaButton, styles.cameraButton]}
                onPress={() => captureMedia(setFieldValue, values)}
              >
                <Icon name="camera" size={20} color="#333" />
                <CustomText style={styles.mediaButtonText}>Camera</CustomText>
              </TouchableOpacity> */}

            <View style={styles.mediaContainer}>
              <CustomText style={styles.title}>Add photos</CustomText>
              <CustomText style={styles.subtitle}>Add up to 5 photos to show the item's condition</CustomText>
              {/* <TouchableOpacity style={styles.button}>
                <CustomText style={styles.buttonText}>Add photos</CustomText>
              </TouchableOpacity> */}
              <View style={styles.mediaButtonWrapper}>
              <TouchableOpacity
                style={[styles.mediaButton, styles.galleryButton]}
                onPress={() => pickMedia(setFieldValue, values)}
              >
                <Icon name="photo" size={20} color="#333" />
                <CustomText style={styles.mediaButtonText}>Gallery</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaButton, styles.cameraButton]}
                onPress={() => captureMedia(setFieldValue, values)}
              >
                <Icon name="camera" size={20} color="#333" />
                <CustomText style={styles.mediaButtonText}>Camera</CustomText>
              </TouchableOpacity>
              </View>
            </View>
            {touched.images && errors.images && <CustomText style={styles.error}>{errors.images}</CustomText>}

            {/* Media Preview */}
            {values.images && values.images.length > 0 && (
              <View style={styles.mediaPreview}>
                {values.images.map((item: Asset, index: number) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.mediaThumbnail}
                    />
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => removeMedia(index, setFieldValue, values)}
                    >
                      <Icon name="times-circle" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <CustomText style={styles.submitButtonText}>List Item</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      {/* Add More */}
      <TouchableOpacity style={styles.addMoreButton} onPress={addForm}>
        <CustomText style={styles.addMoreText}>+ List More Items</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1B1F18',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white'
  },
  formWrapper: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#1B1F18',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor:"#3d4545"
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor:"#3d4545"
  },
  picker: {
    height: 58,
    width: '100%',
    color: '#333',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor:"#3d4545",
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
      },
  submitButton: {
    backgroundColor:'#55D934',
    padding: 15,
    borderRadius: 22,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addMoreButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  addMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mediaButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius:8,
    padding:10,
    borderStyle: 'dashed',
    borderColor:"#ccc",
    borderWidth:1
  },
  mediaButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mediaButton: {
    flexDirection: 'row',
    borderRadius:8,
    borderWidth:1,
    borderColor:"#ccc",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  galleryButton: {
    marginRight: 5,
  },
  cameraButton: {
    marginLeft: 5,
  },
  mediaButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color:"#333"
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  mediaItem: {
    width: '30%',
    margin: '1.5%',
    position: 'relative',
  },
  mediaThumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  mediaContainer: {
    borderWidth: 2,
    borderColor: '#4D5C48', // Matches the green dashed color
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2F3C2B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ListItems;