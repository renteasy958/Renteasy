
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import './admin.css';

// Use the same icon as the sidebar for verify account
const verifyAccountIcon = (
  <svg width="28" height="28" fill="none" stroke="#174ea6" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
);


const VerifyAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        // Fetch unverified landlords from Firestore
        const snap = await getDocs(collection(db, 'landlords'));
        const unverified = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(l => l.verified !== true);
        setAccounts(unverified);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);



  return (
    <div className="admin-content">
      <h2 style={{ marginLeft: 0, marginTop: 0 }}>Verify Account</h2>
      {loading && <div>Loading...</div>}
      {/* Error message removed as security is disabled */}
      {!loading && accounts.length === 0 && <div>No unverified accounts found.</div>}
      {!loading && accounts.length > 0 && (
        <div className="tenant-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          {accounts.map((l) => (
            <div
              key={l.id}
              className="tenant-list-card"
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '14px 24px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                minWidth: 340,
                width: '100%',
                maxWidth: 900,
                overflow: 'hidden',
              }}
            >
              {/* Sidebar icon for unverified account */}
              <span style={{ marginRight: 18, fontSize: 28, color: '#174ea6', display: 'flex', alignItems: 'center' }}>
                {verifyAccountIcon}
              </span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{l.firstName || ''} {l.middleName || ''} {l.lastName || ''}</span>
              <span style={{ flex: 1 }}></span>
              <span style={{ fontSize: 13, color: 'red', fontWeight: 500, textAlign: 'right' }}>
                Not Verified
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifyAccount;
