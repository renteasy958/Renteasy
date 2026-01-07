import React, { useState, useEffect } from 'react';

import TransactionHistory from './TransactionHistory';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import './admin.css';
import VerifyAccount from './VerifyAccount';
import { getAllBoardingHouses } from '../services/bhservice';

// ...ID-related code removed as requested
// Use public folder reference for logo

const pages = [
  { key: 'verifyaccount', label: 'Verify Account' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'landlords', label: 'Landlords' },
  { key: 'tenants', label: 'Tenants' },
  { key: 'boardinghouses', label: 'Boarding Houses' },
  { key: 'transactions', label: 'Transaction History' },
];

// Simple SVG icons for sidebar
const icons = {
  verifyaccount: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
  ),
  verifications: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
  ),
  pending: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  landlords: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
  ),
  tenants: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"/></svg>
  ),
  boardinghouses: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="8" rx="2"/><path d="M4 10l8-6 8 6"/></svg>
  ),
  transactions: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M8 11h8M8 15h8"/><circle cx="7" cy="11" r="1.5"/><circle cx="7" cy="15" r="1.5"/></svg>
  ),
};

function AdminSidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
      </div>
      <nav className="admin-nav">
        {pages.map(page => (
          <button
            key={page.key}
            className={`admin-nav-link${currentPage === page.key ? ' active' : ''}`}
            onClick={() => setCurrentPage(page.key)}
          >
            {icons[page.key]}
            {page.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}



function AdminMain({ currentPage }) {
    const [selectedTenant, setSelectedTenant] = useState(null);
    const handleTenantClick = (tenant) => {
      setSelectedTenant(tenant);
      setModalOpen(true);
    };
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Modal state moved outside switch
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBH, setSelectedBH] = useState(null);
    // Removed SeeIdButton and showIdModal state as requested
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [selectedLandlord, setSelectedLandlord] = useState(null);

  useEffect(() => {
    if (currentPage === 'boardinghouses') {
      setLoading(true);
      setError(null);
      getAllBoardingHouses()
        .then((data) => {
          setBoardingHouses(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch boarding houses.');
          setLoading(false);
        });
    } else if (currentPage === 'landlords') {
      setLoading(true);
      setError(null);
      getDocs(collection(db, 'landlords'))
        .then((querySnapshot) => {
          const allLandlords = [];
          querySnapshot.forEach((doc) => {
            allLandlords.push({ id: doc.id, ...doc.data() });
          });
          setLandlords(allLandlords);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch landlords.');
          setLoading(false);
        });
    } else if (currentPage === 'tenants') {
      setLoading(true);
      setError(null);
      getDocs(collection(db, 'tenants'))
        .then((querySnapshot) => {
          const allTenants = [];
          querySnapshot.forEach((doc) => {
            allTenants.push({ id: doc.id, ...doc.data() });
          });
          setTenants(allTenants);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch tenants.');
          setLoading(false);
        });
    }
  }, [currentPage]);

  // Helper to chunk array into rows of 5
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const handleCardClick = async (bh) => {
    setSelectedBH(bh);
    setLandlordInfo(null);
    setModalOpen(true);
    // Fetch landlord info from Firestore
    const landlordUid = bh.landlordId || bh.landlordUid;
    if (landlordUid) {
      try {
        const snap = await getDoc(doc(db, 'landlords', landlordUid));
        if (snap.exists()) {
          const data = snap.data();
          console.log('[Admin Modal] Landlord info:', data);
          setLandlordInfo(data);
        } else {
          setLandlordInfo(null);
        }
      } catch (err) {
        setLandlordInfo(null);
      }
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBH(null);
  };

  const handleLandlordClick = (landlord) => {
    setSelectedLandlord(landlord);
    setModalOpen(true);
  };

  const closeLandlordModal = () => {
    setModalOpen(false);
    setSelectedLandlord(null);
  };

  switch (currentPage) {
    case 'verifyaccount':
      return <VerifyAccount />;
    case 'pending':
      return <div className="admin-content" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>List of boarding houses pending approval (approve/reject)</div>;
    case 'landlords':
      return (
        <div className="admin-content" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && (
            <div className="landlord-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {landlords.length === 0 ? (
                <div>No landlords found.</div>
              ) : (
                landlords.map((ll) => (
                  <div
                    key={ll.id}
                    className="landlord-list-card"
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '14px 24px',
                      background: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      cursor: 'pointer',
                      minWidth: 340,
                      width: '100%',
                      maxWidth: 1200,
                      overflow: 'hidden',
                    }}
                    onClick={() => handleLandlordClick(ll)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <span style={{ fontSize: 17, fontWeight: 600 }}>{ll.firstName || ''} {ll.middleName || ''} {ll.lastName || ''}</span>
                      <span style={{ flex: 1 }}></span>
                      <span style={{ fontSize: 13, color: ll.verified ? 'green' : 'red', fontWeight: 500, textAlign: 'right' }}>
                        {ll.verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
        )}

          {/* Modal for landlord details */}
          {modalOpen && selectedLandlord && (
            <div
              className="landlord-modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={closeLandlordModal}
            >
              <div
                className="landlord-modal-content"
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: 32,
                  minWidth: 540,
                  maxWidth: 700,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  position: 'relative',
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={closeLandlordModal}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    border: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                  }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 12px 0', gap: '18px' }}>
                  <h3 style={{ margin: 0 }}>{selectedLandlord.firstName || ''} {selectedLandlord.middleName || ''} {selectedLandlord.lastName || ''}</h3>
                  {(selectedLandlord.idUrl || selectedLandlord.IDUrl || selectedLandlord.landlordIdUrl || selectedLandlord.landlordIdImageUrl) && (
                    <span style={{ color: '#888', textDecoration: 'underline', cursor: 'pointer', fontSize: 16 }} onClick={e => { e.stopPropagation(); document.getElementById('see-id-btn').click(); }}>See ID</span>
                  )}
                </div>
                <div className="landlord-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 12 }}>
                  <div><strong>Email:</strong> {selectedLandlord.email ? selectedLandlord.email : ''}</div>
                  <div><strong>Contact:</strong> {selectedLandlord.contactNumber || selectedLandlord.phone || selectedLandlord.mobile || ''}</div>
                  <div><strong>Gender:</strong> {selectedLandlord.gender ? selectedLandlord.gender : ''}</div>
                  <div><strong>Birthdate:</strong> {selectedLandlord.birthdate ? selectedLandlord.birthdate : (selectedLandlord.dateOfBirth ? selectedLandlord.dateOfBirth : '')}</div>
                  <div><strong>Verified:</strong> {selectedLandlord.verified ? 'Yes' : 'No'}</div>
                  <div><strong>Civil Status:</strong> {selectedLandlord.civilStatus || selectedLandlord.civilstatus || ''}</div>
                </div>
                <div style={{ marginBottom: 12, display: 'flex', gap: '32px' }}>
                  <span><strong>Age:</strong> {selectedLandlord.age || ''}</span>
                  <span><strong>Registered At:</strong> {selectedLandlord.registeredAt || selectedLandlord.createdAt || ''}</span>
                </div>
                <div style={{ marginBottom: 12 }}><strong>Address:</strong> {
                  selectedLandlord.address && typeof selectedLandlord.address === 'object' ?
                    [selectedLandlord.address.streetSitio, selectedLandlord.address.barangay, selectedLandlord.address.cityMunicipality, selectedLandlord.address.province].filter(Boolean).join(', ') :
                  selectedLandlord.address ? selectedLandlord.address :
                  (selectedLandlord.permanentAddress && typeof selectedLandlord.permanentAddress === 'object' ?
                    [selectedLandlord.permanentAddress.streetSitio, selectedLandlord.permanentAddress.barangay, selectedLandlord.permanentAddress.cityMunicipality, selectedLandlord.permanentAddress.province].filter(Boolean).join(', ') :
                    selectedLandlord.permanentAddress || '')
                }</div>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
                <div style={{ marginBottom: 8 }}><strong>Boarding House Name:</strong> {selectedLandlord.boardingHouseName || selectedLandlord.boardinghouseName || selectedLandlord.bhName || selectedLandlord.bhname || ''}</div>
                <div style={{ marginBottom: 12 }}><strong>Boarding House Address:</strong> {
                  selectedLandlord.boardingHouseAddress && typeof selectedLandlord.boardingHouseAddress === 'object' ?
                    [selectedLandlord.boardingHouseAddress.streetSitio, selectedLandlord.boardingHouseAddress.barangay, selectedLandlord.boardingHouseAddress.cityMunicipality, selectedLandlord.boardingHouseAddress.province].filter(Boolean).join(', ') :
                  selectedLandlord.boardingHouseAddress || selectedLandlord.boardinghouseAddress || selectedLandlord.bhAddress || selectedLandlord.bhaddress || ''
                }</div>
                {/* Show all other registration details except profile image fields, in two columns */}
                <div className="landlord-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 12 }}>
                  {Object.entries(selectedLandlord).filter(([key, value]) => {
                    const excludeFields = [
                      'firstName','middleName','lastName','email','contactNumber','phone','mobile','gender','birthdate','dateOfBirth','address','permanentAddress','verified','registeredAt','createdAt','id','idUrl','IDUrl','ID',
                      'photoURL','profilePic','landlordPhoto','landlordIdPhoto','landlordIdPic','landlordIdImage','landlordIdImageUrl','landlordIdPhotoUrl','landlordIdPicUrl','landlordIdImageURL','landlordIdPhotoURL','landlordIdPicURL',
                      'profileimage','ProfileImage','PROFILEIMAGE','profileImage','profile_image','profile-img','profileImg','profileimg','profilepicture','profilePicture','profilepic','profilePic','profile_pic','profile-photo','profilePhoto','profilephoto','profile-photo-url','profilePhotoUrl','profilephotoUrl','profile-photo-URL','profilePhotoURL','profilephotoURL',
                      'role','civilStatus','civilstatus',
                      'BoardingHouseAddress','boardingHouseAddress','boardinghouseAddress','bhAddress','bhaddress',
                      'BoardingHouseName','boardingHouseName','boardinghouseName','bhName','bhname',
                      'Age','age'
                    ];
                    return !excludeFields.some(f => f.toLowerCase() === key.toLowerCase()) && value;
                  }).map(([key, value]) => (
                    <div key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}</div>
                  ))}
                </div>
                {/* SeeIdButton removed as requested */}
              </div>
            </div>
          )}

        </div>
      );
    case 'tenants':
      return (
        <div className="admin-content" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && (
            <div className="tenant-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tenants && tenants.length === 0 ? (
                <div>No tenants found.</div>
              ) : (
                tenants && tenants.map((tenant) => (
                  <div
                    key={tenant.id}
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
                      cursor: 'pointer',
                      minWidth: 340,
                      width: '100%',
                      maxWidth: 1200,
                      overflow: 'hidden',
                    }}
                    onClick={() => handleTenantClick(tenant)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <span style={{ fontSize: 17, fontWeight: 600 }}>{tenant.firstName || ''} {tenant.middleName || ''} {tenant.lastName || ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Modal for tenant details */}
          {modalOpen && selectedTenant && (
          <div
            className="tenant-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => { setModalOpen(false); setSelectedTenant(null); }}
          >
            <div
              className="tenant-modal-content"
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: 32,
                minWidth: 540,
                maxWidth: 700,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => { setModalOpen(false); setSelectedTenant(null); }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                &times;
              </button>
              <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 12px 0', gap: '18px' }}>
                <h3 style={{ margin: 0 }}>{selectedTenant.firstName || ''} {selectedTenant.middleName || ''} {selectedTenant.lastName || ''}</h3>
              </div>
              <div className="tenant-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 12 }}>
                <div><strong>Email:</strong> {selectedTenant.email ? selectedTenant.email : ''}</div>
                <div><strong>Contact:</strong> {selectedTenant.mobile || selectedTenant.contactNumber || selectedTenant.phone || ''}</div>
                <div><strong>Gender:</strong> {selectedTenant.gender ? selectedTenant.gender : ''}</div>
                <div><strong>Birthdate:</strong> {selectedTenant.birthdate ? selectedTenant.birthdate : (selectedTenant.dateOfBirth ? selectedTenant.dateOfBirth : '')}</div>
                <div><strong>Civil Status:</strong> {selectedTenant.civilStatus || selectedTenant.civilstatus || ''}</div>
              </div>
              <div style={{ marginBottom: 12, display: 'flex', gap: '32px' }}>
                <span><strong>Age:</strong> {selectedTenant.age || ''}</span>
                <span><strong>Registered At:</strong> {selectedTenant.registeredAt || selectedTenant.createdAt || ''}</span>
              </div>
              <div style={{ marginBottom: 12 }}><strong>Address:</strong> {
                selectedTenant.address && typeof selectedTenant.address === 'object' ?
                  [selectedTenant.address.streetSitio, selectedTenant.address.barangay, selectedTenant.address.cityMunicipality, selectedTenant.address.province].filter(Boolean).join(', ') :
                selectedTenant.address ? selectedTenant.address :
                (selectedTenant.permanentAddress && typeof selectedTenant.permanentAddress === 'object' ?
                  [selectedTenant.permanentAddress.streetSitio, selectedTenant.permanentAddress.barangay, selectedTenant.permanentAddress.cityMunicipality, selectedTenant.permanentAddress.province].filter(Boolean).join(', ') :
                  selectedTenant.permanentAddress || '')
              }</div>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />
              {/* Show all other registration details except profile image fields, in two columns */}
              <div className="tenant-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 12 }}>
                {Object.entries(selectedTenant).filter(([key, value]) => {
                  const excludeFields = [
                    'firstName','middleName','lastName','email','contactNumber','phone','gender','birthdate','dateOfBirth','address','permanentAddress','verified','registeredAt','createdAt','id',
                    'photoURL','profilePic','tenantPhoto','tenantIdPhoto','tenantIdPic','tenantIdImage','tenantIdImageUrl','tenantIdPhotoUrl','tenantIdPicUrl','tenantIdImageURL','tenantIdPhotoURL','tenantIdPicURL',
                    'profileimage','ProfileImage','PROFILEIMAGE','profileImage','profile_image','profile-img','profileImg','profileimg','profilepicture','profilePicture','profilepic','profilePic','profile_pic','profile-photo','profilePhoto','profilephoto','profile-photo-url','profilePhotoUrl','profilephotoUrl','profile-photo-URL','profilePhotoURL','profilephotoURL',
                    'role','civilStatus','civilstatus',
                    'Age','age','mobile'
                  ];
                  return !excludeFields.some(f => f.toLowerCase() === key.toLowerCase()) && value;
                }).map(([key, value]) => (
                  <div key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      );
    case 'boardinghouses':
      return (
        <div className="admin-content" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>
          <h2>All Boarding Houses</h2>
          {loading && <div>Loading...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && (
            <div className="bh-list-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {boardingHouses.length === 0 ? (
                <div>No boarding houses found.</div>
              ) : (
                chunkArray(boardingHouses, 5).map((row, rowIdx) => (
                  <div key={rowIdx} style={{ display: 'flex', gap: '20px' }}>
                    {row.map((bh) => (
                      <div
                        key={bh.id}
                        className="bh-list-card"
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '14px',
                          background: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          width: '200px',
                          minHeight: '180px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          transition: 'box-shadow 0.2s',
                        }}
                        onClick={() => handleCardClick(bh)}
                      >
                        {bh.images && bh.images.length > 0 && (
                          <img src={bh.images[0]} alt="Boarding House" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                        )}
                        <div style={{ fontSize: 16, fontWeight: 600, textAlign: 'center' }}>
                          {bh.name || 'No Name'}
                        </div>
                        <div style={{ color: '#888', fontSize: 13, textAlign: 'center', margin: '4px 0' }}>
                          {typeof bh.address === 'object' && bh.address !== null
                            ? [bh.address.streetSitio, bh.address.barangay, bh.address.cityMunicipality, bh.address.province].filter(Boolean).join(', ')
                            : (bh.address || 'No Address')}
                        </div>
                      </div>
                    ))}
                    {/* Fill empty boxes if row < 5 */}
                    {row.length < 5 && Array.from({ length: 5 - row.length }).map((_, i) => (
                      <div key={i} style={{ width: '200px', minHeight: '180px', background: 'transparent' }} />
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Modal for details */}
          {modalOpen && selectedBH && (
            <div
              className="bh-modal-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={closeModal}
            >
              <div
                className="bh-modal-content"
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: 32,
                  minWidth: 340,
                  maxWidth: 420,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  position: 'relative',
                }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    border: 'none',
                    fontSize: 22,
                    cursor: 'pointer',
                  }}
                  aria-label="Close"
                >
                  &times;
                </button>
                {selectedBH.images && selectedBH.images.length > 0 && (
                  <img src={selectedBH.images[0]} alt="Boarding House" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
                )}
                <h3 style={{ margin: '8px 0 4px 0' }}>{selectedBH.name || 'No Name'}</h3>
                <div style={{ color: '#888', marginBottom: 8 }}>{selectedBH.address || 'No Address'}</div>
                <div><strong>Owner:</strong> {landlordInfo ? ((landlordInfo.firstName || '') + (landlordInfo.lastName ? ' ' + landlordInfo.lastName : '') || 'Unknown') : 'Loading...'}</div>
                <div><strong>Contact:</strong> {landlordInfo ? (landlordInfo.contactNumber || landlordInfo.phone || landlordInfo.mobile || 'N/A') : 'Loading...'}</div>
                <div><strong>Price:</strong> {selectedBH.price ? `₱${selectedBH.price}` : 'N/A'}</div>
              </div>
            </div>
          )}
        </div>
      );
    case 'transactions':
      return <div className="admin-content" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}><TransactionHistory /></div>;
    default:
      return <div className="admin-content" style={{ minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0 }}>Select a page</div>;
  }
}

const Admin = () => {
  const [currentPage, setCurrentPage] = useState('verifications');
  return (
    <div className="admin-root">
      <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="admin-main-content">
        <AdminMain currentPage={currentPage} />
      </main>
    </div>
  );
};

export default Admin;
