
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './admin.css';
import TransactionHistory from './TransactionHistory';

const AdminDashboard = () => {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'landlordVerifications'));
        const pending = [];
        console.log('[AdminDashboard] landlordVerifications snapshot size:', snap.size);
        snap.forEach(docSnap => {
          const data = docSnap.data();
          console.log('[AdminDashboard] Doc:', docSnap.id, data);
          if (data.status === 'pending') {
            pending.push({ id: docSnap.id, ...data });
          }
        });
        console.log('[AdminDashboard] Pending verifications:', pending);
        setPendingVerifications(pending);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pending verifications');
        console.error('[AdminDashboard] Error fetching:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleSelect = (item) => setSelected(item);

  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, 'landlordVerifications', id), { status: action });
      setPendingVerifications(prev => prev.filter(v => v.id !== id));
      setSelected(null);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="admin-main">
        <section className="admin-section">
          <h2>Pending Landlord Verifications</h2>
          {loading ? (
            <div className="admin-placeholder">Loading...</div>
          ) : error ? (
            <div className="admin-placeholder" style={{ color: 'red' }}>{error}</div>
          ) : pendingVerifications.length === 0 ? (
            <div className="admin-placeholder">No pending verifications yet.</div>
          ) : (
            <div className="pending-list">
              {pendingVerifications.map((item) => (
                <div key={item.id} className="pending-card" style={{ cursor: 'pointer', background: selected?.id === item.id ? '#f0f4ff' : '#fff' }} onClick={() => handleSelect(item)}>
                  <div><b>Landlord Name:</b> {item.landlordName || 'N/A'}</div>
                  <div><b>Reference Number:</b> {item.referenceNumber || 'N/A'}</div>
                  <div><b>Status:</b> {item.status}</div>
                </div>
              ))}
            </div>
          )}
          {/* Detail modal/panel */}
          {selected && (
            <div className="pending-detail-modal" style={{ background: '#fff', border: '1px solid #174ea6', borderRadius: 8, padding: 24, marginTop: 24, maxWidth: 500 }}>
              <h3>Landlord Verification Details</h3>
              <div><b>Landlord Name:</b> {selected.landlordName}</div>
              <div><b>Email:</b> {selected.landlordEmail}</div>
              <div><b>Contact Number:</b> {selected.contactNumber}</div>
              <div><b>Date of Birth:</b> {selected.dateOfBirth}</div>
              <div><b>Civil Status:</b> {selected.civilStatus}</div>
              <div><b>Gender:</b> {selected.gender}</div>
              <div><b>Permanent Address:</b> {selected.permanentAddress}</div>
              <div><b>Boarding House Name:</b> {selected.boardingHouseName}</div>
              <div><b>Boarding House Address:</b> {typeof selected.boardingHouseAddress === 'object' ? JSON.stringify(selected.boardingHouseAddress) : selected.boardingHouseAddress}</div>
              <div><b>Reference Number:</b> {selected.referenceNumber}</div>
              <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                <button onClick={() => handleAction(selected.id, 'approved')} disabled={actionLoading} style={{ background: '#2e7d32', color: '#fff', padding: '8px 18px', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: 15 }}>Approve</button>
                <button onClick={() => handleAction(selected.id, 'rejected')} disabled={actionLoading} style={{ background: '#c62828', color: '#fff', padding: '8px 18px', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: 15 }}>Reject</button>
                <button onClick={() => setSelected(null)} style={{ background: '#888', color: '#fff', padding: '8px 18px', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: 15 }}>Close</button>
              </div>
            </div>
          )}
        </section>
        <section className="admin-section">
          <h2>Transaction History</h2>
          <TransactionHistory />
        </section>
        <section className="admin-section">
          <h2>All Landlords</h2>
          {/* Add logic to list all landlords here */}
          <div className="admin-placeholder">No landlords found.</div>
        </section>
      </main>
    </div>
  );
};
  );
const [showTransactions, setShowTransactions] = React.useState(false);

