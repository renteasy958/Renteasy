import React, { useState } from 'react';
import Llnavbar from '../landlordnavbar/llnavbar'; // Import the landlord navbar component
import './llhome.css';

const Landlordhome = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const listingsData = [
    {
      id: 1,
      name: "Tres Marias Boarding House",
      address: "Montilla St. Brgy 1, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1000",
      rating: 4.9
    },
    {
      id: 2,
      name: "Sunshine Dormitory",
      address: "Rodriguez Ave. Brgy 3, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1500",
      rating: 4.7
    },
    {
      id: 3,
      name: "Blue Haven Lodge",
      address: "Santos St. Brgy 2, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1200",
      rating: 4.8
    },
    {
      id: 4,
      name: "Green Valley Residence",
      address: "Dela Cruz St. Brgy 4, Isabela",
      roomType: "Studio Room (1 pax)",
      price: "₱1800",
      rating: 4.6
    }
  ];

  const pendingData = [
    {
      id: 5,
      name: "Ocean View Boarding House",
      address: "Coastal Rd. Brgy 5, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1100",
      rating: 4.5
    },
    {
      id: 6,
      name: "Mountain Peak Lodge",
      address: "Highland Ave. Brgy 6, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1400",
      rating: 4.3
    },
    {
      id: 7,
      name: "City Center Dorm",
      address: "Main St. Brgy 7, Isabela",
      roomType: "Bed Space (1 pax)",
      price: "₱900",
      rating: 4.4
    },
    {
      id: 8,
      name: "Riverside Residence",
      address: "River Bank St. Brgy 8, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1050",
      rating: 4.7
    }
  ];

  const occupiedData = [
    {
      id: 9,
      name: "Golden Gate Lodge",
      address: "Gateway Ave. Brgy 9, Isabela",
      roomType: "Private Room (1 pax)",
      price: "₱1600",
      rating: 4.8
    },
    {
      id: 10,
      name: "Paradise Boarding House",
      address: "Paradise St. Brgy 10, Isabela",
      roomType: "Shared Room (2-4 pax)",
      price: "₱1300",
      rating: 4.9
    },
    {
      id: 11,
      name: "Starlight Dormitory",
      address: "Star Ave. Brgy 11, Isabela",
      roomType: "Studio Room (1 pax)",
      price: "₱1700",
      rating: 4.6
    },
    {
      id: 12,
      name: "Peaceful Haven",
      address: "Quiet St. Brgy 12, Isabela",
      roomType: "Bed Space (1 pax)",
      price: "₱850",
      rating: 4.5
    }
  ];

  const handleSeeAll = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
          <span className="price">{property.price} <span className="per-month">per month</span></span>
          <div className="rating">
            <span>{property.rating}</span>
            <span className="star">⭐</span>
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
            <h2>Listings</h2>
            <div className="header-actions">
              <button className="see-all-btn" onClick={() => handleSeeAll('listings')}>
                See all
              </button>
              <button className="add-boarding-btn">Add Boarding House</button>
            </div>
          </div>
          <div className={`cards-container ${expandedSections.listings ? 'expanded' : ''}`}>
            {listingsData.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* Pending Section */}
        <section className="section">
          <div className="section-header">
            <h2>Pending</h2>
            <div className="header-actions">
              <button className="see-all-btn" onClick={() => handleSeeAll('pending')}>
                See all
              </button>
            </div>
          </div>
          <div className={`cards-container ${expandedSections.pending ? 'expanded' : ''}`}>
            {pendingData.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* Occupied Section */}
        <section className="section">
          <div className="section-header">
            <h2>Occupied</h2>
            <div className="header-actions">
              <button className="see-all-btn">
                See all
              </button>
            </div>
          </div>
          <div className="cards-container">
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