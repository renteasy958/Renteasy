import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Registration from '../registrationpage/registration';

const Homepage = () => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [userType, setUserType] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [showRegistration, setShowRegistration] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotMobileNumber, setForgotMobileNumber] = useState('');
    const [forgotMobileError, setForgotMobileError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Add login-page class to body when component mounts
    useEffect(() => {
        document.body.classList.add('login-page');
        
        // Cleanup: remove class when component unmounts
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    // Countdown timer effect
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

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

    // OTP input validation (4 digits only)
    const handleOtpChange = (e) => {
        // Remove non-numeric characters
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        // Limit to 4 digits
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        setOtp(value);

        // Validate length
        if (value.length > 0 && value.length !== 4) {
            setOtpError('OTP must be exactly 4 digits');
        } else {
            setOtpError('');
        }
    };

    // Send OTP function
    const handleSendOtp = () => {
        // Validate mobile number first
        if (mobileNumber.length !== 11) {
            setMobileError('Mobile number must be exactly 11 digits');
            return;
        }

        if (!mobileNumber.startsWith('09')) {
            setMobileError('Please enter a valid mobile number (e.g., 09123456789)');
            return;
        }

        setIsLoading(true);
        
        // Simulate OTP sending
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            setCountdown(60);
            console.log('OTP sent to:', mobileNumber);
        }, 2000);
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

    // Form submission - UPDATED for OTP
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate mobile number
        if (mobileNumber.length !== 11) {
            setMobileError('Mobile number must be exactly 11 digits');
            return;
        }

        // Validate OTP
        if (otp.length !== 4) {
            setOtpError('OTP must be exactly 4 digits');
            return;
        }

        // Validate all fields
        if (!mobileNumber || !otp || !userType) {
            alert('Please fill in all fields');
            return;
        }

        // Validate that OTP was sent
        if (!otpSent) {
            alert('Please send OTP first');
            return;
        }

        // Add your OTP verification logic here
        // For demo purposes, let's say any 4-digit OTP is valid
        if (mobileNumber.startsWith('09') && otp.length === 4) {
            console.log('Verification successful:', {
                mobileNumber: mobileNumber,
                otp: otp,
                userType: userType
            });
            
            // Remove login-page class before redirecting
            document.body.classList.remove('login-page');
            
            // Redirect based on user type using React Router
            if (userType === 'landlord') {
                navigate('/landlord-home');
            } else if (userType === 'tenant') {
                navigate('/tenant-home');
            }
        } else {
            alert('Invalid OTP or mobile number. Please try again.');
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
                                <div className={`input-wrapper otp-wrapper ${otpError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="text"
                                        placeholder="4-digit OTP" 
                                        value={otp}
                                        onChange={handleOtpChange}
                                        maxLength="4"
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="send-otp-btn" 
                                        onClick={handleSendOtp}
                                        disabled={isLoading || countdown > 0 || mobileNumber.length !== 11}
                                    >
                                        {isLoading ? 'Sending...' : 
                                         countdown > 0 ? `${countdown}s` : 'Send OTP'}
                                    </button>
                                </div>
                                {otpError && <div className="error-message">{otpError}</div>}
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

                            <button type="submit" className="login-btn">Verify</button>
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