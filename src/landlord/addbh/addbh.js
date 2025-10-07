import React, { useState } from 'react';
import { X, Upload, Wifi, Home, UtensilsCrossed, Wind, Shirt, Shield, Droplet, Zap, BedDouble, Table2, Armchair } from 'lucide-react';
import './addbh.css';

const AddBoardingHouse = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
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
    gcash: {
      qrCode: null,
      accountName: '',
      mobileNumber: ''
    }
  });

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

  const handleQRUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        gcash: {
          ...formData.gcash,
          qrCode: URL.createObjectURL(file)
        }
      });
    }
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

  const handleGcashChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      gcash: {
        ...formData.gcash,
        [name]: value
      }
    });
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Boarding house added successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All data will be lost.')) {
      window.history.back();
    }
  };

  return (
    <div className="add-boarding-container">
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
            <div className="add-step-label">Payment</div>
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

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="add-step-content">
            <h3 className="add-payment-title">GCash Payment Information</h3>
            <div className="add-gcash-section">
              <div className="add-form-group">
                <label className="add-label">GCash QR Code *</label>
                <div className="add-qr-upload">
                  {formData.gcash.qrCode ? (
                    <div className="add-qr-preview">
                      <img src={formData.gcash.qrCode} alt="QR Code" />
                    </div>
                  ) : (
                    <label className="add-qr-upload-box">
                      <Upload size={28} />
                      <span>Upload QR Code</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQRUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="add-form-group">
                <label className="add-label">GCash Account Name *</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.gcash.accountName}
                  onChange={handleGcashChange}
                  placeholder="Enter account name"
                  className="add-input"
                />
              </div>

              <div className="add-form-group">
                <label className="add-label">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.gcash.mobileNumber}
                  onChange={handleGcashChange}
                  placeholder="09XX XXX XXXX"
                  className="add-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="add-form-actions">
          <button type="button" className="add-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <div className="add-nav-buttons">
            {currentStep > 1 && (
              <button type="button" className="add-btn-previous" onClick={handlePrevious}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" className="add-btn-next" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="button" className="add-btn-submit" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBoardingHouse;