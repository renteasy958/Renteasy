import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

const Registration = ({ onBack }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tenant');
    const [showCheckmark, setShowCheckmark] = useState(false);
    const [showTenantPassword, setShowTenantPassword] = useState(false);
    const [showTenantConfirmPassword, setShowTenantConfirmPassword] = useState(false);
    const [showLandlordPassword, setShowLandlordPassword] = useState(false);
    const [showLandlordConfirmPassword, setShowLandlordConfirmPassword] = useState(false);
    
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
        mobileNumber: '',
        category: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        boardingHouseAddress: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleTenantInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'mobileNumber') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
            setTenantFormData(prev => ({
                ...prev,
                [name]: digitsOnly
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
        setShowCheckmark(true);
        
        setTimeout(() => {
            navigate('/tenant-home');
        }, 1500);
    };

    const handleLandlordSubmit = () => {
        console.log('Landlord form submitted:', landlordFormData);
        setShowCheckmark(true);
        
        setTimeout(() => {
            navigate('/landlord-home');
        }, 1500);
    };

    const handleTabSwitch = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="registration-wrapper">
            {showCheckmark && (
                <div className="checkmark-overlay">
                    <div className="checkmark-container">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>
                </div>
            )}
            
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

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Mobile Number</label>
                                <input 
                                    type="tel" 
                                    name="mobileNumber"
                                    className="form-input" 
                                    placeholder="Enter mobile number"
                                    value={tenantFormData.mobileNumber}
                                    onChange={handleTenantInputChange}
                                    maxLength="11"
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

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    className="form-input" 
                                    placeholder="Enter email"
                                    value={tenantFormData.email}
                                    onChange={handleTenantInputChange}
                                />
                            </div>
                            <div className="form-group password-input">
                                <label className="form-label">Password</label>
                                <input 
                                    type={showTenantPassword ? "text" : "password"}
                                    name="password"
                                    className="form-input" 
                                    placeholder="Enter password"
                                    value={tenantFormData.password}
                                    onChange={handleTenantInputChange}
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowTenantPassword(!showTenantPassword)}
                                >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {showTenantPassword ? (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </>
                                        ) : (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </>
                                        )}
                                    </svg>
                                </span>
                            </div>
                            <div className="form-group password-input">
                                <label className="form-label">Confirm Password</label>
                                <input 
                                    type={showTenantConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className={`form-input ${tenantFormData.confirmPassword && tenantFormData.password !== tenantFormData.confirmPassword ? 'password-mismatch' : ''}`}
                                    placeholder="Confirm password"
                                    value={tenantFormData.confirmPassword}
                                    onChange={handleTenantInputChange}
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowTenantConfirmPassword(!showTenantConfirmPassword)}
                                >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {showTenantConfirmPassword ? (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </>
                                        ) : (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </>
                                        )}
                                    </svg>
                                </span>
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

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    className="form-input" 
                                    placeholder="Enter email"
                                    value={landlordFormData.email}
                                    onChange={handleLandlordInputChange}
                                />
                            </div>
                            <div className="form-group password-input">
                                <label className="form-label">Password</label>
                                <input 
                                    type={showLandlordPassword ? "text" : "password"}
                                    name="password"
                                    className="form-input" 
                                    placeholder="Enter password"
                                    value={landlordFormData.password}
                                    onChange={handleLandlordInputChange}
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowLandlordPassword(!showLandlordPassword)}
                                >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {showLandlordPassword ? (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </>
                                        ) : (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </>
                                        )}
                                    </svg>
                                </span>
                            </div>
                            <div className="form-group password-input">
                                <label className="form-label">Confirm Password</label>
                                <input 
                                    type={showLandlordConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className={`form-input ${landlordFormData.confirmPassword && landlordFormData.password !== landlordFormData.confirmPassword ? 'password-mismatch' : ''}`}
                                    placeholder="Confirm password"
                                    value={landlordFormData.confirmPassword}
                                    onChange={handleLandlordInputChange}
                                />
                                <span 
                                    className="password-toggle"
                                    onClick={() => setShowLandlordConfirmPassword(!showLandlordConfirmPassword)}
                                >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        {showLandlordConfirmPassword ? (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </>
                                        ) : (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </>
                                        )}
                                    </svg>
                                </span>
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