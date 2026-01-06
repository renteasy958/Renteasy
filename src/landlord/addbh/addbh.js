// AddBoardingHouse.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Wifi, Home, UtensilsCrossed, Wind, Shirt, Shield, Droplet, Zap, BedDouble, Table2, Armchair, AlertCircle } from 'lucide-react';
import MapSelector from '../../maps/MapSelector';
import './addbh.css';
import { addBoardingHouseWithImages } from '../../services/bhservice';
import { auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AddBoardingHouse = () => {
      const navigate = useNavigate();
    // Boarding house types
    const boardingTypes = [
      'Single Room',
      'Bed Spacer',
      'Apartment Type',
      'Shared Room (2-4 pax)',
      'Shared Room (5-8 pax)',
      'Family'
    ];

    // Amenities list
    const amenitiesList = [
      { key: 'wifi', label: 'WiFi', icon: Wifi },
      { key: 'aircon', label: 'Aircon', icon: Wind },
      { key: 'comfortroom', label: 'Comfort Room', icon: Home },
      { key: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed },
      { key: 'laundry', label: 'Laundry', icon: Shirt },
      { key: 'security', label: 'Security', icon: Shield },
      { key: 'water', label: 'Water', icon: Droplet },
      { key: 'electricity', label: 'Electricity', icon: Zap },
      { key: 'bed', label: 'Bed', icon: BedDouble },
      { key: 'table', label: 'Table', icon: Table2 },
      { key: 'chair', label: 'Chair', icon: Armchair },
    ];



    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [images, setImages] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [landlordUid, setLandlordUid] = useState(null);
    const [formData, setFormData] = useState({
      name: '',
      address: {
        streetSitio: '',
        barangay: '',
        cityMunicipality: 'Isabela',
        province: 'Negros Occidental'
      },
      type: '',
      price: '',
      description: '',
      amenities: {}, // Always present from the start
      location: null
    });

    // Handlers
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length + images.length > 7) {
        alert('You can upload up to 7 images.');
        return;
      }
      setImages(prev => [...prev, ...files]);
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name in formData.address) {
        setFormData(f => ({ ...f, address: { ...f.address, [name]: value } }));
      } else {
        setFormData(f => ({ ...f, [name]: value }));
      }
    };

    const handleAmenityToggle = (key) => {
      setFormData(f => ({
        ...f,
        amenities: { ...f.amenities, [key]: !f.amenities?.[key] }
      }));
    };

    const handleLocationSelect = (location) => {
      setFormData(f => ({ ...f, location: { ...location, markerPlaced: true } }));
    };

    const handlePrev = () => {
      console.log('Back button clicked, currentStep:', currentStep);
      if (currentStep === 1) {
        try {
          navigate('/llhome');
        } catch (e) {
          window.location.href = '/llhome';
        }
      } else {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleNext = () => {
      setCurrentStep(s => Math.min(3, s + 1));
    };

    const handleSubmit = async () => {
      console.log('Submit button clicked, isSubmitting:', isSubmitting);
      setIsSubmitting(true);
      try {
        // Validate required fields
        if (!formData.name || !formData.address.streetSitio || !formData.address.barangay || !formData.type || !formData.price || !formData.description || !formData.location) {
          alert('Please fill in all required fields and select a location.');
          setIsSubmitting(false);
          return;
        }
        // Get landlord UID if not already set
        let uid = landlordUid;
        if (!uid) {
          const user = auth.currentUser;
          if (user) uid = user.uid;
        }
        if (!uid) {
          alert('Landlord not authenticated.');
          setIsSubmitting(false);
          return;
        }
        // Prepare data
        const dataToSave = {
          name: formData.name,
          address: formData.address,
          type: formData.type,
          price: formData.price,
          description: formData.description,
          amenities: formData.amenities,
          location: formData.location,
          landlordId: uid,
          status: 'pending',
        };
        await addBoardingHouseWithImages(dataToSave, images);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          try {
            navigate('/llhome');
          } catch (e) {
            window.location.href = '/llhome';
          }
        }, 1500);
      } catch (err) {
        alert('Failed to submit.');
        setIsSubmitting(false);
      } finally {
        // Always reset isSubmitting in finally, unless already reset in catch
        if (isSubmitting) setIsSubmitting(false);
      }
    };


  // ...existing code...

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

        {/* Main form content by step */}
        {currentStep === 1 && (
          <div className="add-step-content add-step-content-split">
            {/* Left: Image upload */}
            <div className="add-step-content-left">
              <div className="add-image-upload-box">
                <div className="add-image-upload-title">Upload Images</div>
                <div className="add-image-upload-section">
                  <div className="add-image-previews">
                    {images.map((img, idx) => (
                      <div key={idx} className="add-image-square-wrapper">
                        <div className="add-image-preview">
                          <img src={URL.createObjectURL(img)} alt={`Preview ${idx + 1}`} />
                          <button
                            type="button"
                            className="add-remove-image"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {images.length < 7 && (
                      <label className="add-plus-standalone" title="Upload Images">
                        <span className="add-plus-big">+</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                      </label>
                    )}
                  </div>
                  <p className="add-image-count">{images.length}/7 images</p>
                </div>
              </div>
            </div>
            {/* Right: Form fields */}
            <div className="add-step-content-right">
              <div className="add-form-group">
                <label className="add-label">Boarding House Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter boarding house name"
                  className="add-input"
                  style={{ height: '40px' }}
                />
              </div>
              <div className="add-form-group">
                <label className="add-label">Address</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="streetSitio"
                        value={formData.address.streetSitio}
                        onChange={handleInputChange}
                        placeholder="Street/Sitio *"
                        className="add-input"
                        style={{ width: '100%', height: '40px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <select
                        name="barangay"
                        value={formData.address.barangay}
                        onChange={handleInputChange}
                        className="add-select"
                        style={{ width: '100%', height: '40px' }}
                      >
                        <option value="">Barangay *</option>
                        {Array.from({ length: 9 }, (_, i) => (
                          <option key={i + 1} value={`Barangay ${i + 1}`}>Barangay {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="cityMunicipality"
                        value={formData.address.cityMunicipality}
                        onChange={handleInputChange}
                        placeholder="City/Municipality"
                        className="add-input"
                        style={{ width: '100%', height: '40px' }}
                        readOnly
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        name="province"
                        value={formData.address.province}
                        onChange={handleInputChange}
                        placeholder="Province"
                        className="add-input"
                        style={{ width: '100%', height: '40px' }}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="add-form-group">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="add-label">Type of Boarding House *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="add-select"
                      style={{ width: '100%', height: '40px' }}
                    >
                      <option value="">Select type</option>
                      {boardingTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="add-label">Price per Month *</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="₱0.00"
                      className="add-input"
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Description always below both halves */}
        {currentStep === 1 && (
          <div className="add-form-group add-description-below">
            <label className="add-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your boarding house..."
              rows="2"
              className="add-textarea"
              style={{ height: '40px', fontSize: '14px' }}
            />
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

        {/* Form actions */}
        <div className="add-form-actions">
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              className="add-btn-prev"
              onClick={handlePrev}
              disabled={isSubmitting}
            >
              Back
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
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
