import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './llnavbar.css';

const LLNavbar = () => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isHomepage, setIsHomepage] = useState(true);
  const settingsDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current page based on URL path
  const getCurrentPage = () => {
    if (location.pathname === '/landlord-home') return 'home';
    if (location.pathname === '/reservations') return 'reservations';
    if (location.pathname === '/landlord-profile') return 'profile';
    return 'home';
  };

  useEffect(() => {
    setIsHomepage(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleNavigation = (pageId) => {
    if (pageId === 'settings') {
      setShowSettingsDropdown(!showSettingsDropdown);
      return;
    }
    
    setShowSettingsDropdown(false);
    
    // Redirect to reservations page
    if (pageId === 'reservations') {
      console.log('Navigating to reservations...');
      navigate('/reservations');
      return;
    }
    
    // Redirect to landlord home page (FIXED)
    if (pageId === 'home') {
      console.log('Navigating to landlord home...');
      navigate('/landlord-home');
      return;
    }
    
    console.log(`Navigating to: ${pageId}`);
  };

  const handleProfileClick = () => {
    console.log('Redirecting to landlord profile...');
    navigate('/landlord-profile');
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    console.log('Logging out...');
    setShowSettingsDropdown(false);
    navigate('/login');
  };

  const ProfileIcon = () => (
    <svg className="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m9 21 7-7-7-7"></path>
      <path d="m20 12-7-7"></path>
      <path d="M15 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    </svg>
  );

  if (!isHomepage) {
    return null;
  }

  const currentPage = getCurrentPage();

  return (
    <nav className="ll-navbar">
      <div className="ll-navbar-container">
        <div className="ll-navbar-logo">
          <img src="/logo.png" alt="RentEasy Logo" className="ll-logo-img" />
        </div>

        <div className="ll-nav-links">
          {navItems.map((item) => (
            <div key={item.id} className="ll-nav-item-container">
              <a
                href="#"
                className={`ll-nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.id);
                }}
              >
                {item.label}
              </a>
              
              {item.id === 'settings' && (
                <div 
                  ref={settingsDropdownRef}
                  className={`ll-settings-dropdown ${showSettingsDropdown ? 'show' : ''}`}
                >
                  <div className="ll-settings-option" onClick={(e) => handleLogout(e)}>
                    <LogoutIcon />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="ll-profile-container">
          <button className="ll-profile-btn" onClick={handleProfileClick}>
            <ProfileIcon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LLNavbar;