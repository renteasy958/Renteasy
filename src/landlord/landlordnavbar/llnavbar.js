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
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
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
        // Fetch balance and verification status
        const landlordDoc = await getDoc(doc(db, 'landlords', user.uid));
        if (landlordDoc.exists()) {
          const landlordData = landlordDoc.data();
          setBalance(landlordData.balance || 0);
          setIsVerified(!!landlordData.verified);
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        setIsVerified(false);
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
            <span style={{
              marginLeft: 18,
              padding: '2px 10px',
              borderRadius: 8,
              background: isVerified ? '#4caf50' : '#f44336',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: 1
            }}>
              {isVerified ? 'Verified' : 'Not Verified'}
            </span>
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
                    {!isVerified && (
                      <div className="ll-settings-option" onClick={() => setShowVerifyModal(true)}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCardIcon />
                          <span style={{ marginLeft: 10 }}>Verify Account</span>
                        </span>
                      </div>
                    )}
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
        <VerifyAccount 
          onClose={() => setShowVerifyModal(false)}
          onSubmit={async ({ selectedId, frontImage, backImage, referenceNumber, frontFile, backFile }) => {
            try {
              const user = auth.currentUser;
              if (!user) throw new Error('Not logged in');
              if (!frontFile || !backFile) {
                alert('Please upload both front and back images of your ID.');
                return;
              }
              let frontUrl = null;
              let backUrl = null;
              try {
                frontUrl = await import('../../services/cloudinaryService').then(mod => mod.uploadToCloudinary(frontFile, `renteasy/ids/${user.uid}`));
              } catch (err) {
                alert('Failed to upload front of ID: ' + (err.message || err));
                return;
              }
              try {
                backUrl = await import('../../services/cloudinaryService').then(mod => mod.uploadToCloudinary(backFile, `renteasy/ids/${user.uid}`));
              } catch (err) {
                alert('Failed to upload back of ID: ' + (err.message || err));
                return;
              }
              if (!frontUrl || !backUrl) {
                alert('Image upload failed. Please try again.');
                return;
              }
              // Add verified: false on submit (pending admin approval)
              const verificationData = {
                idType: selectedId,
                idFrontUrl: frontUrl,
                idBackUrl: backUrl,
                verificationReference: referenceNumber,
                verificationSubmittedAt: new Date().toISOString(),
                verified: false // Set to false until admin verifies
              };
              try {
                await import('firebase/firestore').then(async firestore => {
                  const { doc, setDoc } = firestore;
                  await setDoc(doc(db, 'landlords', user.uid), verificationData, { merge: true });
                });
              } catch (err) {
                alert('Failed to update Firestore: ' + (err.message || err));
                return;
              }
              alert('Verification submitted successfully!');
            } catch (err) {
              alert('Verification failed: ' + (err.message || err));
            }
          }}
        />
      )}
    </>
  );
};

export default LLNavbar;