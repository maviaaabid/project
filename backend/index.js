const express = require('express');
const cors = require('cors');
const axios = require('axios');
// Load environment variables
require('dotenv').config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static('c:\\Users\\MaviaAbid\\OneDrive\\Documents\\code\\game\\backend\\public'));

// Example endpoint
app.get('/api/some-endpoint', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Example games endpoint
app.get('/api/games', (req, res) => {
  res.json([
    { name: 'ForzaMotorspot' },
    { name: 'GTA-V' },
    { name: 'PalWorld' }
  ]);
});

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// NOTE: OAuth endpoints are now handled by oauth-server.js
// This endpoint is commented out to avoid conflicts
/*
app.post('/api/google/token', async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'Authorization code is required' });

  console.log('Received authorization code (first 10 chars):', code.substring(0, 10) + '...');

  try {
    console.log('Attempting to exchange code for token...');
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('Token exchange successful');
    res.json(tokenRes.data);
*/
/*
  } catch (err) {
    console.error('Token exchange error:', err.message);
    console.error('Response data:', err.response?.data);
*/
    
/*
    // Provide more detailed error information
    const errorDetails = {
      error: 'Failed to exchange token',
      message: err.message,
      response_data: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText
    };
    
    console.error('Error details:', JSON.stringify(errorDetails, null, 2));
    res.status(500).json(errorDetails);
  }
});
*/

// NOTE: OAuth endpoints are now handled by oauth-server.js
// This endpoint is commented out to avoid conflicts
/*
// Google User Info endpoint
app.get('/api/google/userinfo', async (req, res) => {
  const accessToken = req.query.access_token;
  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    console.log('Fetching Google user info with token:', accessToken.substring(0, 10) + '...');
    
    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    // Process and validate the user data
    const userData = userInfoRes.data;
    console.log('Google user data received:', userData);
    
    // Ensure we have the required fields
    if (!userData.email) {
      console.warn('Google user data missing email');
      // Return error instead of generating random email
      return res.status(400).json({ error: 'Email information missing from Google account. Please ensure your Google account has a valid email.' });
    }
*/
    
/*
    if (!userData.name && userData.given_name) {
      userData.name = userData.given_name + (userData.family_name ? ' ' + userData.family_name : '');
    } else if (!userData.name) {
      console.warn('Google user data missing name');
      // Return error instead of using random name
      return res.status(400).json({ error: 'Name information missing from Google account. Please ensure your Google account has a name set.' });
    }
    
    if (!userData.sub && !userData.id) {
      console.warn('Google user data missing ID');
      userData.sub = '123456789';
    }
    
    // Return the processed user profile data
    res.json(userData);
  } catch (err) {
    console.error('Error fetching user info:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch user info', details: err.response?.data || err.message });
  }
});
*/

// Test endpoint for checking if server is running
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});