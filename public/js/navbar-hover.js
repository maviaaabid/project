/**
 * Navbar Hover Effect Adjustment for Different Languages
 * This script automatically adjusts the hover effect width based on the text length
 * when the language is changed, or hides it for non-English languages.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initial setup
  adjustNavbarHoverEffect();
  
  // Listen for language changes
  const langBtn = document.getElementById('lang-btn');
  const langItems = document.querySelectorAll('.lang-list li');
  const langSwitch = document.getElementById('langSwitch');
  
  // For dropdown language selector in index.html
  if (langItems && langItems.length > 0) {
    langItems.forEach(function(item) {
      item.addEventListener('click', function() {
        // Get the selected language
        const selectedLang = this.getAttribute('data-lang');
        
        // Store in localStorage
        localStorage.setItem('site-lang', selectedLang);
        
        // Immediately adjust hover effect before page reload
        adjustNavbarHoverEffectForLang(selectedLang);
        
        // Small delay to show the effect, then reload
        setTimeout(() => {
          location.reload();
        }, 100);
      });
    });
  }
  
  // For select-based language switcher in other pages
  if (langSwitch) {
    langSwitch.addEventListener('change', function() {
      const selectedLang = this.value;
      localStorage.setItem('site-lang', selectedLang);
      adjustNavbarHoverEffectForLang(selectedLang);
      
      // Small delay to show the effect, then reload
      setTimeout(() => {
        location.reload();
      }, 100);
    });
  }
  
  // Listen for storage changes (if language is changed in another tab)
  window.addEventListener('storage', function(e) {
    if (e.key === 'site-lang') {
      adjustNavbarHoverEffect();
    }
  });
});

/**
 * Adjusts the navbar hover effect for a specific language
 * @param {string} lang - The language code (e.g., 'en', 'ur', 'hi')
 */
function adjustNavbarHoverEffectForLang(lang) {
  const navbarLinks = document.querySelectorAll('.navbar-menu a');
  const navbarSpans = document.querySelectorAll('.navbar-menu span');
  if (!navbarLinks || navbarLinks.length === 0) return;
  
  // Apply language-specific class to body if not English
  if (lang !== 'en') {
    document.body.classList.add('lang-non-en');
    
    // Hide hover effect for non-English languages
    navbarSpans.forEach(span => {
      if (span) {
        span.style.display = 'none';
        span.style.opacity = '0';
        span.style.transform = 'scale(0)';
      }
    });
    
    // Add transition for smooth effect
    navbarLinks.forEach(link => {
      link.style.transition = 'all 0.3s ease';
    });
    
    // Show notification that hover effects are disabled
    showLanguageNotification('Navbar hover effects disabled for non-English language', 'info');
  } else {
    document.body.classList.remove('lang-non-en');
    
    // Show hover effect for English language with animation
    navbarSpans.forEach((navbarSpan, spanIndex) => {
      if (navbarSpan) {
        navbarSpan.style.display = 'block';
        navbarSpan.style.opacity = '1';
        navbarSpan.style.transform = 'scale(1)';
        navbarSpan.style.transition = 'all 0.3s ease';
        
        // Calculate and set hover effect widths based on text content
        navbarLinks.forEach((link, index) => {
          // Get text width (approximate calculation)
          const textWidth = link.textContent.length * 0.6; // em units
          
          // Set custom data attribute for width
          link.setAttribute('data-hover-width', `${Math.max(5, textWidth)}vw`);
          
          // Create custom CSS for each link's hover effect
          updateHoverEffectCSS(index + 1, link);
        });
      }
    });
    
    // Show notification that hover effects are enabled
    showLanguageNotification('Navbar hover effects enabled', 'success');
  }
}

/**
 * Shows a notification about navbar language changes
 * @param {string} message - The notification message
 * @param {string} type - The notification type ('success', 'info', 'warning')
 */
function showLanguageNotification(message, type = 'info') {
  // Remove any existing notification
  const existing = document.getElementById('navbar-lang-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'navbar-lang-notification';
  notification.className = `navbar-lang-notification ${type}`;
  
  const colors = {
    success: 'linear-gradient(135deg, #00C851, #007E33)',
    info: 'linear-gradient(135deg, #33b5e5, #0099CC)', 
    warning: 'linear-gradient(135deg, #ffbb33, #FF8800)'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-triangle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    z-index: 1300;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add CSS for notification content
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .navbar-lang-notification .notification-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .navbar-lang-notification .notification-content i {
    font-size: 14px;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    .navbar-lang-notification {
      top: 60px;
      right: 10px;
      font-size: 12px;
      padding: 10px 16px;
      max-width: 250px;
    }
  }
`;
document.head.appendChild(notificationStyles);

/**
 * Adjusts the navbar hover effect width and position based on text length
 * or hides it for non-English languages
 */
function adjustNavbarHoverEffect() {
  const currentLang = localStorage.getItem('site-lang') || 'en';
  adjustNavbarHoverEffectForLang(currentLang);
}

/**
 * Updates the CSS for a specific navbar link's hover effect
 * @param {number} index - The 1-based index of the navbar link
 * @param {Element} link - The navbar link element
 */
function updateHoverEffectCSS(index, link) {
  // Get previous links to calculate position
  const prevLinks = Array.from(document.querySelectorAll('.navbar-menu a')).slice(0, index - 1);
  
  // Calculate left position based on previous links' widths
  let leftPosition = 3.8; // Default starting position (matches the original CSS)
  
  prevLinks.forEach((prevLink, i) => {
    const prevWidth = parseFloat(prevLink.getAttribute('data-hover-width') || '6.5');
    const gap = i === 0 ? 5 : 6; // Gap between items
    leftPosition += prevWidth + gap;
  });
  
  // Get the width for this link
  const width = parseFloat(link.getAttribute('data-hover-width') || '6.5');
  
  // Create or update the style element
  let styleEl = document.getElementById(`navbar-hover-style-${index}`);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = `navbar-hover-style-${index}`;
    document.head.appendChild(styleEl);
  }
  
  // Set the CSS
  styleEl.textContent = `
    .navbar-menu a:nth-child(${index}):hover~span {
      left: ${leftPosition}vw;
      width: ${width}vw;
    }
  `;
}
