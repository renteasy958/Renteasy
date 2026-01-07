import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadProfilePicture } from '../../services/cloudinaryService';

const TenantProfile = () => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setUserData(null);
                return;
            }
            try {
                const snap = await getDoc(doc(db, 'tenants', user.uid));
                if (snap.exists()) setUserData(snap.data());
                else setUserData({ email: user.email });
            } catch (err) {
                console.error('Error loading tenant profile:', err);
                setUserData({ email: user.email });
            }
        });

        return () => unsub();
    }, []);

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser) return;

        setUploading(true);
        try {
            // Upload to Cloudinary
            const imageUrl = await uploadProfilePicture(file, auth.currentUser.uid);
            
            // Save URL to Firestore
            await updateDoc(doc(db, 'tenants', auth.currentUser.uid), {
                profileImage: imageUrl
            });
            setUserData(prev => ({ ...prev, profileImage: imageUrl }));
        } catch (err) {
            console.error('Error updating profile image:', err);
        } finally {
            setUploading(false);
        }
    };

    if (!userData) return <div className="prof-loading">Loading profile...</div>;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatCategory = (category) => {
        if (!category) return 'Not specified';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const fullName = `${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`.trim() || 'No Name';

    return (
        <div className="prof-container">
            <div className="prof-sidebar">
                <div className="prof-sidebar-content">
                    <div className="prof-image-container" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative' }}>
                        <img 
                            src={imgError ? 'https://via.placeholder.com/150' : (userData.profileImage || 'https://via.placeholder.com/150')} 
                            alt="Profile" 
                            className="prof-image"
                            onError={() => setImgError(true)}
                        />
                        <div className="prof-image-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
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
                    <div className="prof-name">{fullName}</div>
                    <div className="prof-category">{formatCategory(userData.category)}</div>
                </div>
            </div>

            <div className="prof-body">
                <div className="prof-section-title">PERSONAL INFORMATION</div>
                <div className="prof-info-grid">
                    <div className="prof-info-item">
                        <div className="prof-info-label">First Name</div>
                        <div className="prof-info-value">{userData.firstName || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Middle Name</div>
                        <div className="prof-info-value">{userData.middleName || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Last Name</div>
                        <div className="prof-info-value">{userData.lastName || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Civil Status</div>
                        <div className="prof-info-value">{userData.civilStatus || 'N/A'}</div>
                    </div>
                    {/* Age removed per request - do not display computed age */}
                    <div className="prof-info-item">
                        <div className="prof-info-label">Gender</div>
                        <div className="prof-info-value">{userData.gender || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Date of Birth</div>
                        <div className="prof-info-value">{formatDate(userData.dateOfBirth)}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Mobile Number</div>
                        <div className="prof-info-value">{userData.mobileNumber || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Email</div>
                        <div className="prof-info-value">{auth.currentUser?.email || userData.email || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item prof-address-value">
                        <div className="prof-info-label">Permanent Address</div>
                                                <div className="prof-info-value">{
                                                    userData.permanentAddress && typeof userData.permanentAddress === 'object' ?
                                                        [userData.permanentAddress.streetSitio, userData.permanentAddress.barangay, userData.permanentAddress.cityMunicipality, userData.permanentAddress.province].filter(Boolean).join(', ') :
                                                    userData.permanentAddress || 'N/A'
                                                }</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;