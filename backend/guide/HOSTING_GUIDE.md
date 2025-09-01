# Games Realm Hosting Guide

## Environment Variables Setup

When hosting your Games Realm project, you need to set up environment variables for both Google OAuth and email OTP functionality. This guide explains how to configure these variables on different hosting platforms.

## Required Environment Variables

```
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=https://your-domain.com/login.html

# Email Configuration for OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Game OTP <your_email@gmail.com>"

# Server Configuration
PORT=8080  # Or the port provided by your hosting service
```

## Hosting on Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the variables listed above
4. Make sure to update the REDIRECT_URI to your Vercel domain
5. Deploy your project

## Hosting on Heroku

1. In your Heroku dashboard, go to your app's settings
2. Click on "Reveal Config Vars"
3. Add each of the variables listed above
4. Note: Heroku will provide a PORT automatically, so you don't need to set it

## Hosting on Netlify

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add each of the variables listed above
4. Update the REDIRECT_URI to your Netlify domain

## Email OTP Configuration

For the email OTP functionality to work in production:

1. Use a Gmail account
2. Generate an App Password:
   - Go to your Google Account > Security
   - Enable 2-Step Verification if not already enabled
   - Go to App passwords
   - Select "Mail" and "Other"
   - Enter a name (e.g., "Games Realm")
   - Copy the generated password and use it as EMAIL_PASS

## Google OAuth Configuration

For Google OAuth to work in production:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services > Credentials
4. Edit your OAuth 2.0 Client ID
5. Add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs
6. Save the changes

## Testing Your Deployment

After deploying, test both the Google OAuth login and OTP functionality to ensure they work correctly with your environment variables.

If you encounter any issues, check the server logs for error messages that might help identify the problem.