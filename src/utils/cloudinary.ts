import { Platform } from 'react-native';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';

// Validate environment variables
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.error('Missing required Cloudinary environment variables');
  console.log({
    CLOUDINARY_CLOUD_NAME: CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
    CLOUDINARY_UPLOAD_PRESET: CLOUDINARY_UPLOAD_PRESET ? 'Set' : 'Missing'
  });
}

console.log('Cloudinary Config Loaded');

export const uploadToCloudinary = async (uri: string) => {
  try {
    console.log('Starting upload for URI:', uri);
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary configuration is missing');
    }

    // Handle file type detection
    let fileType = uri.split('.').pop()?.toLowerCase() || 'jpg';
    // Ensure common image types
    if (!['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)) {
      fileType = 'jpg';
    }
    
    // Prepare the file data for React Native
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: `image-${Date.now()}.${fileType}`,
      type: `image/${fileType}`,
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    console.log('Uploading to Cloudinary...', {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      fileType
    });
    
    // Make the request
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Cloudinary upload failed:', data);
      throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    }
    
    if (!data.secure_url) {
      console.error('Invalid response from Cloudinary:', data);
      throw new Error('Invalid response from Cloudinary');
    }
    
    console.log('Upload successful:', data.secure_url);
    return data.secure_url;
    
  } catch (error: unknown) {
    console.error('Error in uploadToCloudinary:', error);
    if (error instanceof Error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    throw new Error('Failed to upload image: Unknown error occurred');
  }
};
