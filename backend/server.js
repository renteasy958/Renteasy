const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();


console.log('Starting server...');
const app = express();

// Send custom email endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing to, subject, or html' });
    }
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
let PORT = DEFAULT_PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter. Use a real SMTP transport when credentials
// are provided; otherwise fall back to a no-op logger for development.
let transporter;
console.log('Configuring transporter...');
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
console.log('Transporter configured.');

// Import SMS utility
console.log('Requiring sendSms...');
const sendSms = require('./sendSms');
console.log('sendSms loaded.');

// Send SMS endpoint (fix: move to top-level, not nested)
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing to or message' });
    }
    await sendSms(to, message);
    res.json({ message: 'SMS sent successfully' });
  } catch (err) {
    console.error('Error sending SMS:', err);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

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


// Reservation endpoint: receives tenant and reservation details, sends email to landlord
app.post('/reserve', async (req, res) => {
  try {
    const {
      tenant, // { name, address, contactNumber, age, status, birthdate, email }
      reservedHouses, // array of { name, address, ... }
      paymentReference,
      landlordEmail
    } = req.body;

    if (!tenant || !reservedHouses || !paymentReference || !landlordEmail) {
      return res.status(400).json({ error: 'Missing tenant, reservedHouses, paymentReference, or landlordEmail' });
    }

    // Format reserved houses list
    const housesHtml = reservedHouses.map((bh, i) =>
      `<li><b>${bh.name || 'Boarding House'}:</b> ${bh.address || ''}</li>`
    ).join('');

    // Format email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Reservation Received</h2>
        <p><b>Tenant Details:</b></p>
        <ul>
          <li><b>Name:</b> ${tenant.name || ''}</li>
          <li><b>Address:</b> ${tenant.address || ''}</li>
          <li><b>Contact Number:</b> ${tenant.contactNumber || ''}</li>
          <li><b>Age:</b> ${tenant.age || ''}</li>
          <li><b>Status:</b> ${tenant.status || ''}</li>
          <li><b>Birthdate:</b> ${tenant.birthdate || ''}</li>
          <li><b>Email:</b> ${tenant.email || ''}</li>
        </ul>
        <p><b>Reserved Boarding Houses:</b></p>
        <ul>${housesHtml}</ul>
        <p><b>Payment Reference Number:</b> <span style="color: #007bff; font-weight: bold;">${paymentReference}</span></p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: landlordEmail,
      subject: 'New Reservation - Tenant Details and Payment Reference',
      html
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reservation email sent to landlord.' });
  } catch (err) {
    console.error('Error sending reservation email:', err);
    res.status(500).json({ error: 'Failed to send reservation email' });
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



function tryListen(port, attempts = 0) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    PORT = port;
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attempts < 5) {
      const nextPort = port + 50;
      console.warn(`Port ${port} in use, trying port ${nextPort}...`);
      tryListen(nextPort, attempts + 1);
    } else if (err.code === 'EADDRINUSE') {
      console.error(`\nERROR: All attempted ports are in use.\n` +
        'Tip: Make sure no other instance of the backend is running, or change the PORT in your .env file.');
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

console.log('Before tryListen');
tryListen(PORT);
