// Category filter functionality
// Helper function to get current responsive transform scale (from search.js)
function getCurrentResponsiveScale() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 350) return 'scale(0.7)';
  if (screenWidth <= 379) return 'scale(0.75)';
  if (screenWidth <= 410) return 'scale(0.85)';
  if (screenWidth <= 436) return 'scale(0.8)';
  if (screenWidth <= 448) return 'scale(0.8)'; // Added 448px breakpoint
  if (screenWidth <= 450) return 'scale(0.85)';
  return ''; // No scale for larger screens
}

// Helper function to preserve responsive sizes (from search.js)
function preserveResponsiveSizes(box) {
  const responsiveScale = getCurrentResponsiveScale();
  if (responsiveScale) {
    box.style.transform = responsiveScale;
  } else {
    box.style.transform = '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // Add data-category attributes to all game boxes based on their type
    const gameBoxes = document.querySelectorAll('.box, .box-1, .box-2, .box-3, .box-4, .box-5, .box-6, .box-7, .box-8, .box-9, .box-10, .box-11, .box-12, .box-13, .box-14, .box-15, .game-card');
    
    // Add smooth transitions to all game boxes
    gameBoxes.forEach(box => {
        box.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    // Add window resize listener to maintain responsive sizes during category filtering
    window.addEventListener('resize', function() {
        // Only apply responsive sizing to visible boxes during category filtering
        gameBoxes.forEach(box => {
            if (box.style.display !== 'none') {
                preserveResponsiveSizes(box);
            }
        });
    });
    
    console.log(`Found ${gameBoxes.length} game boxes to categorize`);
    
    // Initialize all boxes as visible
    gameBoxes.forEach(box => {
        // Get the category from the type element
        const typeElement = box.querySelector('.type p, .type-2 p, .type-3 p, .type-4 p, .type-5 p, .type-6 p, .type-7 p, .type-8 p, .type-9 p, .type-10 p, .type-11 p, .type-12 p, .type-13 p, .type-14 p, .type-15 p');
        if (typeElement) {
            // Get the text content and normalize it (remove spaces, make lowercase)
            let category = typeElement.textContent.trim();
            
            // Handle special cases like "OpenWorld" vs "Open World"
            if (category.toLowerCase().includes('open') && category.toLowerCase().includes('world')) {
                category = 'OpenWorld';
            }
            
            // Normalize common variations
            if (category.toLowerCase() === 'openworld') {
                category = 'OpenWorld';
            }
            
            // Add data attribute to the box
            box.setAttribute('data-category', category);
            
            // Debug: Log what we found
            console.log('Box:', box.className, 'Category found:', category);
        } else {
            console.log('No type element found for box:', box.className);
        }
    });
    
    // Test function - Call this from console to debug
    window.testCategoryDetection = function() {
        console.log('=== CATEGORY DETECTION TEST ===');
        gameBoxes.forEach(box => {
            const category = box.getAttribute('data-category');
            const title = box.querySelector('h1')?.textContent;
            console.log(`Game: ${title} | Category: ${category} | Box Class: ${box.className}`);
        });
    };
    
    // Call test function automatically
    setTimeout(() => {
        console.log('Auto-running category detection test...');
        window.testCategoryDetection();
    }, 1000);

    // Add click event listeners to category dropdown links
    const categoryLinks = document.querySelectorAll('.category-dropdown a[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedCategory = this.getAttribute('data-category');
            filterGamesByCategory(selectedCategory);
        });
    });

    // Function to filter games by category
    function filterGamesByCategory(category) {
        console.log('Filtering by category:', category);
        
        // Reset any search highlighting/effects
        gameBoxes.forEach(box => {
            box.style.boxShadow = '';
            box.classList.remove('search-highlighted');
        });
        
        // Hide search result count if present
        const searchResultCount = document.getElementById('search-result-count');
        if (searchResultCount) {
            searchResultCount.remove();
        }
        
        // Clear search input if present
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        gameBoxes.forEach(box => {
            const boxCategory = box.getAttribute('data-category');
            console.log('Box category:', boxCategory, 'Selected category:', category);
            
            if (category === 'all' || !category) {
                box.style.display = 'block'; // Show all
                box.style.opacity = '1';
                preserveResponsiveSizes(box); // Use responsive scaling instead of fixed scale
            } else if (boxCategory && boxCategory.toLowerCase() === category.toLowerCase()) {
                box.style.display = 'block'; // Show matching category
                box.style.opacity = '1';
                preserveResponsiveSizes(box); // Use responsive scaling instead of fixed scale
                console.log('Showing box:', box.className);
            } else {
                box.style.display = 'none'; // Hide non-matching
                box.style.opacity = '0';
                box.style.transform = 'scale(0.8)';
                console.log('Hiding box:', box.className);
            }
        });
        
        // Count visible boxes
        const visibleBoxes = Array.from(gameBoxes).filter(box => box.style.display !== 'none');
        console.log(`Category filter complete. Showing ${visibleBoxes.length} out of ${gameBoxes.length} games.`);
        
        // Show category result notification
        showCategoryNotification(category, visibleBoxes.length);
    }

    // Add "Show All" option to category dropdowns
    const categoryDropdowns = document.querySelectorAll('.category-dropdown');
    categoryDropdowns.forEach(dropdown => {
        // Create "Show All" link if it doesn't exist
        if (!dropdown.querySelector('a[data-category="all"]')) {
            const showAllLink = document.createElement('a');
            showAllLink.href = '#';
            showAllLink.setAttribute('data-category', 'all');
            showAllLink.textContent = 'Show All';
            
            // Add click event
            showAllLink.addEventListener('click', function(e) {
                e.preventDefault();
                filterGamesByCategory('all');
            });
            
            // Insert at the beginning of dropdown
            dropdown.insertBefore(showAllLink, dropdown.firstChild);
        }
    });
    
    // Show category filter notification
    function showCategoryNotification(category, count) {
        // Remove existing notification
        const existing = document.getElementById('category-result-notification');
        if (existing) {
            existing.remove();
        }
        
        if (category === 'all' || !category) return;
        
        const notification = document.createElement('div');
        notification.id = 'category-result-notification';
        notification.className = 'category-result-indicator';
        
        const categoryDisplay = category === 'OpenWorld' ? 'Open World' : category;
        
        notification.innerHTML = `
            <div class="category-result-content">
                <i class="fas fa-filter"></i>
                <span class="result-text">
                    ${count > 0 
                        ? `Showing ${count} ${categoryDisplay} game${count !== 1 ? 's' : ''}`
                        : `No ${categoryDisplay} games found`
                    }
                </span>
                ${count > 0 ? '<i class="fas fa-gamepad result-icon"></i>' : '<i class="fas fa-times-circle result-icon"></i>'}
            </div>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: ${count > 0 
                ? 'linear-gradient(135deg, #fec53a, #ff9f43)' 
                : 'linear-gradient(135deg, #ff4757, #ff6b9d)'};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${count > 0 ? 'rgba(254, 197, 58, 0.4)' : 'rgba(255, 71, 87, 0.4)'};
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 1200;
            opacity: 0;
            animation: categorySlideIn 0.4s ease-out forwards;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (document.getElementById('category-result-notification')) {
                notification.style.animation = 'categorySlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Add CSS animations for category notifications
    const categoryStyles = document.createElement('style');
    categoryStyles.textContent = `
        @keyframes categorySlideIn {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0) scale(1);
            }
        }
        
        @keyframes categorySlideOut {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px) scale(0.9);
            }
        }
        
        .category-result-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .category-result-content .result-text {
            margin: 0 4px;
        }
        
        .category-result-content .result-icon {
            font-size: 12px;
            opacity: 0.9;
        }
        
        /* Responsive adjustments for category indicator */
        @media (max-width: 768px) {
            #category-result-notification {
                top: 100px;
                font-size: 12px;
                padding: 10px 20px;
                max-width: 90vw;
            }
        }
    `;
    
    document.head.appendChild(categoryStyles);

    // Close dropdowns when clicking outside (mobile only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) { // Only on mobile
            if (!e.target.closest('.category-link') && !e.target.closest('.category-dropdown')) {
                const dropdowns = document.querySelectorAll('.category-dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            }
        }
    });

    // Toggle dropdown visibility on mobile only
    const mobileLinks = document.querySelectorAll('.category-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default on mobile to allow hover on desktop
            const dropdown = this.nextElementSibling;
            if (dropdown && dropdown.classList.contains('category-dropdown')) {
                if (window.innerWidth <= 768) { // Mobile view only
                    e.preventDefault(); // Prevent default only on mobile
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                    } else {
                        // Hide all other dropdowns first
                        document.querySelectorAll('.category-dropdown').forEach(d => {
                            d.classList.remove('show');
                        });
                        dropdown.classList.add('show');
                    }
                }
            }
        });
    });


});
