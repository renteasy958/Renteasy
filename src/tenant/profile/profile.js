import React from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const TenantProfile = ({ tenantData }) => {
    const navigate = useNavigate();

    // Default data if no props are passed (for development/testing)
    const defaultData = {
        profileImage: 'https://via.placeholder.com/150',
        firstName: 'Juan',
        middleName: 'Santos',
        lastName: 'Dela Cruz',
        civilStatus: 'Single',
        age: '22',
        gender: 'Male',
        dateOfBirth: '2002-05-15',
        mobileNumber: '09123456789',
        permanentAddress: '123 Main Street, Cebu City, Philippines',
        category: 'student',
        emergencyContact: {
            fullName: 'Maria Dela Cruz',
            contactNo: '09123456789',
            address: '123 Main Street, Cebu City, Philippines'
        }
    };

    // Use provided data or fall back to default
    const userData = tenantData || defaultData;

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Edit profile handler
    const handleEditProfile = () => {
        // Navigate to edit profile page or show edit modal
        console.log('Edit profile clicked');
        // navigate('/edit-profile');
    };

    const fullName = `${userData.firstName} ${userData.middleName} ${userData.lastName}`;

    return (
        <div className="prof-container">
            {/* Sidebar with profile image and name */}
            <div className="prof-sidebar">
                <div className="prof-sidebar-content">
                    <div className="prof-image-container">
                        <img src={userData.profileImage} alt="Profile" className="prof-image" />
                    </div>
                    <div className="prof-name">{fullName}</div>
                    <div className="prof-category">{userData.category}</div>
                </div>
                <div className="prof-sidebar-bottom">
                    <button className="prof-edit-btn" onClick={handleEditProfile}>
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Main content area */}
            <div className="prof-body">
                <div className="prof-section-title">
                    <span className="prof-section-icon">👤</span>
                    Personal Information
                </div>
                
                <div className="prof-info-grid">
                    <div className="prof-info-item">
                        <div className="prof-info-label">First Name</div>
                        <div className="prof-info-value">{userData.firstName}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Middle Name</div>
                        <div className="prof-info-value">{userData.middleName}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Last Name</div>
                        <div className="prof-info-value">{userData.lastName}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Age</div>
                        <div className="prof-info-value">{userData.age} years old</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Gender</div>
                        <div className="prof-info-value">{userData.gender}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Civil Status</div>
                        <div className="prof-info-value">{userData.civilStatus}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Date of Birth</div>
                        <div className="prof-info-value">{formatDate(userData.dateOfBirth)}</div>
                    </div>
                    <div className="prof-info-item">
                        <div className="prof-info-label">Mobile Number</div>
                        <div className="prof-info-value">{userData.mobileNumber}</div>
                    </div>
                    <div className="prof-info-item prof-address-value">
                        <div className="prof-info-label">Permanent Address</div>
                        <div className="prof-info-value">{userData.permanentAddress}</div>
                    </div>
                </div>

                <div className="prof-emergency-section">
                    <div className="prof-section-title">
                        <span className="prof-section-icon">🚨</span>
                        Emergency Contact
                    </div>
                    
                    <div className="prof-info-grid">
                        <div className="prof-info-item">
                            <div className="prof-info-label">Full Name</div>
                            <div className="prof-info-value">{userData.emergencyContact.fullName}</div>
                        </div>
                        <div className="prof-info-item">
                            <div className="prof-info-label">Contact Number</div>
                            <div className="prof-info-value">{userData.emergencyContact.contactNo}</div>
                        </div>
                        <div className="prof-info-item prof-address-value">
                            <div className="prof-info-label">Address</div>
                            <div className="prof-info-value">{userData.emergencyContact.address}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;