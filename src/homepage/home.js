import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import './home.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

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

  // Login functionality (integrated from separate login.js)
  const handleLogin = (e) => {
    e.preventDefault();
    // Validate login credentials - replace with your actual login logic
    if (loginData.username && loginData.password) {
      setIsLoggedIn(true);
      setShowLogin(false);
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const renderStars = (rating) => {
    return Array(5).fill(null).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? '#ffd700' : 'none'}
        stroke={index < rating ? '#ffd700' : '#ddd'}
      />
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

  if (showLogin) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>🏠 RENT EASY</h1>
            <h2>Welcome Back</h2>
          </div>
          <div className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={loginData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={handleLogin} className="login-button">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="background-image"></div>
      
      <header className="header">
        <div className="logo">
          <span>🏠 RENT EASY</span>
        </div>
        <nav className="nav">
          <button onClick={() => {setIsLoggedIn(false); setShowLogin(true);}}>
            Logout
          </button>
        </nav>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Boarding made easy, <span className="highlight">living made better</span>
          </h1>
        </div>

        <section className="boarding-section">
          <h2 className="section-title">Popular</h2>
          <div className="boarding-grid">
            {boardingHouses.map((house) => (
              <BoardingHouseCard key={house.id} house={house} />
            ))}
          </div>
        </section>

        <section className="boarding-section">
          <h2 className="section-title">Nearby</h2>
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