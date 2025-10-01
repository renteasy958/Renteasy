import React, { useState } from 'react';
import './registration.css';

const Registration = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('tenant');
    
    // Separate form data for tenant and landlord
    const [tenantFormData, setTenantFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        civilStatus: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        permanentAddress: '',
        category: '',
        emergencyContact: {
            fullName: '',
            contactNo: '',
            address: ''
        }
    });

    const [landlordFormData, setLandlordFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        civilStatus: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        permanentAddress: '',
        contactNumber: '',
        boardingHouseName: '',
        boardingHouseAddress: ''
    });

    const handleTenantInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'emergency-contactNo') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
            setTenantFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    contactNo: digitsOnly
                }
            }));
        } else if (name.startsWith('emergency-')) {
            const fieldName = name.replace('emergency-', '');
            setTenantFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [fieldName]: value
                }
            }));
        } else {
            setTenantFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleLandlordInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'contactNumber') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
            setLandlordFormData(prev => ({
                ...prev,
                [name]: digitsOnly
            }));
        } else {
            setLandlordFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleTenantSubmit = () => {
        console.log('Tenant form submitted:', tenantFormData);
        alert('Tenant registration submitted successfully!');
    };

    const handleLandlordSubmit = () => {
        console.log('Landlord form submitted:', landlordFormData);
        alert('Landlord registration submitted successfully!');
    };

    const handleTabSwitch = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="registration-wrapper">
            <div className="form-container">
                <div className="tab-container">
                    <button 
                        className={`tab ${activeTab === 'tenant' ? 'active' : ''}`} 
                        onClick={() => handleTabSwitch('tenant')}
                    >
                        Tenant
                    </button>
                    <button 
                        className={`tab ${activeTab === 'landlord' ? 'active' : ''}`} 
                        onClick={() => handleTabSwitch('landlord')}
                    >
                        Landlord
                    </button>
                </div>

                {/* Tenant Form */}
                <div className={`tab-content ${activeTab === 'tenant' ? 'active' : ''}`} id="tenant">
                    <div onSubmit={handleTenantSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    className="form-input" 
                                    placeholder="Enter first name"
                                    value={tenantFormData.firstName}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Middle Name</label>
                                <input 
                                    type="text" 
                                    name="middleName"
                                    className="form-input" 
                                    placeholder="Enter middle name"
                                    value={tenantFormData.middleName}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    className="form-input" 
                                    placeholder="Enter last name"
                                    value={tenantFormData.lastName}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group civil-status-dropdown">
                                <label className="form-label">Civil Status</label>
                                <select 
                                    name="civilStatus"
                                    className="form-input"
                                    value={tenantFormData.civilStatus}
                                    onChange={handleTenantInputChange}
                                >
                                    <option value="">Select civil status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input 
                                    type="number" 
                                    name="age"
                                    className="form-input" 
                                    placeholder="Enter age"
                                    value={tenantFormData.age}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                            <div className="form-group gender-dropdown">
                                <label className="form-label">Gender</label>
                                <select 
                                    name="gender"
                                    className="form-input"
                                    value={tenantFormData.gender}
                                    onChange={handleTenantInputChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="form-group date-input">
                                <label className="form-label">Birthdate</label>
                                <input 
                                    type="date" 
                                    name="dateOfBirth"
                                    className="form-input" 
                                    placeholder="Birthdate"
                                    value={tenantFormData.dateOfBirth}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="form-label">Permanent Address</label>
                                <input 
                                    type="text" 
                                    name="permanentAddress"
                                    className="form-input" 
                                    placeholder="Enter permanent address"
                                    value={tenantFormData.permanentAddress}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                        </div>

                        <div className="checkbox-group">
                            <div className="checkbox-item">
                                <input 
                                    type="radio" 
                                    id="student"
                                    name="category"
                                    value="student"
                                    checked={tenantFormData.category === 'student'}
                                    onChange={handleTenantInputChange}
                                />
                                <label htmlFor="student">Student</label>
                            </div>
                            <div className="checkbox-item">
                                <input 
                                    type="radio" 
                                    id="professional"
                                    name="category"
                                    value="professional"
                                    checked={tenantFormData.category === 'professional'}
                                    onChange={handleTenantInputChange}
                                />
                                <label htmlFor="professional">Professional</label>
                            </div>
                            <div className="checkbox-item">
                                <input 
                                    type="radio" 
                                    id="others"
                                    name="category"
                                    value="others"
                                    checked={tenantFormData.category === 'others'}
                                    onChange={handleTenantInputChange}
                                />
                                <label htmlFor="others">Others</label>
                            </div>
                        </div>

                        <div className="person">Person to be contacted in case of emergency:</div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input 
                                    type="text" 
                                    name="emergency-fullName"
                                    className="form-input" 
                                    placeholder="Enter full name"
                                    value={tenantFormData.emergencyContact.fullName}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact No.</label>
                                <input 
                                    type="tel" 
                                    name="emergency-contactNo"
                                    className="form-input" 
                                    placeholder="Enter contact number"
                                    value={tenantFormData.emergencyContact.contactNo}
                                    onChange={handleTenantInputChange}
                                    maxLength="11"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="form-label">Address</label>
                                <input 
                                    type="text" 
                                    name="emergency-address"
                                    className="form-input" 
                                    placeholder="Enter address"
                                    value={tenantFormData.emergencyContact.address}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                        </div>

                        <button type="button" onClick={handleTenantSubmit} className="submit-btn">Submit</button>
                    </div>
                </div>

                {/* Landlord Form */}
                <div className={`tab-content ${activeTab === 'landlord' ? 'active' : ''}`} id="landlord">
                    <div onSubmit={handleLandlordSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    className="form-input" 
                                    placeholder="Enter first name"
                                    value={landlordFormData.firstName}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Middle Name</label>
                                <input 
                                    type="text" 
                                    name="middleName"
                                    className="form-input" 
                                    placeholder="Enter middle name"
                                    value={landlordFormData.middleName}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    className="form-input" 
                                    placeholder="Enter last name"
                                    value={landlordFormData.lastName}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group civil-status-dropdown">
                                <label className="form-label">Civil Status</label>
                                <select 
                                    name="civilStatus"
                                    className="form-input"
                                    value={landlordFormData.civilStatus}
                                    onChange={handleLandlordInputChange}
                                >
                                    <option value="">Select civil status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input 
                                    type="number" 
                                    name="age"
                                    className="form-input" 
                                    placeholder="Enter age"
                                    value={landlordFormData.age}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                            <div className="form-group gender-dropdown">
                                <label className="form-label">Gender</label>
                                <select 
                                    name="gender"
                                    className="form-input"
                                    value={landlordFormData.gender}
                                    onChange={handleLandlordInputChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="form-group date-input">
                                <label className="form-label">Birthdate</label>
                                <input 
                                    type="date" 
                                    name="dateOfBirth"
                                    className="form-input" 
                                    placeholder="Birthdate"
                                    value={landlordFormData.dateOfBirth}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="form-label">Permanent Address</label>
                                <input 
                                    type="text" 
                                    name="permanentAddress"
                                    className="form-input" 
                                    placeholder="Enter permanent address"
                                    value={landlordFormData.permanentAddress}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Contact Number</label>
                                <input 
                                    type="tel" 
                                    name="contactNumber"
                                    className="form-input" 
                                    placeholder="Enter contact number"
                                    value={landlordFormData.contactNumber}
                                    onChange={handleLandlordInputChange}
                                    maxLength="11"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="form-label">Name of Boarding House</label>
                                <input 
                                    type="text" 
                                    name="boardingHouseName"
                                    className="form-input" 
                                    placeholder="Enter boarding house name"
                                    value={landlordFormData.boardingHouseName}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="form-label">Address</label>
                                <input 
                                    type="text" 
                                    name="boardingHouseAddress"
                                    className="form-input" 
                                    placeholder="Enter boarding house address"
                                    value={landlordFormData.boardingHouseAddress}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                        </div>

                        <button type="button" onClick={handleLandlordSubmit} className="submit-btn">Submit</button>
                    </div>
                </div>
                
                <button onClick={onBack} className="back-btn">← Back to Login</button>
            </div>
        </div>
    );
};

export default Registration;