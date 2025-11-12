import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const TenantProfile = ({ tenantData }) => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);

    // Default data matching the registration form structure
    const defaultData = {
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
        category: '',
        email: ''
    };

    // Use provided data or fall back to default
    const userData = tenantData || defaultData;

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
    const formatCategory = (category) => {
        if (!category) return 'Not specified';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    // Edit profile handler
    const handleEditProfile = () => {
        console.log('Edit profile clicked');
        // navigate('/edit-profile');
    };

    const fullName = `${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`.trim() || 'No Name';

    return (
        <div className="prof-container">
            {/* Sidebar with profile image and name */}
            <div className="prof-sidebar">
                <div className="prof-sidebar-content">
                    <div className="prof-image-container">
                        <img 
                            src={imgError ? 'https://via.placeholder.com/150' : (userData.profileImage || 'https://via.placeholder.com/150')} 
                            alt="Profile" 
                            className="prof-image"
                            onError={() => setImgError(true)}
                        />
                    </div>
                    <div className="prof-name">{fullName}</div>
                    <div className="prof-category">{formatCategory(userData.category)}</div>
                </div>
            </div>

            {/* Main content area */}
            <div className="prof-body">
                <div className="prof-section-title">
                    PERSONAL INFORMATION
                </div>
                
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
                    <div className="prof-info-item">
                        <div className="prof-info-label">Age</div>
                        <div className="prof-info-value">{userData.age ? `${userData.age} years old` : 'N/A'}</div>
                    </div>
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
                        <div className="prof-info-value">{userData.email || 'N/A'}</div>
                    </div>
                    <div className="prof-info-item prof-address-value">
                        <div className="prof-info-label">Permanent Address</div>
                        <div className="prof-info-value">{userData.permanentAddress || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;