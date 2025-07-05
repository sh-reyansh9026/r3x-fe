import React, { useState, useEffect } from 'react';
import {
  View,
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

const BASE_URL = "http://192.168.198.27:5000";

const RequestForm = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/api/categories`);
        // Ensure we're working with an array and it has the expected structure
        const categoriesData = Array.isArray(response.data?.data) 
          ? response.data.data 
          : Array.isArray(response.data) 
            ? response.data 
            : [];
            
        console.log('Fetched categories:', categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'Failed to load categories');
        setCategories([]); // Ensure it's always an array
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  const handleSubmit = async (values: {
    category: string;
    title: string;
    description: string;
    price: string;
    location: string;
    images: any[];
  }) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Starting item upload process...");
      
      if (!values.images || values.images.length === 0) {
        throw new Error("Please select at least one image");
      }
  
      // 1. Create FormData object
      const formData = new FormData();
  
      // 2. Append all text fields
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('category', values.category);
      formData.append('location', values.location);
  
      // 3. Append all images with correct format for multer
      for (let i = 0; i < values.images.length; i++) {
        const image = values.images[i];
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1].toLowerCase();
        const mimeType = image.mimeType || `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;
        
        // Create a proper file object for React Native
        const file = {
          uri: image.uri,
          type: mimeType,
          name: `image-${Date.now()}-${i}.${fileType}`,
        };
        
        console.log('Appending file:', file);
        
        // Use the correct format for React Native + Axios
        // @ts-ignore - React Native specific FormData append
        formData.append('images', file);
      }
      
      console.log('FormData prepared with', values.images.length, 'images');
      
      // Log form data keys for debugging
      // @ts-ignore - Accessing _parts for debugging
      const formDataParts = formData._parts || [];
      console.log('FormData parts:', formDataParts);
  
      console.log("Sending form data to backend...");
      
      // 4. Get the auth token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }
  
      // 5. Send the request with FormData
      console.log('Sending request to:', `${BASE_URL}/api/requests`);
      console.log('Headers:', {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      
      const response = await api.post(`/api/requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        transformRequest: (data, headers) => {
          // Let Axios handle the FormData
          return data;
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${progress}%`);
          } else {
            console.log(`Uploaded: ${progressEvent.loaded} bytes`);
          }
        }
      });
      
      console.log('Item requested successfully:', response.data);
      Alert.alert("Success", "Item requested successfully");
      
      // Reset form after successful submission
      setFormKey(prevKey => prevKey + 1);
      
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <CustomText style={styles.heading}>Request an item</CustomText>
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
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.formWrapper}>
            {/* Category */}
            <View style={styles.pickerWrapper}>
              {isLoadingCategories ? (
                <CustomText>Loading categories...</CustomText>
              ) : (
                <Picker
                  selectedValue={values.category}
                  style={styles.picker}
                  onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                  dropdownIconColor="#000"
                  dropdownIconRippleColor="#000"
                >
                  <Picker.Item label="Select a category" value="" />
                  {Array.isArray(categories) && categories.map((cat: any) => (
                    <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                  ))}
                </Picker>
              )}
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
              placeholder="Expected price"
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
              <CustomText style={styles.subtitle}>You can add upto 5 photos</CustomText>
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
              <CustomText style={styles.submitButtonText}>Request Item</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      {/* Add More */}
      <TouchableOpacity style={styles.addMoreButton} onPress={addForm}>
        <CustomText style={styles.addMoreText}>+ Request More Items</CustomText>
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

export default RequestForm;