import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from '../navbar/navbar';
import BHDetails from '../bhdetails/bhdetails';
import { popularBoardingHouses, nearbyBoardingHouses } from '../data/boardingHousesData';

const Home = ({ onLogout }) => {

  const [selectedHouse, setSelectedHouse] = useState(null);
  const [likedHouses, setLikedHouses] = useState(new Set());

  // Load liked houses from localStorage on mount
  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setLikedHouses(new Set(savedLikes));
  }, []);

  const toggleLike = (houseId) => {
    const newLikedHouses = new Set(likedHouses);
    if (newLikedHouses.has(houseId)) {
      newLikedHouses.delete(houseId);
    } else {
      newLikedHouses.add(houseId);
    }
    
    // Save to localStorage
    localStorage.setItem('likedHouses', JSON.stringify([...newLikedHouses]));
    setLikedHouses(newLikedHouses);
  };

  const BoardingHouseCard = ({ house }) => (
    <div className="boarding-card" onClick={() => setSelectedHouse(house)}>
      <div className="card-image">
        <img 
          src={house.image || '/default.png'} 
          alt={house.name}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
          }}
          onLoad={() => console.log('Image loaded successfully:', house.image)}
        />
      </div>
      <div className="card-content">
        <h3>{house.name}</h3>
        <p className="address">{house.address}</p>
      </div>
    </div>
  );

  return (
    <div className="homepage">
      <Navbar />
      <div className="background-image"></div>
      
      <main className="main-content">
        <section className="boarding-section">
          <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Popular</h2>
          <div className="boarding-grid">
            {popularBoardingHouses.map((house) => (
              <BoardingHouseCard key={house.id} house={house} />
            ))}
          </div>
        </section>

        <section className="boarding-section">
          <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Nearby</h2>
          <div className="boarding-grid">
            {nearbyBoardingHouses.map((house) => (
              <BoardingHouseCard key={house.id} house={house} />
            ))}
          </div>
        </section>
      </main>

      <BHDetails 
        house={selectedHouse}
        isOpen={!!selectedHouse}
        onClose={() => setSelectedHouse(null)}
        likedHouses={likedHouses}
        onToggleLike={toggleLike}
      />
    </div>
  );
};

export default Home;