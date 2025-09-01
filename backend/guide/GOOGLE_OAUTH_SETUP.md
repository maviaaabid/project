# Google OAuth Setup Guide for Games Realm

## 🚀 Complete Google OAuth Implementation

This guide will help you set up fully functional Google OAuth login for your Games Realm application.

## 📋 Prerequisites

1. **Node.js** (version 14 or higher)
2. **npm** or **yarn**
3. **Google Cloud Console** account

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 1.2 Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - **App name**: Games Realm
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes: `openid`, `email`, `profile`
5. Add test users (your email)

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set the following:
   - **Name**: Games Realm OAuth Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3001`
     - `http://localhost:3000`
   - **Authorized redirect URIs**:
     - `http://localhost:3001/login.html`
     - `http://localhost:3001/api/google/callback`

### 1.4 Copy Credentials
- Copy the **Client ID** and **Client Secret**
- You'll need these for the next steps

## 🔧 Step 2: Install Dependencies

```bash
npm install
```

## 🔧 Step 3: Configure the Application

### 3.1 Update OAuth Server Configuration
Edit `oauth-server.js` and replace:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
```

With your actual credentials:
```javascript
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'GOCSPX-your-actual-client-secret';
```

### 3.2 Update Frontend Configuration
Edit `js/login.js` and replace:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
```

With your actual Client ID:
```javascript
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
```

## 🚀 Step 4: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

## 🔧 Step 5: Test the Implementation

1. Open `http://localhost:3001/login.html`
2. Click "Continue with Google"
3. Complete the Google OAuth flow
4. You should be redirected back and logged in

## 🔒 Security Features

### ✅ Implemented Security Measures:
- **Backend Token Exchange**: Client secret never exposed to frontend
- **CORS Protection**: Configured for localhost only
- **Error Handling**: Graceful fallback to demo mode
- **Secure Redirects**: Proper OAuth 2.0 flow
- **Token Validation**: Server-side token verification

### 🔐 Production Security Checklist:
- [ ] Use HTTPS in production
- [ ] Store secrets in environment variables
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use secure session management
- [ ] Implement proper error logging

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid redirect_uri"**
   - Ensure redirect URI matches exactly in Google Console
   - Check for trailing slashes

2. **"Client ID not found"**
   - Verify Client ID is correct
   - Check if OAuth consent screen is configured

3. **"CORS error"**
   - Ensure server is running on port 3001
   - Check CORS configuration in oauth-server.js

4. **"Token exchange failed"**
   - Verify Client Secret is correct
   - Check if Google APIs are enabled

### Debug Mode:
Add this to see detailed error messages:
```javascript
// In oauth-server.js
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});
```

## 📱 Features Implemented

### ✅ OAuth 2.0 Flow:
- Authorization code flow
- Secure token exchange
- User profile retrieval
- Automatic account creation
- Profile completion flow

### ✅ User Experience:
- Loading states
- Error handling
- Fallback to demo mode
- Seamless integration with existing login system

### ✅ Security:
- Backend token exchange
- Secure redirect handling
- Error sanitization
- CORS protection

## 🔄 Production Deployment

### Environment Variables:
```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NODE_ENV=production
PORT=3001
```

### Update Redirect URIs:
- Add your production domain to Google Console
- Update `REDIRECT_URI` in oauth-server.js
- Update `GOOGLE_REDIRECT_URI` in login.js

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server console for errors
3. Verify Google Console configuration
4. Ensure all dependencies are installed

## 🎉 Success!

Once configured, users can:
- Click "Continue with Google"
- Complete Google OAuth flow
- Get automatically logged in
- Complete their profile
- Access all Games Realm features

The implementation includes both real OAuth flow and a demo fallback for testing purposes. 