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
    const [uploading, setUploading] = useState(false);
    const [qrUploading, setQrUploading] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ gcashName: '', gcashNumber: '', qrCode: '' });
    const fileInputRef = useRef(null);
    const qrInputRef = useRef(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) { setLlData(null); return; }
            try {
                const snap = await getDoc(doc(db, 'landlords', user.uid));
                if (snap.exists()) {
                    setLlData(snap.data());
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
                <div className="ll-prof-payment-section" style={{ marginTop: '30px' }}>
                    <button onClick={() => setShowPaymentForm(!showPaymentForm)} style={{ padding: '10px 20px', backgroundColor: '#001f3f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {showPaymentForm ? 'Cancel' : 'Add/Edit Payment Info'}
                    </button>
                    {paymentForm?.gcashName && (
                        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                            <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>GCash Account: {paymentForm.gcashName}</p>
                            <p style={{ margin: '5px 0', fontSize: '14px' }}>GCash Number: {paymentForm.gcashNumber}</p>
                        </div>
                    )}
                </div>
                {showPaymentForm && (
                    <div className="ll-payment-form" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>GCash Account Name</label>
                            <input
                                type="text"
                                name="gcashName"
                                value={paymentForm.gcashName || ''}
                                onChange={handlePaymentFormChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                placeholder="e.g., Juan Dela Cruz"
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>GCash Number</label>
                            <input
                                type="text"
                                name="gcashNumber"
                                value={paymentForm.gcashNumber || ''}
                                onChange={handlePaymentFormChange}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                placeholder="e.g., 09123456789"
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>QR Code Image</label>
                            <div onClick={() => qrInputRef.current?.click()} style={{ padding: '20px', backgroundColor: 'white', border: '2px dashed #ddd', borderRadius: '4px', cursor: 'pointer', textAlign: 'center' }}>
                                {paymentForm.qrCode ? (
                                    <img src={paymentForm.qrCode} alt="QR Code" style={{ maxWidth: '220px', maxHeight: '300px' }} />
                                ) : (
                                    <span>{qrUploading ? 'Uploading...' : 'Click to upload QR code'}</span>
                                )}
                            </div>
                            <input 
                                ref={qrInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleQRCodeUpload}
                                disabled={qrUploading}
                            />
                        </div>
                        <button onClick={handleSavePaymentInfo} style={{ padding: '10px 20px', backgroundColor: '#001f3f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Save Payment Info
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandlordProfile;