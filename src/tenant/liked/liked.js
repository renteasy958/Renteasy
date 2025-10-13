import React, { useState, useEffect } from 'react';
import './liked.css';
import { allBoardingHouses } from '../data/boardingHousesData';

const Liked = () => {
  const [likedHouses, setLikedHouses] = useState(new Set());
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get liked houses from localStorage
    const savedLikes = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setLikedHouses(new Set(savedLikes));
    setLoading(false);
  }, []);

  // Toggle like/unlike
  const onToggleLike = (houseId) => {
    setLikedHouses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(houseId)) {
        newSet.delete(houseId);
      } else {
        newSet.add(houseId);
      }
      
      // Save to localStorage
      localStorage.setItem('likedHouses', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // Filter only liked houses from the shared data
  const likedBoardingHouses = allBoardingHouses.filter(house => likedHouses.has(house.id));

  // Render star rating
  const renderStars = (rating) => {
    return Array(5).fill(null).map((_, index) => (
      <span
        key={index}
        className={`like-star ${index < rating ? 'like-filled' : 'like-empty'}`}
      >
        ★
      </span>
    ));
  };

  // Boarding house card component
  const BoardingHouseCard = ({ house }) => (
    <div 
      className="like-boarding-house-card"
      onClick={() => setSelectedHouse(house)}
    >
      <div className="like-card-image-container">
        <img 
          src={house.image || '/default.png'} 
          alt={house.name}
          className="like-card-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
          }}
        />
        <button 
          className={`like-button ${likedHouses.has(house.id) ? 'like-liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(house.id);
          }}
        >
          ♥
        </button>
      </div>
      <div className="like-card-content">
        <h3 className="like-card-title">{house.name}</h3>
        <p className="like-card-address">
          <span className="like-location-icon">📍</span>
          {house.address}
        </p>
        <div className="like-card-rating">
          <div className="like-stars-container">
            {renderStars(house.rating)}
          </div>
          <span className="like-rating-value">
            {house.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="like-liked-page">
        <main className="like-liked-main">
          <div className="like-loading-state">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="like-liked-page">
      <main className="like-liked-main">
        <section>
          <h2 className="like-page-title">Liked Boarding Houses</h2>
          
          {likedBoardingHouses.length === 0 ? (
            <div className="like-empty-state">
              <div className="like-empty-icon">♡</div>
              <h3 className="like-empty-title">No liked boarding houses yet</h3>
              <p className="like-empty-text">
                Start exploring and heart your favorite places!
              </p>
            </div>
          ) : (
            <div className="like-houses-grid">
              {likedBoardingHouses.map((house) => (
                <BoardingHouseCard key={house.id} house={house} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal for house details */}
      {selectedHouse && (
        <div className="like-modal-overlay" onClick={() => setSelectedHouse(null)}>
          <div className="like-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="like-modal-close"
              onClick={() => setSelectedHouse(null)}
            >
              ×
            </button>
            <img 
              src={selectedHouse.image}
              alt={selectedHouse.name}
              className="like-modal-image"
            />
            <div className="like-modal-body">
              <h2 className="like-modal-title">{selectedHouse.name}</h2>
              <p className="like-modal-address">
                <span className="like-location-icon">📍</span>
                {selectedHouse.address}
              </p>
              <div className="like-modal-rating">
                {renderStars(selectedHouse.rating)}
                <span className="like-rating-value">
                  {selectedHouse.rating.toFixed(1)}
                </span>
              </div>
              <button
                className={`like-modal-action-button ${likedHouses.has(selectedHouse.id) ? 'like-unliked' : 'like-liked'}`}
                onClick={() => onToggleLike(selectedHouse.id)}
              >
                {likedHouses.has(selectedHouse.id) ? '❤️ Unlike' : '♡ Like'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liked;