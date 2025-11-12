import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './bhdetails.css';

const BHDetails = ({ house, isOpen, onClose, likedHouses, onToggleLike }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReservationNotice, setShowReservationNotice] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);

  if (!isOpen || !house) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === house.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? house.images.length - 1 : prev - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onToggleLike(house.id);
  };

  const handleReserveClick = () => {
    setShowReservationNotice(true);
  };

  const handleCloseReservationNotice = () => {
    setShowReservationNotice(false);
  };

  const handleProceed = () => {
    setShowReservationNotice(false);
    setShowPaymentForm(true);
  };

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setReferenceNumber('');
    setQrCodeImage(null);
  };

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = () => {
    if (!referenceNumber.trim()) {
      alert('Please enter a reference number');
      return;
    }

    // Show success animation
    setShowPaymentForm(false);
    setShowSuccessAnimation(true);

    // Hide success animation after 3 seconds
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setReferenceNumber('');
      setQrCodeImage(null);
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-left">
            <button className="back-button" onClick={onClose}>
              ←
            </button>
            
            <div className="image-carousel">
              <img 
                src={house.images[currentImageIndex] || '/default.png'} 
                alt={house.name}
                onError={(e) => {
                  e.target.src = '/default.png';
                }}
              />
              {house.images.length > 1 && (
                <>
                  <button className="carousel-nav prev" onClick={prevImage}>
                    &lt;
                  </button>
                  <button className="carousel-nav next" onClick={nextImage}>
                    &gt;
                  </button>
                </>
              )}
              <div className="carousel-dots">
                {house.images.map((_, index) => (
                  <span 
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </div>
            </div>

            <div className="modal-details">
              <div className="title-section">
                <h1>{house.name}</h1>
                <button 
                  className={`like-button-modal ${likedHouses && likedHouses.has(house.id) ? 'liked' : ''}`}
                  onClick={handleLikeClick}
                >
                  {likedHouses && likedHouses.has(house.id) ? '♥' : '♡'}
                </button>
              </div>

              <div className="location-section">
                <svg className="location-pin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{house.address}</span>
              </div>

              <div className="room-price-section">
                <p className="room-type-text">{house.roomType}</p>
                <p className="price">{house.price}</p>
              </div>

              {/* Map Container - Will be populated from landlord's data */}
              <div className="map-placeholder">
                <div className="map-container" style={{ height: '300px', width: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <p style={{ color: '#666', fontSize: '14px' }}>Map location will be displayed here</p>
                </div>
              </div>

              <div className="contact-section">
                <h3>For more information please contact:</h3>
                <div className="contact-info">
                  <div className="contact-avatar">
                    <img 
                      src={house.landlord?.profilePicture || '/default.png'} 
                      alt={house.landlord?.name || 'Contact'}
                      onError={(e) => {
                        e.target.src = '/default.png';
                      }}
                    />
                  </div>
                  <div className="contact-details">
                    <h4>{house.landlord?.name || 'Contact Name'}</h4>
                    <p>
                      <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                      </svg>
                      {house.landlord?.phone || '09000000000'}
                    </p>
                    <p>
                      <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {house.landlord?.address || 'Landlord Address'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-right">
            <div className="description-section">
              <h2>Description</h2>
              <p>{house.description}</p>
              
              <p>Enjoy a peaceful environment with essential amenities, including:</p>
              
              <ul className="amenities-list">
                {house.amenities?.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                )) || [
                  'Well-ventilated rooms',
                  'Private and shared bathrooms', 
                  'Safe surroundings',
                  'Easy access to nearby stores and transportation',
                  'Piso wifi'
                ].map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
            
            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve now
            </button>
          </div>
        </div>

        {/* Reservation Notice Modal */}
        {showReservationNotice && (
          <div className="reservation-overlay" onClick={handleCloseReservationNotice}>
            <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-reservation-btn" onClick={handleCloseReservationNotice}>
                ×
              </button>
              <h2>Reservation Notice!</h2>
              <div className="reservation-content">
                <p>
                  A <strong>₱50</strong> reservation fee is required to confirm your reservation.
                </p>
                <p>
                  After reserving, you must contact the landlord or visit the location within <strong>24 hours</strong>.
                </p>
                <p>
                  If no contact or visit is made within 24 hours, your reservation will be considered <strong>void</strong>, and the room may be offered to others.
                </p>
              </div>
              <button className="proceed-button" onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="reservation-overlay" onClick={handleClosePaymentForm}>
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-reservation-btn" onClick={handleClosePaymentForm}>
                ×
              </button>
              <h2>Payment Details</h2>
              <div className="payment-content">
                <div className="qr-section">
                  <div className="qr-upload-container">
                    {qrCodeImage ? (
                      <img src={qrCodeImage} alt="QR Code" className="qr-code-image" />
                    ) : (
                      <label htmlFor="qr-upload" className="qr-upload-label">
                        <div className="qr-placeholder">
                          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                          </svg>
                          <p>Click to upload QR Code</p>
                        </div>
                        <input
                          id="qr-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleQrCodeUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="gcash-details">
                    <h3 className="payment-method">GCash</h3>
                    <p className="account-name">Juan Dela Cruz</p>
                    <p className="mobile-number">09123456789</p>
                  </div>
                </div>

                <div className="reference-section">
                  <label htmlFor="reference-number">Reference Number</label>
                  <input
                    id="reference-number"
                    type="text"
                    className="reference-input"
                    placeholder="Enter reference number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>

                <button className="submit-button" onClick={handleSubmitPayment}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Animation */}
        {showSuccessAnimation && (
          <div className="success-overlay">
            <div className="success-animation">
              <div className="checkmark-circle">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <h2>Payment Submitted!</h2>
              <p>Your reservation is being processed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BHDetails;