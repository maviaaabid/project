// Frontend Configuration
// This file provides configuration for the frontend to work with different environments

window.CONFIG = {
  // Get configuration from environment or fallback to defaults
  getBaseUrl: function() {
    // Check if we're on Vercel (production)
    if (window.location.hostname.includes('.vercel.app')) {
      return window.location.origin;
    }
    // Local development
    return window.location.origin;
  },
  
  getApiUrl: function() {
    return this.getBaseUrl();
  },
  
  getOtpApiUrl: function() {
    // For now, OTP API is part of the same server
    // In production, this might be a different service
    return this.getBaseUrl();
  },
  
  getGoogleRedirectUri: function() {
    return `${this.getBaseUrl()}/login.html`;
  },
  
  getGitHubRedirectUri: function() {
    return `${this.getBaseUrl()}/login.html`;
  },
  
  // Google OAuth Client ID (this can be hardcoded as it's public)
  GOOGLE_CLIENT_ID: '522632399270-girk71r0ofjk7ci2mrh9fbc9hblaeiku.apps.googleusercontent.com',
  
  // GitHub Client ID (this can be hardcoded as it's public)
  GITHUB_CLIENT_ID: 'Ov23lix5X6dUR29UIZHk'
};