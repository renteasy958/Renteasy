import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './llnavbar.css';
import { db, auth } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { uploadQRCode } from '../../services/cloudinaryService';
import VerifyAccount from '../llprofile/verifyAccount';

const LLNavbar = () => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isHomepage, setIsHomepage] = useState(true);
  const [isNavigatingToProfile, setIsNavigatingToProfile] = useState(false);
  const settingsDropdownRef = useRef(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [gcashName, setGcashName] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [isEditingPayment, setIsEditingPayment] = useState(true);
  // Load payment info and balance from Firestore on mount
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        console.log('[LLNavbar] Fetching landlord info for UID:', user.uid);
        // Fetch payment info
        const paymentDoc = await getDoc(doc(db, 'landlords', user.uid, 'payment', 'info'));
        if (paymentDoc.exists()) {
          const data = paymentDoc.data();
          if (data.gcashName) setGcashName(data.gcashName);
          if (data.gcashNumber) setGcashNumber(data.gcashNumber);
          if (data.qrCode) setQrCode(data.qrCode);
          setIsEditingPayment(false);
        } else {
          setIsEditingPayment(true);
        }
        // Fetch balance
        const landlordDoc = await getDoc(doc(db, 'landlords', user.uid));
        if (landlordDoc.exists()) {
          const landlordData = landlordDoc.data();
          console.log('[LLNavbar] Landlord doc data:', landlordData);
          setBalance(landlordData.balance || 0);
        } else {
          console.warn('[LLNavbar] No landlord doc found for UID:', user.uid);
        }
      } catch (err) {
        console.warn('Failed to fetch landlord info from Firestore:', err);
      }
    };
    fetchLandlordInfo();
  }, []);
  const fileInputRef = useRef(null);
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

  // Add this useEffect to reset the state when location changes
  useEffect(() => {
    if (location.pathname === '/llprofile') {
      setIsNavigatingToProfile(true);
    } else {
      setIsNavigatingToProfile(false);
    }
  }, [location.pathname]);

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
      navigate('/llhome');
      return;
    }
    
    console.log(`Navigating to: ${pageId}`);
  };

  const handleProfileClick = () => {
    console.log('Redirecting to landlord profile...');
    setIsNavigatingToProfile(true);
    navigate('/llprofile');
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

  // Credit Card Icon SVG
  const CreditCardIcon = () => (
    <svg className="credit-card-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="7" cy="16" r="1.5" />
      <circle cx="11" cy="16" r="1.5" />
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
    <>
      <nav className={`ll-navbar ${isNavigatingToProfile ? 'navigating-to-profile' : ''}`}>
        <div className="ll-navbar-container">
          <div className="ll-navbar-logo">
            <img src="logo.png" alt="RentEasy Logo" className="ll-logo-img" />
          </div>

          {/* Peso Balance Display - label first, then peso sign and number */}
          <div style={{ marginLeft: 24, fontWeight: 600, fontSize: 18, color: '#fff', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>Balance:</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>₱{balance.toLocaleString()}</span>
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
                    {/* Profile shortcut added */}
                    <div className="ll-settings-option" onClick={handleProfileClick}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <ProfileIcon />
                        <span style={{ marginLeft: 10 }}>Profile</span>
                      </span>
                    </div>
                    <div className="ll-settings-option" onClick={() => setShowVerifyModal(true)}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon />
                        <span style={{ marginLeft: 10 }}>Verify Account</span>
                      </span>
                    </div>
                    <div className="ll-settings-option" onClick={(e) => handleLogout(e)}>
                      <LogoutIcon />
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Profile icon removed as requested */}
        </div>
      </nav>
      {showVerifyModal && (
        <VerifyAccount onClose={() => setShowVerifyModal(false)} />
      )}
    </>
  );
};

export default LLNavbar;