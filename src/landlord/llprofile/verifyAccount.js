import React, { useRef, useState, useEffect } from 'react';
import './verifyAccount.css';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
const VALID_PH_IDS = [
  'Philippine Passport',
  'Driver’s License',
  'SSS ID',
  'GSIS e-Card',
  'PRC ID',
  'OWWA ID',
  'OFW ID',
  'Voter’s ID',
  'Postal ID',
  'PhilHealth ID',
  'Senior Citizen ID',
  'PWD ID',
  'Unified Multi-Purpose ID (UMID)',
  'National ID (PhilSys)',
  'TIN ID',
  'Barangay Certification',
];


const VerifyAccount = ({ onSubmit, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Store landlord and bh info
  const [profile, setProfile] = useState(null);
  const [bhInfo, setBhInfo] = useState(null);

  // Fetch landlord profile and boarding house info
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'landlords', user.uid));
        if (snap.exists()) {
          setProfile({ uid: user.uid, email: user.email, ...snap.data() });
        }
        // Optionally fetch first boarding house for this landlord
        const bhSnap = await getDoc(doc(db, 'boardinghouse', user.uid));
        if (bhSnap.exists()) {
          setBhInfo(bhSnap.data());
        }
      } catch (err) {
        setError('Failed to load profile info');
      }
    };
    fetchProfile();
  }, []);

  // Modal auto-close and redirect logic
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        window.location.href = '/llhome';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');
      // Compose verification data
      const data = {
        landlordUid: user.uid,
        landlordName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : '',
        landlordEmail: profile?.email || '',
        contactNumber: profile?.contactNumber || '',
        dateOfBirth: profile?.dateOfBirth || '',
        civilStatus: profile?.civilStatus || '',
        gender: profile?.gender || '',
        permanentAddress: profile?.permanentAddress || '',
        boardingHouseName: bhInfo?.name || profile?.boardingHouseName || '',
        boardingHouseAddress: bhInfo?.address || profile?.boardingHouseAddress || '',
        referenceNumber,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      console.log('[Verification Submission] Data to submit:', data);
      const docRef = await addDoc(collection(db, 'landlordVerifications'), data);
      console.log('[Verification Submission] Document written with ID:', docRef.id);
      setShowModal(true);
    } catch (err) {
      setError('Failed to submit: ' + (err.message || err));
      console.error('[Verification Submission] Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="verify-blur-bg" />
      <div className="verify-modal" style={{marginTop: '80px'}}>
        <button className="modal-close-x" type="button" onClick={onClose}>&#10005;</button>
        <h2>Pay Subscription Fee</h2>
        <form onSubmit={handleSubmitPayment}>
          <div className="payment-modal-flex">
            <div className="qr-section payment-modal-qr">
              <img src="/300.jpg" alt="QR Code for ₱300" className="qr-image qr-image-large" />
            </div>
            <div className="payment-modal-details">
              <label className="payment-label">Pay Yearly Subscription Fee: <b>₱300</b></label>
              <div className="gcash-section">
                <p>GCash Number:</p>
                <div className="gcash-number"><b>09158706048</b></div>
              </div>
              <div className="reference-section">
                <label>Reference Number:</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
              {error && <div style={{ color: 'red', margin: '8px 0', fontWeight: 600 }}>{error}</div>}
              {!error && submitting && <div style={{ color: '#174ea6', margin: '8px 0', fontWeight: 600 }}>Submitting, please wait...</div>}
              <button type="submit" className="submit-btn" disabled={!referenceNumber || submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </form>
      </div>
      {showModal && (
        <div className="success-overlay">
          <div className="success-animation">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
            </svg>
            <div className="success-message">Payment Submitted</div>
            <div className="success-subtext">Please wait 3 days for site visitation.</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VerifyAccount;
