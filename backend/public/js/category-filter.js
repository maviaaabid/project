// Category filter functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add data-category attributes to all game boxes based on their type
    const gameBoxes = document.querySelectorAll('.box, .box-2');
    
    // Initialize all boxes as visible
    gameBoxes.forEach(box => {
        // Get the category from the type element
        const typeElement = box.querySelector('.type p, .type-2 p');
        if (typeElement) {
            // Get the text content and normalize it (remove spaces, make lowercase)
            let category = typeElement.textContent.trim();
            
            // Handle special cases like "OpenWorld" vs "Open World"
            if (category.toLowerCase().includes('open') && category.toLowerCase().includes('world')) {
                category = 'OpenWorld';
            }
            
            // Add data attribute to the box
            box.setAttribute('data-category', category);
        }
    });

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
        gameBoxes.forEach(box => {
            const boxCategory = box.getAttribute('data-category');
            if (category === 'all' || !category) {
                box.style.display = 'block'; // Show all
            } else if (boxCategory && boxCategory.toLowerCase() === category.toLowerCase()) {
                box.style.display = 'block'; // Show matching category
            } else {
                box.style.display = 'none'; // Hide non-matching
            }
        });
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

    // Example JS logic
    categoryLink.addEventListener('click', function(e) {
      dropdown.classList.toggle('show');
    });
});