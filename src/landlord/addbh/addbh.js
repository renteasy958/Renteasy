// AddBoardingHouse.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Wifi, Home, UtensilsCrossed, Wind, Shirt, Shield, Droplet, Zap, BedDouble, Table2, Armchair } from 'lucide-react';
import MapSelector from '../../maps/MapSelector';
import './addbh.css';
import { addBoardingHouseWithImages } from '../../services/bhservice';

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

  const CLOUDINARY_CLOUD_NAME = 'ddidkbqcn';
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

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        markerPlaced: true
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    console.log('Submit button clicked');
    
    // Frontend validation
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
      // Prepare payload: remove preview objects from images and convert to File[]
      const imageFiles = images.map(img => img.file ? img.file : img);

      const payload = {
        name: formData.name,
        address: formData.address,
        type: formData.type,
        price: formData.price,
        description: formData.description,
        amenities: formData.amenities,
        location: formData.location
      };

      console.log('Starting boarding house submission...');
      // Upload images and save document in Firestore
      const newId = await addBoardingHouseWithImages(payload, imageFiles);

      console.log('Boarding house created with id:', newId);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/llhome');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form: ' + (error.message || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/llhome');
  };

  return (
    <div className="add-boarding-container">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="checkmark-circle">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
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

        {currentStep === 3 && (
          <div className="add-step-content">
            <MapSelector 
              onLocationSelect={handleLocationSelect}
              initialLocation={formData.location}
            />
          </div>
        )}

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