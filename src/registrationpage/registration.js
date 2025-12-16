import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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
        gender: '',
        dateOfBirth: '',
        streetSitio: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
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
        gender: '',
        dateOfBirth: '',
        streetSitio: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        contactNumber: '',
        boardingHouseName: '',
        boardingHouseStreetSitio: '',
        boardingHouseBarangay: '',
        boardingHouseCityMunicipality: 'Isabela',
        boardingHouseProvince: 'Negros Occidental',
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
        // Basic validation
        if (!tenantFormData.email || !tenantFormData.password) {
            alert('Please provide email and password');
            return;
        }
        if (tenantFormData.password !== tenantFormData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Concatenate address parts
        const permanentAddress = `${tenantFormData.streetSitio}, ${tenantFormData.barangay}, ${tenantFormData.cityMunicipality}, ${tenantFormData.province}`.trim();

        (async () => {
            try {
                const userCred = await createUserWithEmailAndPassword(auth, tenantFormData.email, tenantFormData.password);
                const uid = userCred.user.uid;
                // Save profile to Firestore under tenants/{uid}
                await setDoc(doc(db, 'tenants', uid), {
                    firstName: tenantFormData.firstName,
                    middleName: tenantFormData.middleName,
                    lastName: tenantFormData.lastName,
                    civilStatus: tenantFormData.civilStatus,
                    gender: tenantFormData.gender,
                    dateOfBirth: tenantFormData.dateOfBirth,
                    permanentAddress: permanentAddress,
                    mobileNumber: tenantFormData.mobileNumber,
                    category: tenantFormData.category,
                    email: tenantFormData.email,
                    createdAt: new Date().toISOString(),
                    role: 'tenant'
                });

                setShowCheckmark(true);
                setTimeout(() => navigate('/tenant-home'), 1200);
            } catch (err) {
                console.error('Registration error (tenant):', err);
                alert(err.message || 'Registration failed');
            }
        })();
    };

    const handleLandlordSubmit = () => {
        // Basic validation
        if (!landlordFormData.email || !landlordFormData.password) {
            alert('Please provide email and password');
            return;
        }
        if (landlordFormData.password !== landlordFormData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Concatenate address parts
        const permanentAddress = `${landlordFormData.streetSitio}, ${landlordFormData.barangay}, ${landlordFormData.cityMunicipality}, ${landlordFormData.province}`.trim();
        const boardingHouseAddress = `${landlordFormData.boardingHouseStreetSitio}, ${landlordFormData.boardingHouseBarangay}, ${landlordFormData.boardingHouseCityMunicipality}, ${landlordFormData.boardingHouseProvince}`.trim();

        (async () => {
            try {
                const userCred = await createUserWithEmailAndPassword(auth, landlordFormData.email, landlordFormData.password);
                const uid = userCred.user.uid;
                // Save landlord profile to Firestore under landlords/{uid}
                await setDoc(doc(db, 'landlords', uid), {
                    firstName: landlordFormData.firstName,
                    middleName: landlordFormData.middleName,
                    lastName: landlordFormData.lastName,
                    civilStatus: landlordFormData.civilStatus,
                    gender: landlordFormData.gender,
                    dateOfBirth: landlordFormData.dateOfBirth,
                    permanentAddress: permanentAddress,
                    contactNumber: landlordFormData.contactNumber,
                    boardingHouseName: landlordFormData.boardingHouseName,
                    boardingHouseAddress: boardingHouseAddress,
                    email: landlordFormData.email,
                    createdAt: new Date().toISOString(),
                    role: 'landlord'
                });

                setShowCheckmark(true);
                setTimeout(() => navigate('/llhome'), 1200);
            } catch (err) {
                console.error('Registration error (landlord):', err);
                alert(err.message || 'Registration failed');
            }
        })();
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
                    <div className="form-content">
                        <div className="form-fields">
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
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                {/* Age removed per request - do not collect or compute age */}
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
                                <div className="form-group">
                                    <label className="form-label">Street/Sitio</label>
                                    <input
                                        type="text"
                                        name="streetSitio"
                                        className="form-input"
                                        placeholder="Enter street/sitio"
                                        value={tenantFormData.streetSitio}
                                        onChange={handleTenantInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Barangay</label>
                                    <input
                                        type="text"
                                        name="barangay"
                                        className="form-input"
                                        placeholder="Enter barangay"
                                        value={tenantFormData.barangay}
                                        onChange={handleTenantInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City/Municipality</label>
                                    <input
                                        type="text"
                                        name="cityMunicipality"
                                        className="form-input"
                                        placeholder="Enter city/municipality"
                                        value={tenantFormData.cityMunicipality}
                                        onChange={handleTenantInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        className="form-input"
                                        placeholder="Enter province"
                                        value={tenantFormData.province}
                                        onChange={handleTenantInputChange}
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                        autoComplete="new-password"
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
                                        autoComplete="new-password"
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
                        </div>

                        <div className="buttons-container">
                            <button type="button" onClick={handleTenantSubmit} className="submit-btn">Submit</button>
                        </div>
                    </div>
                </div>

                {/* Landlord Form */}
                <div className={`tab-content ${activeTab === 'landlord' ? 'active' : ''}`} id="landlord">
                    <div className="form-content">
                        <div className="form-fields">
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
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                {/* Age removed per request - do not collect or compute age */}
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
                                <div className="form-group">
                                    <label className="form-label">Street/Sitio</label>
                                    <input
                                        type="text"
                                        name="streetSitio"
                                        className="form-input"
                                        placeholder="Enter street/sitio"
                                        value={landlordFormData.streetSitio}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Barangay</label>
                                    <input
                                        type="text"
                                        name="barangay"
                                        className="form-input"
                                        placeholder="Enter barangay"
                                        value={landlordFormData.barangay}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City/Municipality</label>
                                    <input
                                        type="text"
                                        name="cityMunicipality"
                                        className="form-input"
                                        placeholder="Enter city/municipality"
                                        value={landlordFormData.cityMunicipality}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        className="form-input"
                                        placeholder="Enter province"
                                        value={landlordFormData.province}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <hr className="section-divider" />

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
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        className="form-input"
                                        placeholder="Enter mobile number"
                                        value={landlordFormData.contactNumber}
                                        onChange={handleLandlordInputChange}
                                        maxLength="11"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Street/Sitio</label>
                                    <input
                                        type="text"
                                        name="boardingHouseStreetSitio"
                                        className="form-input"
                                        placeholder="Enter street/sitio"
                                        value={landlordFormData.boardingHouseStreetSitio}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Barangay</label>
                                    <select
                                        name="boardingHouseBarangay"
                                        className="form-input"
                                        value={landlordFormData.boardingHouseBarangay}
                                        onChange={handleLandlordInputChange}
                                    >
                                        <option value="">Select barangay</option>
                                        <option value="Barangay 1">Barangay 1</option>
                                        <option value="Barangay 2">Barangay 2</option>
                                        <option value="Barangay 3">Barangay 3</option>
                                        <option value="Barangay 4">Barangay 4</option>
                                        <option value="Barangay 5">Barangay 5</option>
                                        <option value="Barangay 6">Barangay 6</option>
                                        <option value="Barangay 7">Barangay 7</option>
                                        <option value="Barangay 8">Barangay 8</option>
                                        <option value="Barangay 9">Barangay 9</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City/Municipality</label>
                                    <input
                                        type="text"
                                        name="boardingHouseCityMunicipality"
                                        className="form-input"
                                        placeholder="Enter city/municipality"
                                        value={landlordFormData.boardingHouseCityMunicipality}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Province</label>
                                    <input
                                        type="text"
                                        name="boardingHouseProvince"
                                        className="form-input"
                                        placeholder="Enter province"
                                        value={landlordFormData.boardingHouseProvince}
                                        onChange={handleLandlordInputChange}
                                        autoComplete="off"
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
                                        autoComplete="off"
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
                                        autoComplete="new-password"
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
                                        autoComplete="new-password"
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
                        </div>

                        <div className="buttons-container">
                            <button type="button" onClick={handleLandlordSubmit} className="submit-btn">Submit</button>
                        </div>
                    </div>
                </div>
                
                <button onClick={onBack} className="back-btn">← Back to Login</button>
            </div>
        </div>
    );
};

export default Registration;