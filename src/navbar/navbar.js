import React, { useState, useEffect, useRef } from 'react';
import './navbar.css';

const Navbar = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Props to control navbar visibility
  const [isHomepage, setIsHomepage] = useState(true); // Always show in this component
  const filterDropdownRef = useRef(null);

  // Simplified - navbar shows when this component is used
  useEffect(() => {
    // Since this navbar component is specifically for homepage,
    // we'll always show it when the component is rendered
    setIsHomepage(true);
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Results' },
    { value: 'apartments', label: 'Apartments' },
    { value: 'houses', label: 'Houses' },
    { value: 'condos', label: 'Condos' },
    { value: 'studios', label: 'Studios' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'liked', label: 'Liked' },
    { id: 'settings', label: 'Settings' }
  ];

  // Handle navigation click
  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    console.log(`Navigating to: ${pageId}`);
    // Add your navigation logic here
    // For example: navigate(`/${pageId}`);
  };

  // Handle filter selection
  const handleFilter = (filterType) => {
    console.log(`Applying filter: ${filterType}`);
    setShowFilterDropdown(false);
    // Add your filter logic here
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log(`Searching for: ${searchQuery}`);
      // Add your search logic here
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    console.log('Redirecting to user profile...');
    // Add your profile navigation logic here
    // For React Router: navigate('/user-profile');
    // For now, using window.location
    window.location.href = '/user-profile';
  };

  // Filter Icon SVG
  const FilterIcon = () => (
    <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="4" y1="6" x2="4" y2="20"></line>
      <line x1="12" y1="6" x2="12" y2="20"></line>
      <line x1="20" y1="6" x2="20" y2="20"></line>
      <circle cx="4" cy="9" r="3"></circle>
      <circle cx="12" cy="15" r="3"></circle>
      <circle cx="20" cy="12" r="3"></circle>
    </svg>
  );

  // Profile Icon SVG
  const ProfileIcon = () => (
    <svg className="profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  // Don't render navbar if not needed (this will always render now)
  if (!isHomepage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src="/logo.png" alt="RentEasy Logo" className="logo-img" />
        </div>

          {/* Search Bar with Filter */}
          <div className="search-container" ref={filterDropdownRef}>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
              <button
                className="filter-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilterDropdown(!showFilterDropdown);
                }}
              >
                <FilterIcon />
              </button>
            </div>
            
            {/* Filter Dropdown */}
            <div className={`filter-dropdown ${showFilterDropdown ? 'show' : ''}`}>
              {filterOptions.map((option) => (
                <div
                  key={option.value}
                  className="filter-option"
                  onClick={() => handleFilter(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Profile Icon */}
          <div className="profile-container">
            <button className="profile-btn" onClick={handleProfileClick}>
              <ProfileIcon />
            </button>
          </div>
        </div>
      </nav>

     
  );
};

export default Navbar;