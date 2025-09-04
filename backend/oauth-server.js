const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs'); // Add fs for file operations
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
let otpCooldown = {}; // { email: timestamp } - to prevent multiple OTP sends
let otpRequestInProgress = {}; // { email: boolean } - to prevent concurrent requests

// OTP Endpoints
app.post('/send-otp', async (req, res) => {
  const { email, otp, context } = req.body; // Added context parameter
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  // Check if request is already in progress for this email
  if (otpRequestInProgress[email]) {
    return res.status(429).json({ 
      message: 'OTP request already in progress. Please wait.'
    });
  }

  // Mark request as in progress
  otpRequestInProgress[email] = true;

  try {
    // Check if OTP was recently sent (cooldown period of 60 seconds)
    const now = Date.now();
    const lastSent = otpCooldown[email];
    const cooldownTime = 60000; // 60 seconds
    
    if (lastSent && (now - lastSent) < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - (now - lastSent)) / 1000);
      return res.status(429).json({ 
        message: `Please wait ${remainingTime} seconds before requesting another OTP`,
        cooldownRemaining: remainingTime
      });
    }

    // Configure Gmail credentials using environment variables
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER || 'itxmaviaabid@gmail.com',
        pass: process.env.EMAIL_PASS || process.env.SMTP_PASS || 'vqzn vqlc qltk biba'
      }
    });

  try {
    // Create context-aware content
    const contextInfo = {
      login: {
        subject: '🎮 Your GAMES-REALM Login Code',
        title: 'Login Verification',
        description: 'Please use the following code to complete your login to GAMES-REALM.'
      },
      register: {
        subject: '🎮 Welcome to GAMES-REALM - Verify Your Account', 
        title: 'Account Verification',
        description: 'Welcome to GAMES-REALM! Please use the following code to complete your registration.'
      },
      forgot: {
        subject: '🔐 GAMES-REALM Password Reset Code',
        title: 'Password Reset',
        description: 'Please use the following code to reset your password for GAMES-REALM.'
      },
      settings: {
        subject: '🔧 GAMES-REALM Settings Update Code',
        title: 'Settings Verification',
        description: 'Please use the following code to confirm your account settings changes.'
      },
      default: {
        subject: '🎮 Your GAMES-REALM Verification Code',
        title: 'Verification Code', 
        description: 'Please use the following One-Time Password (OTP) to complete your verification.'
      }
    };
    
    const emailContext = contextInfo[context] || contextInfo.default;
    
    // Check logo file existence and prepare for attachment
    let logoPath = null;
    let logoExists = false;
    try {
      // Use the specific logo file you requested
      logoPath = path.join(__dirname, 'logo.png');
      
      console.log('Checking for GAMES-REALM logo at:', logoPath);
      logoExists = fs.existsSync(logoPath);
      console.log('Logo exists:', logoExists);
      
      if (logoExists) {
        console.log('✅ Using GAMES-REALM logo from:', logoPath);
      } else {
        console.log('❌ Logo file not found at:', logoPath);
      }
    } catch (logoErr) {
      console.log('Logo check error:', logoErr.message);
    }
    
    // Create branded HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code - GAMES-REALM</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%); padding: 40px 20px; text-align: center; }
            .logo { width: 100px; height: 100px; margin: 0 auto 20px; display: block; border-radius: 12px; border: 3px solid rgba(255,255,255,0.3); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
            .site-name { color: #fff; font-size: 28px; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
            .tagline { color: rgba(255,255,255,0.9); font-size: 14px; letter-spacing: 0.5px; }
            .content { padding: 40px 30px; text-align: center; }
            .title { color: #2d2d2d; font-size: 24px; font-weight: 600; margin-bottom: 16px; }
            .subtitle { color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px; }
            .otp-container { background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%); border: 2px dashed #7b2ff2; border-radius: 12px; padding: 30px 20px; margin: 30px 0; }
            .otp-label { color: #7b2ff2; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
            .otp-code { color: #2d2d2d; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .validity { color: #f357a8; font-size: 13px; margin-top: 15px; font-weight: 500; }
            .instructions { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: left; }
            .instructions h4 { color: #2d2d2d; font-size: 16px; margin-bottom: 10px; }
            .instructions ul { color: #666; font-size: 14px; line-height: 1.6; padding-left: 20px; }
            .instructions li { margin-bottom: 5px; }
            .warning { background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%); border-left: 4px solid #f357a8; padding: 15px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .warning-text { color: #d73527; font-size: 14px; font-weight: 500; }
            .footer { background: #2d2d2d; padding: 30px 20px; text-align: center; }
            .footer-text { color: #999; font-size: 12px; line-height: 1.5; margin-bottom: 15px; }
            .social-links { margin: 20px 0; }
            .social-links a { display: inline-block; margin: 0 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 50%; color: #fff; text-decoration: none; }
            .copyright { color: #666; font-size: 11px; border-top: 1px solid #444; padding-top: 15px; margin-top: 15px; }
            @media (max-width: 600px) {
                .email-container { margin: 10px; }
                .content { padding: 30px 20px; }
                .otp-code { font-size: 28px; letter-spacing: 4px; }
                .header { padding: 30px 15px; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header with Logo and Branding -->
            <div class="header">
                ${logoExists ? '<img src="cid:logo" alt="GAMES-REALM Logo" class="logo" />' : '<div class="logo" style="background: linear-gradient(135deg, #7b2ff2, #f357a8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">GR</div>'}
                <div class="site-name">GAMES-REALM</div>
                <div class="tagline">Your Ultimate Gaming Destination</div>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <h1 class="title">${emailContext.title}</h1>
                <p class="subtitle">${emailContext.description} This code is required to secure your account.</p>
                
                <!-- OTP Display -->
                <div class="otp-container">
                    <div class="otp-label">Your Verification Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="validity">⏰ Valid for 10 minutes only</div>
                </div>
                
                <!-- Instructions -->
                <div class="instructions">
                    <h4>🎮 How to use this code:</h4>
                    <ul>
                        <li>📝 Enter this 6-digit code in the verification field on GAMES-REALM</li>
                        <li>⏱️ Complete the process within 10 minutes</li>
                        <li>🔒 Do not share this code with anyone</li>
                        <li>⚠️ If you didn't request this code, please ignore this email</li>
                    </ul>
                </div>
                
                <!-- Security Warning -->
                <div class="warning">
                    <div class="warning-text">🔒 Security Note: Never share your OTP with anyone. GAMES-REALM will never ask for your password or OTP via email or phone.</div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-text">
                    This email was sent from GAMES-REALM security system.<br>
                    If you didn't request this verification, please ignore this email.
                </div>
                
                <div class="social-links">
                    <a href="#" title="Facebook">📘</a>
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="YouTube">📺</a>
                </div>
                
                <div class="copyright">
                    © 2024 GAMES-REALM. All rights reserved.<br>
                    This is an automated message, please do not reply to this email.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // Debug: Log the logo portion of HTML
    console.log('\n=== GAMES-REALM EMAIL LOGO DEBUG ===');
    console.log('Ἲe Logo exists:', logoExists);
    console.log('📁 Logo path:', logoPath);
    const logoHtml = logoExists ? '<img src="cid:logo" alt="GAMES-REALM Logo" class="logo" />' : '<div class="logo" style="background: linear-gradient(135deg, #7b2ff2, #f357a8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">GR</div>';
    console.log('🎨 Logo HTML will be:', logoHtml);
    console.log('===================================\n');

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"GAMES-REALM Security" <itxmaviaabid@gmail.com>',
      to: email,
      subject: emailContext.subject,
      text: `Your GAMES-REALM verification code is: ${otp}. This code is valid for 10 minutes. Please do not share this code with anyone.`,
      html: htmlTemplate
    };
    
    // Add logo attachment if it exists
    if (logoExists && logoPath) {
      mailOptions.attachments = [{
        filename: 'logo.png',
        path: logoPath,
        cid: 'logo' // Content-ID for embedding
      }];
      console.log('Added logo attachment:', logoPath);
    }

    // Send email with branded template
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to:', email, 'OTP:', otp);
    otpStore[email] = otp;
    otpCooldown[email] = now; // Set cooldown timestamp
    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.toString() });
  }
  } catch (outerErr) {
    console.error('Outer try block error:', outerErr);
    res.status(500).json({ message: 'Failed to process OTP request', error: outerErr.toString() });
  } finally {
    // Always clear the in-progress flag
    delete otpRequestInProgress[email];
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
