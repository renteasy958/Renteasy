import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './Verifications.css';

const Verifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Get all pending verification requests
        const querySnapshot = await getDocs(collection(db, 'landlordVerifications'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Get all landlords
        const landlordsSnap = await getDocs(collection(db, 'landlords'));
        const allLandlords = landlordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const unverifiedLandlords = allLandlords.filter(l => l.verified !== true);
        // Debug: log all landlords and verifications
        console.log('[Verifications] All landlords:', allLandlords);
        console.log('[Verifications] Unverified landlords:', unverifiedLandlords);
        console.log('[Verifications] All verification requests:', data);
        // Show all pending requests and unverified landlords not in the queue
        const pendingIds = data.filter(r => r.status === 'pending').map(r => r.landlordUid);
        const notInQueue = unverifiedLandlords.filter(l => !pendingIds.includes(l.id));
        // Add not-in-queue landlords as 'not submitted' for admin visibility
        const notInQueueDisplay = notInQueue.map(l => ({
          id: l.id,
          landlordName: `${l.firstName || ''} ${l.lastName || ''}`.trim(),
          landlordEmail: l.email || '',
          referenceNumber: '',
          status: 'not submitted',
        }));
        setRequests([
          ...data.filter(r => r.status === 'pending'),
          ...notInQueueDisplay
        ]);
      } catch (err) {
        setError('Failed to load verification requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id, landlordUid) => {
    try {
      await updateDoc(doc(db, 'landlordVerifications', id), { status: 'approved' });
      await updateDoc(doc(db, 'landlords', landlordUid), { verified: true });
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'landlordVerifications', id), { status: 'rejected' });
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="verifications-container">
      <div style={{fontSize:'3rem',fontWeight:'bold',color:'#174ea6',marginBottom:'24px',textAlign:'center',letterSpacing:'2px'}}>Rent Easy</div>
      <h2>Landlord Verifications</h2>
      {requests.length === 0 ? (
        <div>No pending or unverified requests.</div>
      ) : (
        <>
          <div style={{margin:'16px 0',color:'#b00',fontWeight:600}}>
            {requests.some(r => typeof r.status !== 'string') && 'Warning: Some requests are missing a status field!'}
          </div>
          <table className="verifications-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} style={{background:r.status==='pending'?'#fffbe0':'#ffe0e0'}}>
                  <td>{r.landlordName}</td>
                  <td>{r.landlordEmail}</td>
                  <td>{r.referenceNumber}</td>
                  <td>{r.status === 'not submitted' ? 'Not Verified (No Request)' : r.status}</td>
                  <td>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(r.id, r.landlordUid)}>Approve</button>
                        <button onClick={() => handleReject(r.id)}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <pre style={{marginTop:20,background:'#f5f5f5',padding:10,fontSize:12}}>
            Raw requests: {JSON.stringify(requests, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default Verifications;
