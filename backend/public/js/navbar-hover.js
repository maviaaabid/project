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
        // The page will reload, and the effect will be adjusted on load
        // No need to call adjustNavbarHoverEffect() here
      });
    });
  }
  
  // For select-based language switcher in other pages
  if (langSwitch) {
    langSwitch.addEventListener('change', function() {
      // The page will reload, and the effect will be adjusted on load
      // No need to call adjustNavbarHoverEffect() here
    });
  }
});

/**
 * Adjusts the navbar hover effect width and position based on text length
 * or hides it for non-English languages
 */
function adjustNavbarHoverEffect() {
  const navbarLinks = document.querySelectorAll('.navbar-menu a');
  const navbarSpans = document.querySelectorAll('.navbar-menu span');
  if (!navbarLinks || navbarLinks.length === 0) return;
  
  // Get the current language
  const currentLang = localStorage.getItem('site-lang') || 'en';
  
  // Apply language-specific class to body if not English
  if (currentLang !== 'en') {
    document.body.classList.add('lang-non-en');
    
    // Hide hover effect for non-English languages
    navbarSpans.forEach(span => {
      if (span) {
        span.style.display = 'none';
      }
    });
  } else {
    document.body.classList.remove('lang-non-en');
    
    // Show hover effect for English language
    navbarSpans.forEach((navbarSpan, spanIndex) => {
      if (navbarSpan) {
        navbarSpan.style.display = 'block';
        
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
  }
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