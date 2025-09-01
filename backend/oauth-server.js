const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const path = require('path');
// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ 
    status: 'ok', 
    message: 'OAuth server is running',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      redirectUri: process.env.GOOGLE_OAUTH_CALLBACK_URL
    }
  });
});

// OTP Store and Users store
let otpStore = {}; // { email: otp }
let users = {}; // { email: { password: string } }

// OTP Endpoints
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  // Configure Gmail credentials using environment variables
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || process.env.SMTP_USER || 'itxmaviaabid@gmail.com',
      pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || 'vqzn vqlc qltk biba'
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Game OTP" <itxmaviaabid@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<b>Your OTP code is: ${otp}</b>`
    });
    console.log('OTP sent to:', email, 'OTP:', otp);
    otpStore[email] = otp;
    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.toString() });
  }
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }
  res.json({ success: false });
});

// Registration endpoint
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  if (users[email]) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  users[email] = { password };
  console.log('User registered:', email);
  res.json({ message: 'Registration successful' });
});

// Check email endpoint
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  if (users[email]) {
    return res.json({ registered: true });
  } else {
    return res.json({ registered: false });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users[email];
  if (!user) {
    return res.status(400).json({ message: 'Email not registered' });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  console.log('User logged in:', email);
  res.json({ message: 'Login successful' });
});

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_CALLBACK_URL || process.env.REDIRECT_URI;

console.log('Using redirect URI:', REDIRECT_URI);

// Exchange authorization code for access token
app.post('/api/google/token', async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }
    
    // Use client-provided redirect_uri if available, otherwise fall back to server config
    const finalRedirectUri = redirect_uri || REDIRECT_URI;
    
    console.log('Token exchange attempt with:', {
      codeLength: code.length,
      redirectUri: finalRedirectUri,
      clientId: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.substring(0, 8) + '...' : 'MISSING'
    });

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: finalRedirectUri,
      grant_type: 'authorization_code'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Token exchange successful');

    res.json(tokenResponse.data);
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    console.error('Full error object:', JSON.stringify(error.response?.data || {}, null, 2));
    console.error('Error stack:', error.stack);
    
    // Check if client_id or client_secret is missing or invalid
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Missing OAuth credentials - check environment variables');
      return res.status(500).json({
        error: 'OAuth server configuration error',
        details: 'Missing client credentials'
      });
    }
    
    // Check for specific error types
    if (error.response?.data?.error === 'invalid_grant') {
      console.error('Invalid grant error - code may be expired or already used');
      return res.status(400).json({
        error: 'Invalid or expired authorization code',
        details: error.response?.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to exchange token',
      details: error.response?.data || error.message 
    });
  }
});

// Get user info from Google
app.get('/api/google/userinfo', async (req, res) => {
  try {
    const { access_token } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    res.json(userResponse.data);
  } catch (error) {
    console.error('User info error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get user info',
      details: error.response?.data || error.message 
    });
  }
});

// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = 'Ov23lix5X6dUR29UIZHk';
const GITHUB_CLIENT_SECRET = 'b19cd25f0a2049becabe6103a6e9fc5e7a925a4a';

// Exchange GitHub code for access token
app.post('/api/github/token', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Authorization code is required' });

    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3001/login.html'
      },
      { headers: { Accept: 'application/json' } }
    );
    res.json(tokenRes.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to exchange token', details: err.response?.data || err.message });
  }
});

// Get user info from GitHub
app.get('/api/github/userinfo', async (req, res) => {
  try {
    const { access_token } = req.query;
    if (!access_token) return res.status(400).json({ error: 'Access token is required' });

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` }
    });
    res.json(userRes.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user info', details: err.response?.data || err.message });
  }
});



// Serve the login page
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
  console.log(`OAuth server running on http://localhost:${PORT}`);
  console.log('Make sure to:');
  console.log('1. Install dependencies: npm install express cors axios');
  console.log('2. Set up Google OAuth credentials in Google Cloud Console');
  console.log('3. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in this file');
  console.log('4. Add http://localhost:3001/login.html to authorized redirect URIs');
});
