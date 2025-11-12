import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Llnavbar from '../landlordnavbar/llnavbar'; // Import the landlord navbar component
import './llhome.css';

const Landlordhome = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});

  const listingsData = [
    {
      id: 1,
      name: "Tres Marias Boarding House",
      address: "Montilla St. Brgy 1, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1000",
     
    },
    {
      id: 2,
      name: "Tres Marias Boarding House",
      address: "Rodriguez Ave. Brgy 3, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1500",
     
    },
    {
      id: 3,
      name: "Tres Marias Boarding House",
      address: "Santos St. Brgy 2, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1200",
     
    },
    {
      id: 4,
      name: "Tres Marias Boarding House",
      address: "Dela Cruz St. Brgy 4, Isabela",
      roomType: "Studio Room (1 pax)",
      price: "₱1800",
      
    },
    {
      id: 16,
      name: "Tres Marias Boarding House",
      address: "University Ave. Brgy 16, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1050",
      
    },
    {
      id: 17,
      name: "Tres Marias Boarding House",
      address: "School St. Brgy 17, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1350",
      
    },
    {
      id: 18,
      name: "Tres Marias Boarding House",
      address: "Commerce Ave. Brgy 18, Isabela",
      roomType: "Studio Room (1 pax)",
      price: "₱1750",
      
    },
    {
      id: 19,
      name: "Tres Marias Boarding House",
      address: "Riverside St. Brgy 19, Isabela",
      roomType: "Bed Space (1 pax)",
      price: "₱900",
      
    }
  ];

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

  const PropertyCard = ({ property }) => (
    <div className="property-card">
      <div className="property-image"></div>
      <div className="property-details">
        <div className="property-info">
          <h3 className="property-name">{property.name}</h3>
          <p className="property-address">{property.address}</p>
          <p className="room-type">{property.roomType}</p>
        </div>
        <div className="property-footer">
          <span className="llprice">{property.price} <span className="per-month">per month</span></span>
          <div className="rating">
           
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <Llnavbar />
      <div className="dashboard-container">
        {/* Listings Section */}
        <section className="section">
          <div className="section-header">
            <h2>Listings ({listingsData.length})</h2>
            <div className="header-actions">
              <button className="see-all-btn" onClick={() => handleSeeAll('listings')}>
                See all
              </button>
              <button className="add-boarding-btn" onClick={handleAddBoardingHouse}>
                Add Boarding House
              </button>
            </div>
          </div>
          <div className={`cards-container ${expandedSections.listings ? 'expanded' : ''}`}>
            {listingsData.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        

        {/* Occupied Section */}
        <section className="section">
          <div className="section-header">
            <h2>Occupied ({occupiedData.length})</h2>
            <div className="header-actions">
              <button className="see-all-btn" onClick={() => handleSeeAll('occupied')}>
                See all
              </button>
            </div>
          </div>
          <div className={`cards-container ${expandedSections.occupied ? 'expanded' : ''}`}>
            {occupiedData.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landlordhome;