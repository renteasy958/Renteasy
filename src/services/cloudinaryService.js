// Cloudinary upload service for profile pictures and QR codes

export const uploadToCloudinary = async (file, folder = 'renteasy') => {
  try {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in your .env');
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Upload failed with status ${response.status}`);
    }

    return data.secure_url || data.url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file, userId) => {
  return uploadToCloudinary(file, `renteasy/profiles/${userId}`);
};

// Upload QR code
export const uploadQRCode = async (file, landlordId) => {
  return uploadToCloudinary(file, `renteasy/qrcodes/${landlordId}`);
};
