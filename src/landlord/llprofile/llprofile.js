import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './llprofile.css';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { uploadProfilePicture, uploadQRCode } from '../../services/cloudinaryService';

const LandlordProfile = () => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [llData, setLlData] = useState(null);
    const [isLandlord, setIsLandlord] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [qrUploading, setQrUploading] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ gcashName: '', gcashNumber: '', gcashRef: '', qrCode: '' });
    const fileInputRef = useRef(null);
    const qrInputRef = useRef(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) { setLlData(null); return; }
            try {
                const snap = await getDoc(doc(db, 'landlords', user.uid));
                if (snap.exists()) {
                    setLlData(snap.data());
                    setIsLandlord(true);
                    // Try to fetch payment info
                    try {
                        const paySnap = await getDoc(doc(db, 'landlords', user.uid, 'payment', 'info'));
                        if (paySnap.exists()) {
                            setPaymentForm(paySnap.data());
                        }
                    } catch (err) {
                        console.warn('No payment info found');
                    }
                } else {
                    setLlData({ email: user.email });
                    setIsLandlord(false);
                }
            } catch (err) {
                console.error('Error loading landlord profile:', err);
                setLlData({ email: user.email });
            }
        });
        return () => unsub();
    }, []);

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('en-US', options);
            } catch (error) {
                return dateString || 'N/A';
            }
        };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser) return;

        setUploading(true);
        try {
            // Upload to Cloudinary
            const imageUrl = await uploadProfilePicture(file, auth.currentUser.uid);
            
            // Save URL to Firestore
            await updateDoc(doc(db, 'landlords', auth.currentUser.uid), {
                profileImage: imageUrl
            });
            setLlData(prev => ({ ...prev, profileImage: imageUrl }));
        } catch (err) {
            console.error('Error updating profile image:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleQRCodeUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser) return;

        setQrUploading(true);
        try {
            // Upload to Cloudinary
            const qrUrl = await uploadQRCode(file, auth.currentUser.uid);
            setPaymentForm(prev => ({ ...prev, qrCode: qrUrl }));
        } catch (err) {
            console.error('Error uploading QR code:', err);
        } finally {
            setQrUploading(false);
        }
    };

    const handlePaymentFormChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePaymentInfo = async () => {
        if (!auth.currentUser) return;
        try {
            await setDoc(doc(db, 'landlords', auth.currentUser.uid, 'payment', 'info'), paymentForm);
            alert('Payment info saved successfully!');
        } catch (err) {
            console.error('Error saving payment info:', err);
            alert('Failed to save payment info');
        }
    };

    if (!llData) return <div className="ll-loading">Loading profile...</div>;

    return (
        <div className="ll-prof-container">
            <div className="ll-prof-sidebar">
                <div className="ll-prof-sidebar-content">
                    <div className="ll-prof-image-container" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative' }}>
                        <img src={imgError ? 'https://via.placeholder.com/150' : (llData.profileImage || 'https://via.placeholder.com/150')} alt="Profile" className="ll-prof-image" onError={() => setImgError(true)} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                            {uploading ? 'Uploading...' : 'Click to change'}
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfileImageUpload}
                            disabled={uploading}
                        />
                    </div>
                    <div className="ll-prof-name">{`${llData.firstName || ''} ${llData.lastName || ''}`.trim() || 'No Name'}</div>
                </div>
            </div>
            <div className="ll-prof-body">
                <div className="ll-prof-section-title">PERSONAL INFORMATION</div>
                <div className="ll-prof-info-grid">
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">First Name</div><div className="ll-prof-info-value">{llData.firstName || 'N/A'}</div></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Middle Name</div><div className="ll-prof-info-value">{llData.middleName || 'N/A'}</div></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Last Name</div><div className="ll-prof-info-value">{llData.lastName || 'N/A'}</div></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Civil Status</div><div className="ll-prof-info-value">{llData.civilStatus || 'N/A'}</div></div>
                    {/* Age removed per request */}
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Gender</div><div className="ll-prof-info-value">{llData.gender || 'N/A'}</div></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Date of Birth</div><div className="ll-prof-info-value">{formatDate(llData.dateOfBirth)}</div></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Mobile Number</div><div className="ll-prof-info-value">{llData.contactNumber || 'N/A'}</div></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">Email</div><div className="ll-prof-info-value">{auth.currentUser?.email || llData.email || 'N/A'}</div></div>
                    <div className="ll-prof-info-item ll-prof-address-value"><div className="ll-prof-info-label">Permanent Address</div><div className="ll-prof-info-value">{llData.permanentAddress || 'N/A'}</div></div>
                </div>
                <div className="ll-prof-emergency-section">
                    <div className="ll-prof-section-title">BOARDING HOUSE INFORMATION</div>
                    <div className="ll-prof-info-grid">
                        <div className="ll-prof-info-item"><div className="ll-prof-info-label">Boarding House Name</div><div className="ll-prof-info-value">{llData.boardingHouseName || 'N/A'}</div></div>
                        <div className="ll-prof-info-item"><div className="ll-prof-info-label">Landlord Contact Number</div><div className="ll-prof-info-value">{llData.contactNumber || 'N/A'}</div></div>
                        <div className="ll-prof-info-item ll-prof-address-value"><div className="ll-prof-info-label">Boarding House Address</div><div className="ll-prof-info-value">{llData.boardingHouseAddress || 'N/A'}</div></div>
                    </div>
                </div>
                {/* GCash Payment Section */}
                <div className="ll-prof-section-title" style={{ marginTop: 32 }}>GCash Payment Information</div>
                <div className="ll-prof-info-grid">
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">GCash Name</div><input type="text" name="gcashName" value={paymentForm.gcashName} onChange={handlePaymentFormChange} className="ll-prof-info-value" /></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">GCash Number</div><input type="text" name="gcashNumber" value={paymentForm.gcashNumber} onChange={handlePaymentFormChange} className="ll-prof-info-value" /></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">GCash Reference Number</div><input type="text" name="gcashRef" value={paymentForm.gcashRef} onChange={handlePaymentFormChange} className="ll-prof-info-value" /></div>
                    <div className="ll-prof-info-item"><div className="ll-prof-info-label">GCash QR Code</div>
                        <input ref={qrInputRef} type="file" accept="image/*" style={{ display: 'block' }} onChange={handleQRCodeUpload} disabled={qrUploading} />
                        {paymentForm.qrCode && <img src={paymentForm.qrCode} alt="GCash QR" style={{ maxWidth: 120, marginTop: 8 }} />}
                    </div>
                </div>
                <button style={{ marginTop: 16, padding: '8px 18px', background: '#174ea6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer', fontSize: 15 }} onClick={handleSavePaymentInfo}>Save Payment Info</button>
            </div>
        </div>
    );
};

export default LandlordProfile;