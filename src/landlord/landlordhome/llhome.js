import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Llnavbar from '../landlordnavbar/llnavbar'; // Import the landlord navbar component
import { getBoardingHousesByLandlord, checkLandlordPaymentInfo } from '../../services/bhservice';
import { auth, db } from '../../firebase/config';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './llhome.css';

const Landlordhome = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});
  const [listingsData, setListingsData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPaymentInfo, setHasPaymentInfo] = useState(false);
  const [showPaymentInfoModal, setShowPaymentInfoModal] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setListingsData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [data] = await Promise.all([
          getBoardingHousesByLandlord(user.uid)
        ]);
        // Check payment info from localStorage
        const saved = localStorage.getItem('renteasy_payment_info');
        let paymentInfo = false;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (
              parsed.gcashName && parsed.gcashName.trim() !== '' &&
              parsed.gcashNumber && parsed.gcashNumber.trim().length === 11 &&
              parsed.qrCode && parsed.qrCode.trim() !== ''
            ) {
              paymentInfo = true;
            }
          } catch {}
        }
        setListingsData(data);
        setHasPaymentInfo(paymentInfo);
        setError(null);
      } catch (err) {
        console.error('Error fetching boarding houses:', err);
        setError(err.message);
        setListingsData([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleSeeAll = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddBoardingHouse = () => {
    if (!hasPaymentInfo) {
      setShowPaymentInfoModal(true);
      return;
    }
    navigate('/add-boarding-house');
  };

  const handleDeleteBoardingHouse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this boarding house listing?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'Boardinghouse', id));
      // Remove from local state
      setListingsData(prev => prev.filter(h => h.id !== id));
      alert('Boarding house deleted successfully!');
    } catch (err) {
      console.error('Error deleting boarding house:', err);
      alert('Failed to delete boarding house');
    }
  };

  const handleMakeAvailable = async (id) => {
    try {
      await updateDoc(doc(db, 'Boardinghouse', id), {
        status: 'available'
      });
      // Update local state
      setListingsData(prev => prev.map(h => h.id === id ? { ...h, status: 'available' } : h));
    } catch (err) {
      console.error('Error updating boarding house status:', err);
      alert('Failed to make boarding house available');
    }
  };

  const PropertyCard = ({ property, editMode, isOccupied }) => {
    // Format price: if it's a string starting with ₱, use it; otherwise format it
    const formattedPrice = typeof property.price === 'string' && property.price.startsWith('₱')
      ? property.price
      : `₱${property.price}`;

    // Get first image from images array
    const thumbnail = (property.images && Array.isArray(property.images) && property.images.length > 0)
      ? property.images[0]
      : '/default.png';

    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="property-card" style={{ position: 'relative' }}>
        {/* Three dots menu button */}
        <button
          className="menu-btn"
          onClick={() => setShowMenu(!showMenu)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 10,
            backgroundColor: 'transparent',
            color: 'gray',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ⋮
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: '45px',
              right: '10px',
              zIndex: 11,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              minWidth: '100px'
            }}
          >
            {isOccupied ? (
              <button
                onClick={() => {
                  handleMakeAvailable(property.id);
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px'
                }}
              >
                Make Available
              </button>
            ) : (
              <button
                onClick={() => {
                  handleDeleteBoardingHouse(property.id);
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: '#ff5252'
                }}
              >
                Remove
              </button>
            )}
          </div>
        )}

        {/* Click outside to close menu */}
        {showMenu && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9
            }}
            onClick={() => setShowMenu(false)}
          />
        )}

        <div
          className="property-image"
          style={{
            backgroundImage: `url('${thumbnail}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="property-details">
          <div className="property-info">
            <h3 className="property-name">{property.name}</h3>
            <p className="property-address">{property.address}</p>
            <p className="room-type">{property.type}</p>
          </div>
          <div className="property-footer">
              <span className="llprice">{formattedPrice} <span className="per-month">per month</span></span>
              <div className="rating">
              </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Llnavbar />
      <div className="dashboard-container">
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Loading boarding houses...
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
            Error loading boarding houses: {error}
          </div>
        )}

        {!loading && !error && (
          <>
        {/* Listings Section: always render header */}
        <section className="section">
          <div className="section-header">
            <h2>Listings ({listingsData.filter(h => h.status !== 'occupied').length})</h2>
            <div className="header-actions">
              <button
                className={`add-boarding-btn`}
                onClick={handleAddBoardingHouse}
                title={!hasPaymentInfo ? 'Please set up your GCash payment information first' : ''}
              >
                Add Boarding House
              </button>
              <button className="see-all-btn" onClick={() => handleSeeAll('listings')}>
                See all
              </button>
            </div>
          </div>

          {listingsData.filter(h => h.status !== 'occupied').length > 0 ? (
            <div className={`cards-container ${expandedSections.listings ? 'expanded' : ''}`}>
              {listingsData.filter(h => h.status !== 'occupied').map(property => (
                <PropertyCard key={property.id} property={property} editMode={editMode} isOccupied={false} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No boarding houses found. Click "Add Boarding House" to create one.
            </div>
          )}
        </section>

        {/* Occupied Section */}
        {listingsData.filter(h => h.status === 'occupied').length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2>Occupied ({listingsData.filter(h => h.status === 'occupied').length})</h2>
              <div className="header-actions">
                <button className="see-all-btn" onClick={() => handleSeeAll('occupied')}>
                  See all
                </button>
              </div>
            </div>

            <div className={`cards-container ${expandedSections.occupied ? 'expanded' : ''}`}>
              {listingsData.filter(h => h.status === 'occupied').map(property => (
                <PropertyCard key={property.id} property={property} editMode={false} isOccupied={true} />
              ))}
            </div>
          </section>
        )}
          </>
        )}
      </div>
    {/* Payment Info Required Modal */}
    {showPaymentInfoModal && (
      <>
        <div className="ll-blur-overlay" onClick={() => setShowPaymentInfoModal(false)} />
        <div className="ll-payment-modal">
          <h2>ADD YOUR PAYMENT INFORMATION FIRST</h2>
          <div style={{ margin: '18px 0', textAlign: 'left', maxWidth: 340 }}>
            Go to <b>Settings</b>, click <b>Payment Info</b> and add your <b>GCash account name</b>, <b>GCash number</b> and <b>upload your GCash QR code</b>.
          </div>
          <button className="ll-modal-close-btn" onClick={() => setShowPaymentInfoModal(false)}>Close</button>
        </div>
      </>
    )}
  </div>
  );
};

export default Landlordhome;
