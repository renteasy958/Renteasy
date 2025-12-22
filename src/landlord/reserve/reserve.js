import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import './reserve.css';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [excludedReservations, setExcludedReservations] = useState([]);
  const [showExcludedPanel, setShowExcludedPanel] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [expandedExcluded, setExpandedExcluded] = useState([]);
  const [deletingAll, setDeletingAll] = useState(false);

  // Fetch reservations for a landlord and populate reservations + excludedReservations
  const fetchReservationsFor = async (landlordUid) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'reservations'),
        where('landlordUid', '==', landlordUid),
        where('status', '==', 'pending')
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const enhanced = await Promise.all(data.map(async (r) => {
        try {
          const resStatus = r.status ? String(r.status).toLowerCase().trim() : null;
          if (!r.boardingHouseId) return { ...r, bhStatus: null, reservationStatusNormalized: resStatus };
          const houseSnap = await getDoc(doc(db, 'Boardinghouse', r.boardingHouseId));
          const rawBhStatus = houseSnap.exists() ? (houseSnap.data().status || null) : null;
          const bhStatus = rawBhStatus ? String(rawBhStatus).toLowerCase().trim() : null;
          return { ...r, bhStatus, reservationStatusNormalized: resStatus };
        } catch (err) {
          return { ...r, bhStatus: null, reservationStatusNormalized: r.status ? String(r.status).toLowerCase().trim() : null };
        }
      }));

      const filtered = enhanced.filter((r) => {
        const isPending = r.reservationStatusNormalized === 'pending';
        const bhReserved = r.bhStatus === 'reserved';
        const hasBoardingHouse = !!r.boardingHouseId;
        const hasCreatedAt = !!r.createdAt && !Number.isNaN(Date.parse(r.createdAt || ''));
        const hasTenant = (r.tenantUid && r.tenantUid !== '') || (r.tenantName && r.tenantName !== 'Guest' && r.tenantName !== 'N/A');
        const tenantNotBh = !(r.tenantName && r.boardingHouseName && String(r.tenantName).trim().toLowerCase() === String(r.boardingHouseName).trim().toLowerCase());
        const hasContact = (r.gcashRefNumber && String(r.gcashRefNumber).trim() !== '') || (r.tenantPhone && String(r.tenantPhone).trim() !== '');
        const looksLikeListing = (() => {
          if (Array.isArray(r.images) && r.images.length > 0) return true;
          if (r.images && typeof r.images === 'object' && Object.keys(r.images).length > 0) return true;
          if (Array.isArray(r.amenities) && r.amenities.length > 0) return true;
          if (r.amenities && typeof r.amenities === 'object' && Object.keys(r.amenities).length > 0) return true;
          if (r.landlord && typeof r.landlord === 'object') return true;
          if (r.title || r.availableRooms || r.roomCount) return true;
          if (r.description && typeof r.description === 'string' && /bed|room|studio|unit/i.test(r.description)) return true;
          return false;
        })();
        return isPending && bhReserved && hasBoardingHouse && hasCreatedAt && hasTenant && hasContact && tenantNotBh && !looksLikeListing;
      });

      const excluded = enhanced.filter((r) => !(r.reservationStatusNormalized === 'pending' && r.bhStatus === 'reserved'));
      if (excluded.length > 0) {
        setExcludedReservations(excluded);
        setShowExcludedPanel(true);
      } else {
        setExcludedReservations([]);
        setShowExcludedPanel(false);
      }

      let finalList = filtered.filter(r => {
        const hasTenant = r.tenantName && r.tenantName !== 'Guest' && r.tenantName !== 'N/A';
        const hasPayment = r.gcashRefNumber && String(r.gcashRefNumber).trim() !== '';
        const hasPhone = r.tenantPhone && String(r.tenantPhone).trim() !== '';
        return hasTenant && (hasPayment || hasPhone);
      });

      finalList = finalList.filter(r => {
        const tenantNotBh = !(r.tenantName && r.boardingHouseName && String(r.tenantName).trim().toLowerCase() === String(r.boardingHouseName).trim().toLowerCase());
        const looksLikeListing = (() => {
          if (Array.isArray(r.images) && r.images.length > 0) return true;
          if (r.images && typeof r.images === 'object' && Object.keys(r.images).length > 0) return true;
          if (Array.isArray(r.amenities) && r.amenities.length > 0) return true;
          if (r.amenities && typeof r.amenities === 'object' && Object.keys(r.amenities).length > 0) return true;
          if (r.landlord && typeof r.landlord === 'object') return true;
          if (r.title || r.availableRooms || r.roomCount) return true;
          return false;
        })();
        return tenantNotBh && !looksLikeListing;
      });

  

      // Do not filter by 'listing' or 'occupied' here; those sections are managed in Home


      // Safety: detect any suspicious items that may have slipped through and move them to excluded panel
      const suspicious = finalList.filter(r => {
        const hasImages = Array.isArray(r.images) && r.images.length > 0;
        const hasAmenitiesObject = r.amenities && (Array.isArray(r.amenities) ? r.amenities.length > 0 : (typeof r.amenities === 'object' && Object.keys(r.amenities).length > 0));
        return hasImages || hasAmenitiesObject;
      });
      if (suspicious.length > 0) {
        console.warn('[Reservations] Moving suspicious items to excluded:', suspicious.map(s => ({ id: s.id })));
        setExcludedReservations(prev => [...suspicious, ...prev]);
        finalList = finalList.filter(r => !suspicious.find(s => s.id === r.id));
        setShowExcludedPanel(true);
      }

      setReservations(finalList);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setReservations([]);
        setLoading(false);
        return;
      }
      await fetchReservationsFor(user.uid);
    });

    return () => unsub();
  }, []);

  // Prevent the overall page from scrolling while on the Reserve page
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    // hide body scroll but allow internal scrolling in component
    document.body.style.overflow = 'hidden';
    // prevent layout shift (add scrollbar width if any)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  const handleDeleteExcluded = async (id) => {
    const ok = window.confirm('Delete this excluded reservation doc? This cannot be undone.');
    if (!ok) return;
    setDeletingIds(ids => [...ids, id]);
    try {
      await deleteDoc(doc(db, 'reservations', id));
      // remove from excluded list
      setExcludedReservations(prev => prev.filter(r => r.id !== id));
      // refetch current reservations for the current landlord
      const user = auth.currentUser;
      if (user) {
        await fetchReservationsFor(user.uid);
      }
    } catch (err) {
      console.error('Failed to delete reservation doc:', err);
      alert('Failed to delete doc');
    } finally {
      setDeletingIds(ids => ids.filter(x => x !== id));
    }
  };

  const handleDeleteAllExcluded = async () => {
    if (excludedReservations.length === 0) return;
    const ok = window.confirm(`Delete ALL ${excludedReservations.length} excluded reservation docs? This cannot be undone.`);
    if (!ok) return;
    setDeletingAll(true);
    const user = auth.currentUser;
    const results = await Promise.allSettled(excludedReservations.map(e => deleteDoc(doc(db, 'reservations', e.id))));
    const failed = results
      .map((r, i) => ({ r, id: excludedReservations[i].id }))
      .filter(x => x.r.status === 'rejected')
      .map(x => x.id);
    if (failed.length > 0) {
      alert(`Failed to delete ${failed.length} docs: ${failed.join(', ')}`);
    }
    // clear excluded list and refetch
    setExcludedReservations([]);
    setShowExcludedPanel(false);
    if (user) await fetchReservationsFor(user.uid);
    setDeletingAll(false);
  };

  const toggleExcludedDetails = (id) => {
    setExpandedExcluded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleFlagExcluded = (id) => {
    const r = reservations.find(x => x.id === id);
    if (!r) return;
    setExcludedReservations(prev => [r, ...prev]);
    setReservations(prev => prev.filter(x => x.id !== id));
    setShowExcludedPanel(true);
  };

  const handleViewDetails = (id) => {
    const reservation = reservations.find(r => r.id === id);
    setSelectedReservation(reservation);
  };

  const handleCloseModal = () => {
    setSelectedReservation(null);
  };

  const handleApprove = async () => {
    try {
      // Set the related boarding house status to 'occupied'
      if (selectedReservation && selectedReservation.boardingHouseId) {
        const bhRef = doc(db, 'Boardinghouse', selectedReservation.boardingHouseId);
        await updateDoc(bhRef, { status: 'occupied' });
      }
      // Remove the reservation document
      await deleteDoc(doc(db, 'reservations', selectedReservation.id));

      // Update local state
      setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));

      console.log('Approved reservation and set property to occupied:', selectedReservation.id);
      handleCloseModal();
    } catch (err) {
      console.error('Error approving reservation:', err);
      alert('Failed to approve reservation');
    }
  };

  const handleReject = async () => {
    try {
      // Set the related boarding house status to 'available' if reservation has a boardingHouseId
      if (selectedReservation && selectedReservation.boardingHouseId) {
        const bhRef = doc(db, 'Boardinghouse', selectedReservation.boardingHouseId);
        await updateDoc(bhRef, { status: 'available' });
      }
      // Remove the reservation document
      await deleteDoc(doc(db, 'reservations', selectedReservation.id));

      // Update local state
      setReservations(prev => prev.filter(r => r.id !== selectedReservation.id));

      console.log('Rejected reservation and set property to available:', selectedReservation.id);
      handleCloseModal();
    } catch (err) {
      console.error('Error rejecting reservation:', err);
      alert('Failed to reject reservation');
    }
  };

  return (
    <>
      <div className="rsv-list-container">
        {excludedReservations.length > 0 && (
          <div className="rsv-excluded-panel">
            <div className="rsv-excluded-header">
              <span>{excludedReservations.length} excluded items</span>
              <div style={{display:'flex', gap:8}}>
                <button className="rsv-delete-all-btn" onClick={handleDeleteAllExcluded} disabled={deletingAll}>{deletingAll ? 'Deleting...' : 'Delete All'}</button>
                <button className="rsv-excluded-toggle" onClick={() => setShowExcludedPanel(s => !s)}>{showExcludedPanel ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            {showExcludedPanel && (
              <ul className="rsv-excluded-list">
                {excludedReservations.map(r => (
                  <li key={r.id} className="rsv-excluded-item">
                    <div style={{display:'flex', alignItems:'center', gap:8, width:'100%'}}>
                      <button className="rsv-excluded-id" onClick={() => toggleExcludedDetails(r.id)}>{r.id}</button>
                      <div className="rsv-excluded-meta">res:{r.reservationStatusNormalized || r.status} bh:{r.bhStatus || 'N/A'} tenant:{r.tenantName || 'N/A'}</div>
                      <button
                        className="rsv-delete-btn"
                        onClick={() => handleDeleteExcluded(r.id)}
                        disabled={deletingIds.includes(r.id)}
                      >
                        {deletingIds.includes(r.id) ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    {expandedExcluded.includes(r.id) && (
                      <pre className="rsv-excluded-json">{JSON.stringify(r, null, 2)}</pre>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {loading ? (
          <div>Loading reservations...</div>
        ) : reservations.length > 0 ? (
          reservations
            .filter(r => r.bhStatus === 'reserved' && (r.reservationStatusNormalized === 'pending' || r.status === 'pending'))
            .map((reservation) => (
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
                <button 
                  className="rsv-view-btn"
                  onClick={() => handleViewDetails(reservation.id)}
                >
                  View details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rsv-empty">No Pending Reservations</div>
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