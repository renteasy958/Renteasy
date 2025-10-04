import React, { useState, useEffect, useRef } from 'react';
import './llnavbar.css';

const LLNavbar = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  // Props to control navbar visibility
  const [isHomepage, setIsHomepage] = useState(true); // Always show in this component
  const settingsDropdownRef = useRef(null);

  // Simplified - navbar shows when this component is used
  useEffect(() => {
    // Since this navbar component is specifically for landlord pages,
    // we'll always show it when the component is rendered
    setIsHomepage(true);
  }, []);

  // Close dropdowns when clicking outside
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

  // Navigation items for landlord
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'settings', label: 'Settings' }
  ];

  // Handle navigation click
  const handleNavigation = (pageId) => {
    if (pageId === 'settings') {
      setShowSettingsDropdown(!showSettingsDropdown);
      return;
    }
    
    setCurrentPage(pageId);
    setShowSettingsDropdown(false);
    console.log(`Navigating to: ${pageId}`);
    // Add your navigation logic here
    // For example: navigate(`/landlord/${pageId}`);
  };

  // Handle profile click
  const handleProfileClick = () => {
    console.log('Redirecting to landlord profile...');
    // Add your profile navigation logic here
    // For React Router: navigate('/landlord-profile');
    // For now, using window.location
    window.location.href = '/landlord-profile';
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    setShowSettingsDropdown(false);
    // Add your logout logic here
    // Clear user session, tokens, etc.
    // For now, redirect to login page
    window.location.href = '/login';
  };

  // Profile Icon SVG
  const ProfileIcon = () => (
    <svg className="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  // Logout Icon SVG
  const LogoutIcon = () => (
    <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m9 21 7-7-7-7"></path>
      <path d="m20 12-7-7"></path>
      <path d="M15 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    </svg>
  );

  // Don't render navbar if not needed (this will always render now)
  if (!isHomepage) {
    return null;
  }

  return (
    <nav className="ll-navbar">
      <div className="ll-navbar-container">
        {/* Logo */}
        <div className="ll-navbar-logo">
          <img src="/logo.png" alt="RentEasy Logo" className="ll-logo-img" />
        </div>

        {/* Navigation Links */}
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
              
              {/* Settings Dropdown */}
              {item.id === 'settings' && (
                <div 
                  ref={settingsDropdownRef}
                  className={`ll-settings-dropdown ${showSettingsDropdown ? 'show' : ''}`}
                >
                  <div className="ll-settings-option" onClick={handleLogout}>
                    <LogoutIcon />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile Icon */}
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