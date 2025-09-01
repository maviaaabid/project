# Vercel Deployment Guide for Games Realm

This guide explains how to set up your Games Realm project on Vercel with proper environment variable configuration.

## 🚀 Quick Setup

### 1. Deploy to Vercel

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project" or "New Project"
   - Select your GitHub repository
   - Choose the `backend` folder as the root directory

2. **Configure Build Settings:**
   - Framework Preset: `Other`
   - Root Directory: `backend`
   - Build Command: (leave empty or use `npm install`)
   - Output Directory: (leave empty)

### 2. Environment Variables Setup

In your Vercel Dashboard → Project Settings → Environment Variables, add the following:

#### Required Environment Variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=522632399270-girk71r0ofjk7ci2mrh9fbc9hblaeiku.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_OAUTH_CALLBACK_URL=https://your-domain.vercel.app/login.html

# Application Configuration
NODE_ENV=production
BASE_URL=https://your-domain.vercel.app

# Email Configuration for OTP
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password_here

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=Ov23lix5X6dUR29UIZHk
GITHUB_CLIENT_SECRET=your_github_secret_here
GITHUB_REDIRECT_URI=https://your-domain.vercel.app/login.html
```

#### Important Notes:

1. **Replace `your-domain.vercel.app`** with your actual Vercel domain
2. **Get your Google Client Secret** from [Google Cloud Console](https://console.cloud.google.com/)
3. **Generate Gmail App Password** for SMTP (see guide below)

### 3. Google Cloud Console Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project** (or create a new one)
3. **Enable Google+ API:**
   - Go to APIs & Services → Library
   - Search for "Google+ API" and enable it
4. **Update OAuth Settings:**
   - Go to APIs & Services → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add authorized origins:
     - `https://your-domain.vercel.app`
   - Add authorized redirect URIs:
     - `https://your-domain.vercel.app/login.html`

### 4. Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `SMTP_PASS` environment variable

## 🔧 Deployment Process

### Step 1: Update Your Code
Your code is already updated to use environment variables automatically.

### Step 2: Deploy
```bash
# Push your changes to GitHub
git add .
git commit -m "Update for Vercel deployment with environment variables"
git push origin main

# Vercel will automatically deploy
```

### Step 3: Set Environment Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the variables listed above
5. Redeploy your project

### Step 4: Update OAuth Settings
Update your Google OAuth settings with the new Vercel URL.

## 🚨 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error:**
   - Make sure your Vercel URL is added to Google Cloud Console authorized redirect URIs
   - Check that `GOOGLE_OAUTH_CALLBACK_URL` matches exactly

2. **CORS errors:**
   - Environment variables are properly configured to handle production CORS

3. **OTP emails not sending:**
   - Verify `SMTP_USER` and `SMTP_PASS` are correct
   - Ensure you're using an App Password, not your regular Gmail password

4. **Environment variables not working:**
   - Check variable names are exactly as specified (case-sensitive)
   - Redeploy after adding/changing environment variables

### Debug Steps:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions tab
   - Click on your function to see logs

2. **Test API Endpoints:**
   ```bash
   # Test if server is running
   curl https://your-domain.vercel.app/api/test
   
   # Should return: {"status":"ok","message":"OAuth server is running"}
   ```

## 🔐 Security Best Practices

1. **Never commit secrets to git**
2. **Use different OAuth credentials for production**
3. **Regularly rotate API keys and secrets**
4. **Monitor Vercel function logs for security issues**

## 📝 Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID | `123...@apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Client Secret | `GOCSPX-...` |
| `GOOGLE_OAUTH_CALLBACK_URL` | Yes | OAuth redirect URL | `https://yoursite.vercel.app/login.html` |
| `NODE_ENV` | Yes | Environment mode | `production` |
| `BASE_URL` | Yes | Your site base URL | `https://yoursite.vercel.app` |
| `SMTP_USER` | Yes | Gmail for OTP | `your@gmail.com` |
| `SMTP_PASS` | Yes | Gmail App Password | `abcd efgh ijkl mnop` |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth ID | `Ov23...` |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth Secret | `your_secret` |

## 🌐 Testing Your Deployment

1. **Visit your Vercel URL**
2. **Try Google OAuth login**
3. **Test OTP functionality**
4. **Verify all features work as expected**

Your Games Realm should now work perfectly on Vercel with proper OAuth callback handling!

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Ensure OAuth settings are updated in Google Cloud Console
4. Test API endpoints manually