import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Llnavbar from '../landlordnavbar/llnavbar'; // Import the landlord navbar component
import { getBoardingHousesByLandlord } from '../../services/bhservice';
import { auth, db } from '../../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './llhome.css';

const Landlordhome = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});
  const [listingsData, setListingsData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setListingsData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getBoardingHousesByLandlord(user.uid);
        console.log('Fetched boarding houses for landlord:', data);
        setListingsData(data);
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

  const pendingData = [
    {
      id: 5,
      name: "Tres Marias Boarding House",
      address: "Coastal Rd. Brgy 5, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1100",
      
    },
    {
      id: 6,
      name: "Tres Marias Boarding House",
      address: "Highland Ave. Brgy 6, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1400",
     
    },
   
  ];

  const occupiedData = [
    {
      id: 9,
      name: "Tres Marias Boarding House",
      address: "Gateway Ave. Brgy 9, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1600",
      
    },
    {
      id: 10,
      name: "Tres Marias Boarding House",
      address: "Paradise St. Brgy 10, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1300",
      
    },
    {
      id: 11,
      name: "Tres Marias Boarding House",
      address: "Star Ave. Brgy 11, Isabela",
      roomType: "Studio Room (1 pax)",
      price: "₱1700",
   
    },
    {
      id: 12,
      name: "Tres Marias Boarding House",
      address: "Quiet St. Brgy 12, Isabela",
      roomType: "Bed Space (1 pax)",
      price: "₱850",
     
    },
    {
      id: 13,
      name: "Tres Marias Boarding House",
      address: "Main St. Brgy 13, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱950",
     
    },
    {
      id: 14,
      name: "Tres Marias Boarding House",
      address: "Central Ave. Brgy 14, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1450",
    
    },
    {
      id: 15,
      name: "Tres Marias Boarding House",
      address: "Market St. Brgy 15, Isabela",
      roomType: "Studio Room (1 pax)",
      price: "₱1900",
      
    }
  ];

  const handleSeeAll = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddBoardingHouse = () => {
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

  const PropertyCard = ({ property, editMode }) => {
    // Format price: if it's a string starting with ₱, use it; otherwise format it
    const formattedPrice = typeof property.price === 'string' && property.price.startsWith('₱') 
      ? property.price 
      : `₱${property.price}`;
    
    // Get first image from images array
    const thumbnail = (property.images && Array.isArray(property.images) && property.images.length > 0) 
      ? property.images[0] 
      : '/default.png';
    
    return (
      <div className="property-card" style={{ position: 'relative' }}>
        {editMode && (
          <button 
            className="delete-btn small"
            onClick={() => handleDeleteBoardingHouse(property.id)}
            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, padding: '5px 8px', backgroundColor: '#ff5252', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            -
          </button>
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
            <h2>Listings ({listingsData.length})</h2>
            <div className="header-actions">
              <button className="add-boarding-btn" onClick={handleAddBoardingHouse}>
                Add Boarding House
              </button>
              <button className="see-all-btn" onClick={() => setEditMode(!editMode)}>{editMode ? 'Done' : 'Edit'}</button>
              <button className="see-all-btn" onClick={() => handleSeeAll('listings')}>
                See all
              </button>
            </div>
          </div>

          {listingsData.length > 0 ? (
            <div className={`cards-container ${expandedSections.listings ? 'expanded' : ''}`}>
              {listingsData.map(property => (
                <PropertyCard key={property.id} property={property} editMode={editMode} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No boarding houses found. Click "Add Boarding House" to create one.
            </div>
          )}
        </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Landlordhome;