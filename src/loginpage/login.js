import React, { useState } from 'react';
import './login.css';
import Registration from '../registrationpage/registration';
import Home from '../homepage/home'; // Add this import

const Homepage = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [showRegistration, setShowRegistration] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotMobileNumber, setForgotMobileNumber] = useState('');
    const [forgotMobileError, setForgotMobileError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Add this state

    // Mobile number validation (11 digits only)
    const handleMobileChange = (e) => {
        // Remove non-numeric characters
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        // Limit to 11 digits
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        setMobileNumber(value);

        // Validate length
        if (value.length > 0 && value.length !== 11) {
            setMobileError('Mobile number must be exactly 11 digits');
        } else {
            setMobileError('');
        }
    };

    // Forgot password mobile number validation
    const handleForgotMobileChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        setForgotMobileNumber(value);

        // Clear error if user is typing
        if (forgotMobileError && value.length > 0) {
            setForgotMobileError('');
        }
    };

    // Validate forgot password mobile number
    const validateForgotMobile = () => {
        if (!forgotMobileNumber) {
            setForgotMobileError('Mobile number is required');
            return false;
        }

        if (forgotMobileNumber.length !== 11) {
            setForgotMobileError('Mobile number must be exactly 11 digits');
            return false;
        }

        if (!forgotMobileNumber.startsWith('09')) {
            setForgotMobileError('Please enter a valid mobile number (e.g., 09123456789)');
            return false;
        }

        setForgotMobileError('');
        return true;
    };

    // Password visibility toggle
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Form submission - UPDATED
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate mobile number
        if (mobileNumber.length !== 11) {
            setMobileError('Mobile number must be exactly 11 digits');
            return;
        }

        // Validate all fields
        if (!mobileNumber || !password || !userType) {
            alert('Please fill in all fields');
            return;
        }

        // Add your authentication logic here
        // For demo purposes, let's say any mobile number starting with '09' and password length > 5 is valid
        if (mobileNumber.startsWith('09') && password.length >= 6) {
            console.log('Login successful:', {
                mobileNumber: mobileNumber,
                userType: userType,
                rememberMe: rememberMe
            });
            
            // Redirect to home page
            setIsLoggedIn(true);
        } else {
            alert('Invalid credentials. Please check your mobile number and password.');
        }
    };

    // Forgot password form submission
    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();

        if (!validateForgotMobile()) {
            return;
        }

        setIsLoading(true);

        // Simulate OTP sending process
        setTimeout(() => {
            setIsLoading(false);
            alert('OTP sent successfully! Please check your messages.');
            console.log('OTP sent to:', forgotMobileNumber);
        }, 2000);
    };

    // Add this function to handle logout from home page
    const handleLogout = () => {
        setIsLoggedIn(false);
        setMobileNumber('');
        setPassword('');
        setUserType('');
        setRememberMe(false);
    };

    // If user is logged in, show Home component
    if (isLoggedIn) {
        return <Home onLogout={handleLogout} />;
    }

    return (
        <div className="container">
           
           <div className={`login-card ${showRegistration ? 'hidden' : ''}`}>
                {showForgotPassword ? (
                    // Forgot Password Form
                    <>
                        <h1 className="forgot-title">FORGOT PASSWORD?</h1>
                        <p className="forgot-subtitle">No worries, please enter your mobile number</p>
                        
                        <form onSubmit={handleForgotPasswordSubmit} className="login-form">
                            <div className="input-group">
                                <div className={`input-wrapper ${forgotMobileError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="tel" 
                                        placeholder="Mobile Number" 
                                        value={forgotMobileNumber}
                                        onChange={handleForgotMobileChange}
                                        maxLength="11" 
                                        required 
                                    />
                                </div>
                                {forgotMobileError && <div className="error-message">{forgotMobileError}</div>}
                            </div>
                            
                            <button type="submit" className="login-btn" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>

                        <div className="signup-link">
                            Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); }}>Back to Login</a>
                        </div>
                    </>
                ) : (
                    // Login Form
                    <>
                        <h1>Welcome back!</h1>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <div className={`input-wrapper ${mobileError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="tel" 
                                        placeholder="Mobile Number" 
                                        value={mobileNumber}
                                        onChange={handleMobileChange}
                                        maxLength="11" 
                                        required 
                                    />
                                </div>
                                {mobileError && <div className="error-message">{mobileError}</div>}
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper password-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                    <button type="button" className="eye-icon" onClick={togglePassword} onMouseDown={(e) => e.preventDefault()}>
                                        {showPassword ? (
                                            <svg className="eye-closed" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg className="eye-open" viewBox="0 0 24 24" fill="none">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="select-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <select 
                                        value={userType}
                                        onChange={(e) => setUserType(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Log in as</option>
                                        <option value="tenant">Tenant</option>
                                        <option value="landlord">Landlord</option>
                                    </select>
                                    <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none">
                                        <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>Forgot Password</a>
                            </div>

                            <button type="submit" className="login-btn">Log in</button>
                        </form>

                        <div className="signup-link">
                            New here? <a href="#" onClick={(e) => { e.preventDefault(); setShowRegistration(true); }}>Create an Account</a>
                        </div>
                    </>
                )}
            </div>
            {showRegistration && <Registration onBack={() => setShowRegistration(false)} />}
        </div>
    );
};

export default Homepage;