import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Wifi, Home, UtensilsCrossed, Wind, Shirt, Shield, Droplet, Zap, BedDouble, Table2, Armchair, MapPin } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './addbh.css';
import 'leaflet-routing-machine';


const AddBoardingHouse = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: '',
    price: '',
    description: '',
    amenities: {
      wifi: false,
      comfortRoom: false,
      kitchen: false,
      ac: false,
      laundry: false,
      security: false,
      water: false,
      electricity: false,
      bed: false,
      table: false,
      chair: false
    },
    location: {
      latitude: null,
      longitude: null,
      markerPlaced: false
    }
  });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'ddidkbqcn';
  const CLOUDINARY_UPLOAD_PRESET = 'renteasy';

  // Initialize map when step 3 is reached
  useEffect(() => {
    if (currentStep === 3 && !mapInstanceRef.current) {
      // Fix for default marker icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png ',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png ',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png ',
      });

      
      // Initialize map centered on Philippines (Cebu area as default)
      const map = L.map(mapRef.current).setView([10.3157, 123.8854], 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      // Add click event to place marker
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker if any
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        
        // Add new marker
        const marker = L.marker([lat, lng], {
          draggable: true
        }).addTo(map);
        
        marker.bindPopup(`<b>Boarding House Location</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`).openPopup();
        
        // Update marker on drag
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          setFormData(prev => ({
            ...prev,
            location: {
              latitude: position.lat,
              longitude: position.lng,
              markerPlaced: true
            }
          }));
          marker.setPopupContent(`<b>Boarding House Location</b><br>Lat: ${position.lat.toFixed(6)}<br>Lng: ${position.lng.toFixed(6)}`);
        });
        
        markerRef.current = marker;
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          location: {
            latitude: lat,
            longitude: lng,
            markerPlaced: true
          }
        }));
      });

      mapInstanceRef.current = map;

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
            
            // Add a temporary marker to show user location
            L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png ',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png ',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            }).addTo(map).bindPopup('Your current location').openPopup();
          },
          (error) => {
            console.log('Geolocation error:', error);
          }
        );
      }
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current && currentStep !== 3) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [currentStep]);

  const boardingTypes = [
    'Single Room',
    'Bed Spacer',
    'Apartment Type',
    'Shared Room (2-4 pax)',
    'Shared Room (5-8 pax)',
    'Family'
  ];

  const amenitiesList = [
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'comfortRoom', label: 'Comfort Room', icon: Home },
    { key: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
    { key: 'ac', label: 'AC', icon: Wind },
    { key: 'laundry', label: 'Laundry', icon: Shirt },
    { key: 'security', label: 'Security', icon: Shield },
    { key: 'water', label: 'Water', icon: Droplet },
    { key: 'electricity', label: 'Electricity', icon: Zap },
    { key: 'bed', label: 'Bed', icon: BedDouble },
    { key: 'table', label: 'Table', icon: Table2 },
    { key: 'chair', label: 'Chair', icon: Armchair }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;

    if (totalImages > 7) {
      alert('You can only upload up to 7 images');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityToggle = (key) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [key]: !formData.amenities[key]
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Upload single image to Cloudinary with timeout
  const uploadToCloudinary = async (file, folder = 'boarding-houses') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      console.log(`Uploading to Cloudinary - Cloud: ${CLOUDINARY_CLOUD_NAME}, Preset: ${CLOUDINARY_UPLOAD_PRESET}, Folder: ${folder}`);
      
      // Create a timeout promise
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
      );
      
      // Race between upload and timeout
      const uploadPromise = fetch(
        `https://api.cloudinary.com/v1_1/ ${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const response = await Promise.race([uploadPromise, timeout]);

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Cloudinary upload failed:', data);
        throw new Error(data.error?.message || `Upload failed with status ${response.status}`);
      }
      
      console.log('Cloudinary upload successful:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  };

  // Upload all images to Cloudinary
  const uploadImages = async () => {
    const imageUrls = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      try {
        const url = await uploadToCloudinary(image.file, 'boarding-houses');
        imageUrls.push(url);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    }
    
    return imageUrls;
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.address || !formData.type || !formData.price || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (images.length < 3) {
      alert('Please upload at least 3 images');
      return;
    }

    if (!formData.location.markerPlaced) {
      alert('Please mark your boarding house location on the map');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all images to Cloudinary
      console.log('Uploading images to Cloudinary...');
      const imageUrls = await uploadImages();
      console.log('Images uploaded:', imageUrls);

      // Validate that all uploads succeeded
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }

      // Save data to Firestore with explicit values only
      console.log('Preparing data for Firestore...');
      
      const dataToSubmit = {
        name: String(formData.name || ''),
        address: String(formData.address || ''),
        type: String(formData.type || ''),
        price: parseFloat(formData.price) || 0,
        description: String(formData.description || ''),
        amenities: {
          wifi: Boolean(formData.amenities.wifi),
          comfortRoom: Boolean(formData.amenities.comfortRoom),
          kitchen: Boolean(formData.amenities.kitchen),
          ac: Boolean(formData.amenities.ac),
          laundry: Boolean(formData.amenities.laundry),
          security: Boolean(formData.amenities.security),
          water: Boolean(formData.amenities.water),
          electricity: Boolean(formData.amenities.electricity),
          bed: Boolean(formData.amenities.bed),
          table: Boolean(formData.amenities.table),
          chair: Boolean(formData.amenities.chair)
        },
        images: imageUrls,
        location: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude
        },
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      console.log('Data to submit:', dataToSubmit);
      console.log('Saving to Firestore...');
      
      const docRef = await addDoc(collection(db, 'boardingHouses'), dataToSubmit);

      console.log('Document written with ID:', docRef.id);
      
      // Show success animation
      setShowSuccess(true);
      
      // Hide animation after 3 seconds and redirect to Landlord Home
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/llhome');
      }, 3000);

    } catch (error) {
      console.error('Error adding boarding house:', error);
      console.error('Error details:', error);
      alert('Error submitting form: ' + error.message + '\n\nPlease check:\n1. Your internet connection\n2. Cloudinary settings (Cloud Name and Upload Preset)\n3. Browser console (F12) for details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/llhome');
  };

  return (
    <div className="add-boarding-container">
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="checkmark-circle">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg " viewBox="0 0 52 52">
                <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2>Success!</h2>
            <p>Your boarding house has been added successfully.</p>
          </div>
        </div>
      )}

      <div className="add-boarding-form">
        <h1 className="add-form-title">Add Boarding House</h1>

        {/* Progress Steps */}
        <div className="add-steps-indicator">
          <div className={`add-step ${currentStep >= 1 ? 'add-active' : ''}`}>
            <div className="add-step-number">1</div>
            <div className="add-step-label">Basic Info</div>
          </div>
          <div className={`add-step-line ${currentStep >= 2 ? 'add-active' : ''}`}></div>
          <div className={`add-step ${currentStep >= 2 ? 'add-active' : ''}`}>
            <div className="add-step-number">2</div>
            <div className="add-step-label">Amenities</div>
          </div>
          <div className={`add-step-line ${currentStep >= 3 ? 'add-active' : ''}`}></div>
          <div className={`add-step ${currentStep >= 3 ? 'add-active' : ''}`}>
            <div className="add-step-number">3</div>
            <div className="add-step-label">Location</div>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="add-step-content">
            <div className="add-form-row">
              <div className="add-form-group-half">
                <label className="add-label">Upload Images (3-7 images) *</label>
                <div className="add-image-upload-section">
                  <div className="add-image-previews">
                    {images.map((img, index) => (
                      <div key={index} className="add-image-preview">
                        <img src={img.preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="add-remove-image"
                          onClick={() => removeImage(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {images.length < 7 && (
                      <label className="add-upload-box">
                        <Upload size={20} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                  <p className="add-image-count">{images.length}/7 images</p>
                </div>
              </div>

              <div className="add-form-group-half">
                <div className="add-form-group">
                  <label className="add-label">Boarding House Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter boarding house name"
                    className="add-input"
                  />
                </div>

                <div className="add-form-group">
                  <label className="add-label">Complete Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    className="add-input"
                  />
                </div>

                <div className="add-form-group">
                  <label className="add-label">Type of Boarding House *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="add-select"
                  >
                    <option value="">Select type</option>
                    {boardingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="add-form-group">
                  <label className="add-label">Price per Month *</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="₱0.00"
                    className="add-input"
                  />
                </div>
              </div>
            </div>

            <div className="add-form-group">
              <label className="add-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your boarding house..."
                rows="2"
                className="add-textarea"
              />
            </div>
          </div>
        )}

        {/* Step 2: Amenities */}
        {currentStep === 2 && (
          <div className="add-step-content">
            <h3 className="add-amenities-title">Select Available Amenities</h3>
            <div className="add-amenities-grid">
              {amenitiesList.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className={`add-amenity-card ${formData.amenities[key] ? 'add-active' : ''}`}
                  onClick={() => handleAmenityToggle(key)}
                >
                  <Icon size={28} />
                  <span className="add-amenity-label">{label}</span>
                  <div className="add-amenity-status">
                    {formData.amenities[key] ? 'Available' : 'Not Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="add-step-content">
            <h3 className="add-location-title">
              <MapPin size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Mark Your Boarding House Location
            </h3>
            <p className="add-location-instruction">
              Click on the map to place a marker at your boarding house location. You can drag the marker to adjust its position.
            </p>
            <div className="add-map-container">
              <div ref={mapRef} className="add-map"></div>
            </div>
            {formData.location.markerPlaced && (
              <div className="add-location-info">
                <p><strong>Coordinates:</strong></p>
                <p>Latitude: {formData.location.latitude?.toFixed(6)}</p>
                <p>Longitude: {formData.location.longitude?.toFixed(6)}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="add-form-actions">
          <button 
            type="button" 
            className="add-btn-cancel" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <div className="add-nav-buttons">
            {currentStep > 1 && (
              <button 
                type="button" 
                className="add-btn-previous" 
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button 
                type="button" 
                className="add-btn-next" 
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </button>
            ) : (
              <button 
                type="button" 
                className="add-btn-submit" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBoardingHouse;