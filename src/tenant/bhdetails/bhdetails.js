import React, { useState } from 'react';
import './bhdetails.css';

const BHDetails = ({ house, isOpen, onClose, likedHouses, onToggleLike }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                <div className="rating-section">
                  <span className="rating-score">{house.rating}</span>
                  <span className="star-large">★</span>
                  <button 
                    className={`like-button-modal ${likedHouses && likedHouses.has(house.id) ? 'liked' : ''}`}
                    onClick={handleLikeClick}
                  >
                    {likedHouses && likedHouses.has(house.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>

              <div className="location-section">
                <span className="location-pin">📍</span>
                <span>{house.address}</span>
              </div>

              <div className="room-price-section">
                <p>{house.roomType}</p>
                <p className="price">{house.price}</p>
              </div>

              <div className="map-placeholder">
                <div className="map-coming-soon">
                  <p>Map Coming Soon</p>
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
                    <p>📞 {house.landlord?.phone || '09000000000'}</p>
                    <p>📘 {house.landlord?.facebook || 'Facebook Name'}</p>
                    <p>📍 {house.landlord?.address || 'Landlord Address'}</p>
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
            
            <button className="reserve-button">
              Reserve now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BHDetails;