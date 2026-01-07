import React, { useEffect, useState } from 'react';
import './Landlords.css';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const Landlords = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [allLandlords, setAllLandlords] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'landlords'));
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllLandlords(all);
        const verified = all.filter(l => l.verified === true);
        setLandlords(verified);
        // Debug: log all landlords and verified landlords
        console.log('[Landlords] All landlords:', all);
        console.log('[Landlords] Verified landlords:', verified);
      } catch (err) {
        setError('Failed to load landlords');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landlords-container">
      <h2>Landlords (Verified Only)</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && landlords.length === 0 && <div>No verified landlords found.</div>}
      {!loading && !error && (
        <>
          <div style={{margin:'16px 0',color:'#b00',fontWeight:600}}>
            {allLandlords.some(l => typeof l.verified !== 'boolean') && 'Warning: Some landlords are missing a boolean "verified" field!'}
          </div>
          <table className="landlords-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {allLandlords.map(l => (
                <tr key={l.id} style={{background:l.verified===true?'#e0ffe0':'#ffe0e0'}}>
                  <td>{l.firstName} {l.lastName}</td>
                  <td>{l.email}</td>
                  <td>{String(l.verified)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <pre style={{marginTop:20,background:'#f5f5f5',padding:10,fontSize:12}}>
            Raw landlords data: {JSON.stringify(allLandlords, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default Landlords;
