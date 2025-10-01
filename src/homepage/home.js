import React from 'react';
import './home.css';

const Home = ({ onLogout }) => {

  // Mock data for boarding houses - 10 for popular, 10 for nearby (total 20)
  const boardingHouses = Array(10).fill(null).map((_, index) => ({
    id: index + 1,
    name: 'No Available Boarding House',
    address: '.....',
    rating: 0,
    image: 'defaultimage.png'
  }));

  const nearbyHouses = Array(10).fill(null).map((_, index) => ({
    id: index + 11,
    name: 'No Available Boarding House',
    address: '.....',
    rating: 0,
    image: 'defaultimage.png'
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
        <img src={house.image} alt={house.name} />
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