
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './llnavbar.css';
import { db, auth } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { uploadQRCode } from '../../services/cloudinaryService';

const LLNavbar = () => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [isHomepage, setIsHomepage] = useState(true);
  const [isNavigatingToProfile, setIsNavigatingToProfile] = useState(false);
  const settingsDropdownRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [gcashName, setGcashName] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [isEditingPayment, setIsEditingPayment] = useState(true);
  // Load payment info from Firestore on mount
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
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
      } catch (err) {
        console.warn('Failed to fetch payment info from Firestore:', err);
      }
    };
    fetchPaymentInfo();
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
                    <div className="ll-settings-option" onClick={handleProfileClick}>
                      <ProfileIcon />
                      <span>Profile</span>
                    </div>
                    <div className="ll-settings-option" onClick={() => setShowPaymentModal(true)}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon />
                        <span style={{ marginLeft: 10 }}>Payment Info</span>
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

          <div className="ll-profile-container">
            <button className="ll-profile-btn" onClick={handleProfileClick}>
              <ProfileIcon />
            </button>
          </div>
        </div>
      </nav>
      {showPaymentModal && (
        <>
          <div className="ll-blur-overlay" onClick={() => setShowPaymentModal(false)} />
          <div className="ll-payment-modal">
            <div className="ll-payment-modal-header-flex">
              <span
                className={`ll-payment-modal-edit-label${isEditingPayment ? ' ll-payment-modal-edit-label-disabled' : ''}`}
                style={{ cursor: isEditingPayment ? 'not-allowed' : 'pointer' }}
                onClick={() => !isEditingPayment && setIsEditingPayment(true)}
              >
                Edit
              </span>
              <div className="ll-payment-modal-title-wrapper">
                <h2 className="ll-payment-modal-title">Payment Info</h2>
              </div>
              <button className="ll-payment-modal-x-btn" onClick={() => setShowPaymentModal(false)} title="Close">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="6" x2="16" y2="16"/><line x1="16" y1="6" x2="6" y2="16"/></svg>
              </button>
            </div>
            <div className="ll-payment-modal-content-flex">
              <div className="ll-payment-modal-left">
                <div style={{ marginBottom: 16, fontWeight: 'bold' }}>QR Code:</div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {qrCode ? (
                    <>
                      <img src={qrCode} alt="GCash QR Code" className="ll-payment-modal-qr ll-payment-modal-qr-large" />
                      {isEditingPayment && (
                        <button className="ll-payment-modal-img-x-btn" onClick={() => setQrCode(null)} title="Remove QR Code">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/></svg>
                        </button>
                      )}
                    </>
                  ) : (
                    isEditingPayment && <button onClick={() => fileInputRef.current.click()} className="ll-upload-qr-btn">Upload QR Code</button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const user = auth.currentUser;
                          if (!user) throw new Error('Not logged in');
                          setQrCode('loading');
                          const url = await uploadQRCode(file, user.uid);
                          setQrCode(url);
                        } catch (err) {
                          alert('Failed to upload QR code.');
                          setQrCode(null);
                        }
                      }
                    }}
                    disabled={!isEditingPayment}
                  />
                </div>
              </div>
              <div className="ll-payment-modal-right" style={{ justifyContent: 'flex-end' }}>
                <div className="ll-payment-modal-row" style={{ marginTop: 0 }}>
                  <label>Account Name:</label>
                  <input
                    type="text"
                    value={gcashName}
                    onChange={e => {
                      if (isEditingPayment) setGcashName(e.target.value);
                    }}
                    placeholder="Enter GCash Account Name"
                    className="ll-payment-modal-input"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
                    disabled={!isEditingPayment}
                  />
                </div>
                <div className="ll-payment-modal-row">
                  <label>GCash Number:</label>
                  <input
                    type="text"
                    value={gcashNumber}
                    onChange={e => {
                      if (isEditingPayment) {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 11) setGcashNumber(val);
                      }
                    }}
                    placeholder="Enter GCash Number"
                    className="ll-payment-modal-input"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}
                    disabled={!isEditingPayment}
                    maxLength={11}
                  />
                </div>
              </div>
            </div>
            {isEditingPayment ? (
              <button
                className="ll-modal-save-btn"
                onClick={async () => {
                  try {
                    const user = auth.currentUser;
                    if (!user) {
                      alert('You must be logged in to save payment info.');
                      return;
                    }
                    if (qrCode === 'loading') {
                      alert('Please wait for QR code upload to finish.');
                      return;
                    }
                    await setDoc(doc(db, 'landlords', user.uid, 'payment', 'info'), {
                      gcashName,
                      gcashNumber,
                      qrCode: qrCode && qrCode !== 'loading' ? qrCode : ''
                    });
                    setIsEditingPayment(false);
                    setShowPaymentModal(false);
                  } catch (err) {
                    alert('Failed to save payment info.');
                    console.error('Error saving payment info:', err);
                  }
                }}
              >
                Save
              </button>
            ) : null}
          </div>
        </>
      )}
    </>
  );
};

export default LLNavbar;