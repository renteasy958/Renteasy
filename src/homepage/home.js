import React from 'react';
import './home.css';
import Navbar from '../navbar/navbar'; // Adjust the path based on your file structure

const Home = ({ onLogout }) => {

  // Mock data for boarding houses - 10 for popular, 10 for nearby (total 20)
  const boardingHouses = Array(10).fill(null).map((_, index) => ({
    id: index + 1,
    name: 'No Available Boarding House',
    address: '.....',
    rating: 0,
    image: '/default.png' // This will now work since it's in public folder
  }));

  const nearbyHouses = Array(10).fill(null).map((_, index) => ({
    id: index + 11,
    name: 'No Available Boarding House',
    address: '.....',
    rating: 0,
    image: '/default.png' // This will now work since it's in public folder
  }));


  const renderStars = (rating) => {
    return Array(5).fill(null).map((_, index) => (
      <span
        key={index}
        className={index < rating ? 'star-filled' : 'star-empty'}
        style={{
          color: index < rating ? '#ffd700' : '#ddd',
          fontSize: '16px'
        }}
      >
        ★
      </span>
    ));
  };

  const BoardingHouseCard = ({ house }) => (
    <div className="boarding-card">
      <div className="card-image">
        <img 
          src={house.image || '/default.png'} 
          alt={house.name}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            // Fallback to a placeholder
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
          }}
          onLoad={() => console.log('Image loaded successfully:', house.image)}
        />
      </div>
      <div className="card-content">
        <h3>{house.name}</h3>
        <p className="address">{house.address}</p>
        <div className="rating">
          {renderStars(house.rating)}
          <span className="rating-number">{house.rating}</span>
        </div>
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
          {boardingHouses.map((house) => (
            <BoardingHouseCard key={house.id} house={house} />
          ))}
        </div>
      </section>

      <section className="boarding-section">
        <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Nearby</h2>
        <div className="boarding-grid">
          {nearbyHouses.map((house) => (
            <BoardingHouseCard key={house.id} house={house} />
          ))}
        </div>
      </section>
    </main>
  </div>
);
};

export default Home;