import React, { useState } from 'react';
import './reserve.css';

const ReservationList = () => {
  const [reservations] = useState([
    { 
      id: 1, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 2, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 3, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 4, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 5, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 6, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 7, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
    { 
      id: 8, 
      name: 'Christian Garcia', 
      gender: 'Male', 
      age: 23, 
      phone: '09925829565',
      birthdate: 'January 15, 2002',
      status: 'Single',
      address: '123 Main St, Cebu City',
      boardingHouse: 'Tres Marias Boarding House',
      location: 'Montilla St., Brgy 1, Isabela',
      roomType: 'Shared Room (2-4 pax)',
      price: '₱1000',
      gcashRef: '****************'
    },
  ]);

  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleViewDetails = (id) => {
    const reservation = reservations.find(r => r.id === id);
    setSelectedReservation(reservation);
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
  };

  const handleApprove = () => {
    console.log('Approved reservation:', selectedReservation.id);
    handleCloseModal();
  };

  const handleReject = () => {
    console.log('Rejected reservation:', selectedReservation.id);
    handleCloseModal();
  };

  return (
    <>
      <div className="reservation-list">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-info">
              <div className="info-item">
                <span>{reservation.name}</span>
              </div>
              <div className="info-item">
                <span>{reservation.gender}</span>
              </div>
              <div className="info-item">
                <span>{reservation.age}</span>
              </div>
              <div className="info-item">
                <span>{reservation.phone}</span>
              </div>
            </div>
            <button 
              className="view-details-btn"
              onClick={() => handleViewDetails(reservation.id)}
            >
              View details
            </button>
          </div>
        ))}
      </div>

      {selectedReservation && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="modal">
            <button className="close-btn" onClick={handleCloseModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-content-wrapper">
              <div className="left-section">
                <h2 className="modal-title">TENANT'S DETAILS</h2>
                
                <div className="details-section">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedReservation.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedReservation.gender}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{selectedReservation.age}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Birthdate:</span>
                    <span className="detail-value">{selectedReservation.birthdate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{selectedReservation.status}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{selectedReservation.address}</span>
                  </div>
                </div>
              </div>

              <div className="vertical-divider"></div>

              <div className="right-section">
                <div>
                  <h3 className="reserved-title">RESERVED</h3>
                  <h4 className="boarding-house-name">{selectedReservation.boardingHouse}</h4>
                  <p className="location">{selectedReservation.location}</p>
                  <p className="room-type">{selectedReservation.roomType}</p>
                  <p className="price">
                    <span className="price-amount">{selectedReservation.price}</span>
                    <span className="price-per-month"> per month</span>
                  </p>

                  <div className="gcash-section">
                    <p className="gcash-label">Gcash reference number</p>
                    <p className="gcash-ref">{selectedReservation.gcashRef}</p>
                  </div>
                </div>

                <div className="button-group">
                  <button className="reject-btn" onClick={handleReject}>
                    Reject
                  </button>
                  <button className="approve-btn" onClick={handleApprove}>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ReservationList;