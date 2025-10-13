import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: null,
    location: null,
    priceRange: null
  });
  const filterDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);

  // Determine current page based on location
  const getCurrentPage = () => {
    if (location.pathname === '/liked') return 'liked';
    if (location.pathname === '/tenant-home' || location.pathname === '/') return 'home';
    return 'home';
  };

  const currentPage = getCurrentPage();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter categories
  const filterCategories = {
    type: {
      label: 'TYPE',
      options: [
        { value: 'single-room', label: 'Single Room' },
        { value: 'bed-spacer', label: 'Bed Spacer' },
        { value: 'apartment-type', label: 'Apartment Type' },
        { value: 'shared-room-2-4', label: 'Shared Room (2-4 pax)' },
        { value: 'shared-room-5-8', label: 'Shared Room (5-8 pax)' },
        { value: 'family', label: 'Family' }
      ]
    },
    location: {
      label: 'LOCATION',
      options: [
        { value: 'barangay-1', label: 'Barangay 1' },
        { value: 'barangay-2', label: 'Barangay 2' },
        { value: 'barangay-3', label: 'Barangay 3' },
        { value: 'barangay-4', label: 'Barangay 4' },
        { value: 'barangay-5', label: 'Barangay 5' },
        { value: 'barangay-6', label: 'Barangay 6' },
        { value: 'barangay-7', label: 'Barangay 7' },
        { value: 'barangay-8', label: 'Barangay 8' },
        { value: 'barangay-9', label: 'Barangay 9' }
      ]
    },
    priceRange: {
      label: 'PRICE RANGE',
      options: [
        { value: '500-2000', label: '₱500 - ₱2,000' },
        { value: '2001-5000', label: '₱2,001 - ₱5,000' },
        { value: '5001-up', label: '₱5,001 and up' }
      ]
    }
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'liked', label: 'Liked' },
    { id: 'settings', label: 'Settings' }
  ];

  // Handle navigation click
  const handleNavigation = (pageId) => {
    if (pageId === 'settings') {
      setShowSettingsDropdown(!showSettingsDropdown);
      return;
    }
    
    setShowSettingsDropdown(false);
    
    // Navigate to the appropriate page using React Router
    if (pageId === 'liked') {
      navigate('/liked');
    } else if (pageId === 'home') {
      navigate('/tenant-home');
    }
    
    console.log(`Navigating to: ${pageId}`);
  };

  // Handle filter selection
  const handleFilterSelect = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value
    }));
    console.log(`Selected filter - ${category}: ${value}`);
    // Add your filter logic here
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      type: null,
      location: null,
      priceRange: null
    });
    console.log('All filters cleared');
  };

  // Apply filters
  const applyFilters = () => {
    console.log('Applying filters:', selectedFilters);
    setShowFilterDropdown(false);
    // Add your apply filter logic here
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
    navigate('/user-profile');
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    setShowSettingsDropdown(false);
    // Add your logout logic here
    // Clear user session, tokens, etc.
    navigate('/login');
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

  // Logout Icon SVG
  const LogoutIcon = () => (
    <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m9 21 7-7-7-7"></path>
      <path d="m20 12-7-7"></path>
      <path d="M15 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    </svg>
  );

  // Count selected filters
  const selectedFiltersCount = Object.values(selectedFilters).filter(Boolean).length;

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
              className={`filter-btn ${selectedFiltersCount > 0 ? 'has-filters' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
            >
              <FilterIcon />
              {selectedFiltersCount > 0 && (
                <span className="filter-count">{selectedFiltersCount}</span>
              )}
            </button>
          </div>
          
          {/* Enhanced Filter Dropdown */}
          <div className={`filter-dropdown ${showFilterDropdown ? 'show' : ''}`}>
            <div className="filter-header">
              <h3>Filter Options</h3>
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
            
            {Object.entries(filterCategories).map(([categoryKey, category]) => (
              <div key={categoryKey} className="filter-category">
                <div className="filter-category-header">
                  <h4>{category.label}</h4>
                  {selectedFilters[categoryKey] && (
                    <span className="selected-indicator">✓</span>
                  )}
                </div>
                <div className="filter-options">
                  {category.options.map((option) => (
                    <div
                      key={option.value}
                      className={`filter-option ${
                        selectedFilters[categoryKey] === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleFilterSelect(categoryKey, option.value)}
                    >
                      <span className="filter-option-text">{option.label}</span>
                      {selectedFilters[categoryKey] === option.value && (
                        <span className="checkmark">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="filter-actions">
              <button className="apply-filters-btn" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {navItems.map((item) => (
            <div key={item.id} className="nav-item-container">
              <a
                href="#"
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
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
                  className={`settings-dropdown ${showSettingsDropdown ? 'show' : ''}`}
                >
                  <div className="settings-option" onClick={handleLogout}>
                    <LogoutIcon />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
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