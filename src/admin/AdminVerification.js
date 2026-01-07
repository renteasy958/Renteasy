import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const AdminVerification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'landlordVerifications'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(data);
        // Debug: log all documents
        console.log('[AdminVerification] All landlordVerifications:', data);
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
    <div>
      <h2>All Landlord Verifications (Debug Mode)</h2>
      {requests.length === 0 ? (
        <div>No requests found.</div>
      ) : (
        <table>
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
              <tr key={r.id}>
                <td>{r.landlordName}</td>
                <td>{r.landlordEmail}</td>
                <td>{r.referenceNumber}</td>
                <td>{r.status}</td>
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
      )}
      {/* Debug message removed as requested */}
    </div>
  );
};

export default AdminVerification;
