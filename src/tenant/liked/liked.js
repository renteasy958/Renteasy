import React, { useState, useEffect } from 'react';
import './liked.css';
import { getAllBoardingHouses } from '../../services/bhservice';

const Liked = () => {
  const [likedHouses, setLikedHouses] = useState(new Set());
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load liked houses from localStorage and fetch Firestore data
  useEffect(() => {
    const fetchLikedHouses = async () => {
      try {
        setLoading(true);
        
        // Get liked house IDs from localStorage
        const savedLikes = JSON.parse(localStorage.getItem('likedHouses') || '[]');
        setLikedHouses(new Set(savedLikes));
        
        // Fetch all boarding houses from Firestore
        const allHouses = await getAllBoardingHouses();
        
        // Filter to only liked houses that are not reserved or occupied
        const liked = allHouses.filter(house =>
          savedLikes.includes(house.id) &&
          house.status !== 'reserved' &&
          house.status !== 'occupied'
        );
        setBoardingHouses(liked);
        setError(null);
      } catch (err) {
        console.error('Error fetching liked houses:', err);
        setError(err.message);
        setBoardingHouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedHouses();
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
      
      // Update the displayed liked houses
      setBoardingHouses(current => 
        current.filter(house => newSet.has(house.id))
      );
      
      return newSet;
    });
  };

  // Boarding house card component
  const BoardingHouseCard = ({ house }) => {
    const thumbnail = (house.images && Array.isArray(house.images) && house.images.length > 0) ? house.images[0] : (house.image || '/default.png');
    // Format address if it's an object
    let formattedAddress = '';
    if (house.address && typeof house.address === 'object' && house.address !== null) {
      const { streetSitio, barangay, cityMunicipality, province } = house.address;
      formattedAddress = [streetSitio, barangay, cityMunicipality, province].filter(Boolean).join(', ');
    } else {
      formattedAddress = house.address || house.Address || '';
    }
    return (
      <div 
        className="like-boarding-house-card"
        onClick={() => setSelectedHouse(house)}
      >
        <div className="like-card-image-container">
          <img 
            src={thumbnail} 
            alt={house.name || house['Boarding House Name'] || 'Boarding House'}
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
          <h3 className="like-card-title">{house.name || house['Boarding House Name'] || 'Untitled'}</h3>
          <p className="like-card-address">
            {formattedAddress}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="like-liked-page">
        <main className="like-liked-main">
          <div className="like-loading-state">Loading liked houses...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="like-liked-page">
        <main className="like-liked-main">
          <div className="like-loading-state" style={{ color: '#d32f2f' }}>
            Error loading liked houses: {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="like-liked-page">
      <main className="like-liked-main">
        <section>
          <h2 className="like-page-title">LIKED BOARDING HOUSE </h2>
          
          {boardingHouses.length === 0 ? (
            <div className="like-empty-state">
              <div className="like-empty-icon">♡</div>
              <h3 className="like-empty-title">No liked boarding houses yet</h3>
              <p className="like-empty-text">
                Start exploring and heart your favorite places!
              </p>
            </div>
          ) : (
            <div className="like-houses-grid">
              {boardingHouses.map((house) => (
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
              src={(selectedHouse.images && selectedHouse.images.length > 0) ? selectedHouse.images[0] : selectedHouse.image || '/default.png'}
              alt={selectedHouse.name || selectedHouse['Boarding House Name'] || 'Boarding House'}
              className="like-modal-image"
              onError={(e) => {
                e.target.src = '/default.png';
              }}
            />
            <div className="like-modal-body">
              <h2 className="like-modal-title">{selectedHouse.name || selectedHouse['Boarding House Name'] || 'Untitled'}</h2>
              <p className="like-modal-address">
                {(() => {
                  if (selectedHouse.address && typeof selectedHouse.address === 'object' && selectedHouse.address !== null) {
                    const { streetSitio, barangay, cityMunicipality, province } = selectedHouse.address;
                    return [streetSitio, barangay, cityMunicipality, province].filter(Boolean).join(', ');
                  } else {
                    return selectedHouse.address || selectedHouse.Address || '';
                  }
                })()}
              </p>
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