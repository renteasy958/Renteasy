const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter. Use a real SMTP transport when credentials
// are provided; otherwise fall back to a no-op logger for development.
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  transporter = {
    sendMail: async (mailOptions) => {
      // For development without credentials, just log the OTP instead
      console.log('Email credentials not configured. Skipping sendMail.');
      console.log('Mail preview:', mailOptions);
      return Promise.resolve();
    }
  };
}

// In-memory OTP store: Map<email, {otp, expires}>
const otpStore = new Map();

// OTP endpoint
app.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a 4-digit OTP (string)
    const otp = (Math.floor(1000 + Math.random() * 9000)).toString();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset OTP</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    // Send email (or log in development fallback)
    await transporter.sendMail(mailOptions);

    // Store OTP with expiration (10 minutes)
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    console.log(`OTP sent to ${email}: ${otp}`);
    // In development when email creds are not set, return the OTP in the response
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.json({ message: 'OTP sent successfully', debugOtp: otp });
    }

    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const entry = otpStore.get(email);
    if (!entry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (Date.now() > entry.expires) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (entry.otp !== String(otp)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid — invalidate it and respond success
    otpStore.delete(email);
    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
