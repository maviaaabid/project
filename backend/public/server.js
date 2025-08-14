const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname, '.')));

let otpStore = {}; // { email: otp }
let users = {}; // { email: { password: string } }

app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

  // Configure Gmail credentials using environment variables
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'itxmaviaabid@gmail.com',
      pass: process.env.EMAIL_PASS || 'vqzn vqlc qltk biba' // Fallback to hardcoded value if env var not set
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

// New endpoint for registration
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

// New endpoint to check if email is registered
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  if (users[email]) {
    return res.json({ registered: true });
  } else {
    return res.json({ registered: false });
  }
}); 
// New endpoint for login
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


app.listen(3000, () => console.log('OTP server running on port 3000'));
