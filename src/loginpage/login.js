import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Registration from '../registrationpage/registration';

const Homepage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showRegistration, setShowRegistration] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    
    // Forgot password states
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotEmailError, setForgotEmailError] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotOtpError, setForgotOtpError] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Add login-page class to body when component mounts
    useEffect(() => {
        document.body.classList.add('login-page');
        
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    // Email validation
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    // Password validation
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (value && value.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else {
            setPasswordError('');
        }
    };

    // Forgot email validation
    const handleForgotEmailChange = (e) => {
        const value = e.target.value;
        setForgotEmail(value);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
            setForgotEmailError('Please enter a valid email address');
        } else {
            setForgotEmailError('');
        }
    };

    // OTP validation and verification
    const handleForgotOtpChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        setForgotOtp(value);

        // Verify OTP when 4 digits are entered
        if (value.length === 4) {
            // Simulate OTP verification - for demo, correct OTP is "1234"
            if (value === '1234') {
                setForgotOtpError('');
                setIsOtpVerified(true);
            } else {
                setForgotOtpError('Invalid OTP');
                setIsOtpVerified(false);
            }
        } else {
            setForgotOtpError('');
            setIsOtpVerified(false);
        }
    };

    // New password validation
    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);

        if (value && value.length < 6) {
            setNewPasswordError('Password must be at least 6 characters');
        } else {
            setNewPasswordError('');
        }

        // Check if it matches confirm password
        if (confirmPassword && value !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else if (confirmPassword) {
            setConfirmPasswordError('');
        }
    };

    // Confirm password validation
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (value && value !== newPassword) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    // Check if passwords match for submit button
    const isPasswordMatch = () => {
        return newPassword && 
               confirmPassword && 
               newPassword === confirmPassword && 
               newPassword.length >= 6 &&
               isOtpVerified;
    };

    // Send OTP to email
    const handleSendOtp = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!forgotEmail || !emailRegex.test(forgotEmail)) {
            setForgotEmailError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        
        // Simulate OTP sending
        setTimeout(() => {
            setIsLoading(false);
            alert('OTP sent to your email! (Demo OTP: 1234)');
            console.log('OTP sent to:', forgotEmail);
        }, 1500);
    };

    // Form submission for login
    const handleSubmit = (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        console.log('Login attempt:', {
            email: email,
            password: password
        });
        
        // Remove login-page class before redirecting
        document.body.classList.remove('login-page');
        
        // For demo purposes - redirect based on email domain or any logic
        // You can modify this logic as needed
        if (email.includes('landlord')) {
            navigate('/landlord-home');
        } else {
            navigate('/tenant-home');
        }
    };

    // Forgot password form submission
    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();

        if (!isPasswordMatch()) {
            return;
        }

        setIsLoading(true);

        // Simulate password reset
        setTimeout(() => {
            setIsLoading(false);
            alert('Password reset successful! Please login with your new password.');
            // Reset form and go back to login
            setShowForgotPassword(false);
            setForgotEmail('');
            setForgotOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setIsOtpVerified(false);
            console.log('Password reset for:', forgotEmail);
        }, 2000);
    };

    return (
        <div className="container">
           
           <div className={`login-card ${showRegistration ? 'hidden' : ''}`}>
                {showForgotPassword ? (
                    // Forgot Password Form
                    <>
                        <h1 className="forgot-title">FORGOT PASSWORD?</h1>
                        <p className="forgot-subtitle">Enter your email to reset your password</p>
                        
                        <form onSubmit={handleForgotPasswordSubmit} className="login-form">
                            <div className="input-group">
                                <div className={`input-wrapper ${forgotEmailError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="email" 
                                        placeholder="Email Address" 
                                        value={forgotEmail}
                                        onChange={handleForgotEmailChange}
                                        required 
                                    />
                                </div>
                                {forgotEmailError && <div className="error-message">{forgotEmailError}</div>}
                            </div>

                            <div className="input-group">
                                <div className={`input-wrapper otp-wrapper ${forgotOtpError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="text"
                                        placeholder="4-digit OTP" 
                                        value={forgotOtp}
                                        onChange={handleForgotOtpChange}
                                        maxLength="4"
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="send-otp-btn" 
                                        onClick={handleSendOtp}
                                        disabled={isLoading || !forgotEmail}
                                    >
                                        {isLoading ? 'Sending...' : 'Send OTP'}
                                    </button>
                                </div>
                                {forgotOtpError && <div className="error-message">{forgotOtpError}</div>}
                            </div>

                            <div className="input-group">
                                <div className={`input-wrapper ${newPasswordError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password" 
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        disabled={!isOtpVerified}
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="eye-icon-btn"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        disabled={!isOtpVerified}
                                    >
                                        {showNewPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {newPasswordError && <div className="error-message">{newPasswordError}</div>}
                            </div>

                            <div className="input-group">
                                <div className={`input-wrapper ${confirmPasswordError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password" 
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        disabled={!isOtpVerified}
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="eye-icon-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={!isOtpVerified}
                                    >
                                        {showConfirmPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="login-btn" 
                                disabled={!isPasswordMatch() || isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>

                        <div className="signup-link">
                            Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); }}>Back to Login</a>
                        </div>
                    </>
                ) : (
                    // Login Form
                    <>
                        <h1 className="welcome-title">Welcome back!</h1>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <div className={`input-wrapper ${emailError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type="email" 
                                        placeholder="Email Address" 
                                        value={email}
                                        onChange={handleEmailChange}
                                        required 
                                    />
                                </div>
                                {emailError && <div className="error-message">{emailError}</div>}
                            </div>

                            <div className="input-group">
                                <div className={`input-wrapper ${passwordError ? 'error' : ''}`}>
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="16" r="1" fill="currentColor"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password" 
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="eye-icon-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {passwordError && <div className="error-message">{passwordError}</div>}
                                <div className="forgot-password-link">
                                    <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>

                            <button type="submit" className="login-btn">Login</button>
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