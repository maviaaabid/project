// This script syncs the theme across all pages

document.addEventListener('DOMContentLoaded', function() {
  // Check localStorage for theme preference
  const savedTheme = localStorage.getItem('theme');
  
  // If no theme is set in localStorage, set it to dark-theme by default
  if (!savedTheme) {
    localStorage.setItem('theme', 'dark-theme');
  }
  
  // Apply theme based on localStorage value
  if (savedTheme === 'light-theme') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
  }
});