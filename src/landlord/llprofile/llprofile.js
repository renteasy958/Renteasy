import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './llprofile.css';

const LandlordProfile = ({ landlordData, tenantData }) => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    // Default data matching the tenant registration form structure for landlord's tenant info
    const defaultTenantData = {
        profileImage: 'https://via.placeholder.com/150',
        firstName: '',
        middleName: '',
        lastName: '',
        civilStatus: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        permanentAddress: '',
        mobileNumber: '',
        email: ''
    };

    // Default landlord data
    const defaultLandlordData = {
        boardingHouseName: '',
        boardingHouseAddress: '',
        contactNumber: ''
    };

    // Use provided data or fall back to default
    const userData = tenantData || defaultTenantData;
    const llData = landlordData || defaultLandlordData;

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Helper function to capitalize category
   

    const fullName = `${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`.trim() || 'No Name';

    return (
        <div className="ll-prof-container">
            {/* Sidebar with profile image and name */}
            <div className="ll-prof-sidebar">
                <div className="ll-prof-sidebar-content">
                    <div className="ll-prof-image-container">
                        <img 
                            src={imgError ? 'https://via.placeholder.com/150' : (userData.profileImage || 'https://via.placeholder.com/150')} 
                            alt="Profile" 
                            className="ll-prof-image"
                            onError={() => setImgError(true)}
                        />
                    </div>
                    <div className="ll-prof-name">{fullName}</div>
                    
                </div>
            </div>

            {/* Main content area */}
            <div className="ll-prof-body">
                <div className="ll-prof-section-title">
                    PERSONAL INFORMATION
                </div>
                
                <div className="ll-prof-info-grid">
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">First Name</div>
                        <div className="ll-prof-info-value">{userData.firstName || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Middle Name</div>
                        <div className="ll-prof-info-value">{userData.middleName || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Last Name</div>
                        <div className="ll-prof-info-value">{userData.lastName || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Civil Status</div>
                        <div className="ll-prof-info-value">{userData.civilStatus || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Age</div>
                        <div className="ll-prof-info-value">{userData.age ? `${userData.age} years old` : 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Gender</div>
                        <div className="ll-prof-info-value">{userData.gender || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Date of Birth</div>
                        <div className="ll-prof-info-value">{formatDate(userData.dateOfBirth)}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Mobile Number</div>
                        <div className="ll-prof-info-value">{userData.mobileNumber || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item">
                        <div className="ll-prof-info-label">Email</div>
                        <div className="ll-prof-info-value">{userData.email || 'N/A'}</div>
                    </div>
                    <div className="ll-prof-info-item ll-prof-address-value">
                        <div className="ll-prof-info-label">Permanent Address</div>
                        <div className="ll-prof-info-value">{userData.permanentAddress || 'N/A'}</div>
                    </div>
                </div>

                <div className="ll-prof-emergency-section">
                    <div className="ll-prof-section-title">
                        BOARDING HOUSE INFORMATION
                    </div>
                    
                    <div className="ll-prof-info-grid">
                        <div className="ll-prof-info-item">
                            <div className="ll-prof-info-label">Boarding House Name</div>
                            <div className="ll-prof-info-value">{llData.boardingHouseName || 'N/A'}</div>
                        </div>
                        <div className="ll-prof-info-item">
                            <div className="ll-prof-info-label">Landlord Contact Number</div>
                            <div className="ll-prof-info-value">{llData.contactNumber || 'N/A'}</div>
                        </div>
                        <div className="ll-prof-info-item ll-prof-address-value">
                            <div className="ll-prof-info-label">Boarding House Address</div>
                            <div className="ll-prof-info-value">{llData.boardingHouseAddress || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordProfile;