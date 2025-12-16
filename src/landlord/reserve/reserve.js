import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './reserve.css';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setReservations([]);
        setLoading(false);
        return;
      }

      try {
        // Query reservations where landlordUid matches current user
        const q = query(collection(db, 'reservations'), where('landlordUid', '==', user.uid));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReservations(data);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleViewDetails = (id) => {
    const reservation = reservations.find(r => r.id === id);
    setSelectedReservation(reservation);
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
  };

  const handleApprove = async () => {
    try {
      // Update boarding house status to occupied
      const houseRef = doc(db, 'Boardinghouse', selectedReservation.boardingHouseId);
      await updateDoc(houseRef, { status: 'occupied' });

      // Remove reservation from reservations collection
      await deleteDoc(doc(db, 'reservations', selectedReservation.id));

      // Update local state
      setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));

      console.log('Approved reservation:', selectedReservation.id);
      handleCloseModal();
    } catch (err) {
      console.error('Error approving reservation:', err);
      alert('Failed to approve reservation');
    }
  };

  const handleReject = async () => {
    try {
      // Update boarding house status back to available
      const houseRef = doc(db, 'Boardinghouse', selectedReservation.boardingHouseId);
      await updateDoc(houseRef, { status: 'available' });

      // Remove reservation from reservations collection
      await deleteDoc(doc(db, 'reservations', selectedReservation.id));

      // Update local state
      setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));

      console.log('Rejected reservation:', selectedReservation.id);
      handleCloseModal();
    } catch (err) {
      console.error('Error rejecting reservation:', err);
      alert('Failed to reject reservation');
    }
  };

  return (
    <>
      <div className="rsv-list-container">
        {loading ? (
          <div>Loading reservations...</div>
        ) : reservations.length > 0 ? (
          reservations.map((reservation) => (
            <div key={reservation.id} className="rsv-card">
              <div className="rsv-card-info">
                <div className="rsv-info-item">
                  <span>{reservation.tenantName || 'N/A'}</span>
                </div>
                <div className="rsv-info-item">
                  <span>{reservation.tenantGender || 'N/A'}</span>
                </div>
                <div className="rsv-info-item">
                  <span>{reservation.tenantAge || 'N/A'}</span>
                </div>
                <div className="rsv-info-item">
                  <span>{reservation.tenantPhone || 'N/A'}</span>
                </div>
              </div>
              <button 
                className="rsv-view-btn"
                onClick={() => handleViewDetails(reservation.id)}
              >
                View details
              </button>
            </div>
          ))
        ) : (
          <div>No reservations found.</div>
        )}
      </div>

      {selectedReservation && (
        <>
          <div className="rsv-modal-overlay" onClick={handleCloseModal}></div>
          <div className="rsv-modal">
            <button className="rsv-modal-close" onClick={handleCloseModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="rsv-modal-wrapper">
              <div className="rsv-modal-left">
                <h2 className="rsv-modal-title">TENANT'S DETAILS</h2>
                
                <div className="rsv-details-section">
                  <div className="rsv-detail-row">
                    <span className="rsv-detail-label">Name:</span>
                    <span className="rsv-detail-value">{selectedReservation.tenantName || 'N/A'}</span>
                  </div>
                  <div className="rsv-detail-row">
                    <span className="rsv-detail-label">Gender:</span>
                    <span className="rsv-detail-value">{selectedReservation.tenantGender || 'N/A'}</span>
                  </div>
                  {/* Age removed per request; show birthdate only */}
                  <div className="rsv-detail-row">
                    <span className="rsv-detail-label">Birthdate:</span>
                    <span className="rsv-detail-value">{selectedReservation.tenantBirthdate || 'N/A'}</span>
                  </div>
                  <div className="rsv-detail-row">
                    <span className="rsv-detail-label">Status:</span>
                    <span className="rsv-detail-value">{selectedReservation.tenantStatus || 'N/A'}</span>
                  </div>
                  <div className="rsv-detail-row">
                    <span className="rsv-detail-label">Address:</span>
                    <span className="rsv-detail-value">{selectedReservation.tenantAddress || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="rsv-modal-divider"></div>

              <div className="rsv-modal-right">
                <div>
                  <h3 className="rsv-reserved-title">RESERVED</h3>
                  <h4 className="rsv-bh-name">{selectedReservation.boardingHouseName || 'N/A'}</h4>
                  <p className="rsv-bh-location">{selectedReservation.boardingHouseAddress || 'N/A'}</p>
                  <p className="rsv-room-type">{selectedReservation.roomType || 'N/A'}</p>
                  <p className="rsv-price">
                    <span className="rsv-price-amount">{selectedReservation.price || 'N/A'}</span>
                    <span className="rsv-price-label"> per month</span>
                  </p>

                  <div className="rsv-gcash-section">
                    <p className="rsv-gcash-label">Gcash reference number</p>
                    <p className="rsv-gcash-ref">{selectedReservation.gcashRefNumber || 'N/A'}</p>
                  </div>
                </div>

                <div className="rsv-action-buttons">
                  <button className="rsv-reject-btn" onClick={handleReject}>
                    Reject
                  </button>
                  <button className="rsv-approve-btn" onClick={handleApprove}>
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