// Toggle search bar modal ONLY when clicking the icon (not background)
document.addEventListener('DOMContentLoaded', function() {
  const fab = document.getElementById('search-fab');
  const fabBg = document.getElementById('fab-bg');
  const modal = document.getElementById('search-modal');
  if (fab && fabBg && modal) {
    // Only toggle when clicking the SVG icon
    const icon = fab.querySelector('.gaming-search-icon');
    if (icon) {
      icon.style.pointerEvents = 'auto';
      icon.addEventListener('click', function(e) {
        e.stopPropagation();
        if (modal.style.display === 'none' || !modal.style.display) {
          modal.style.display = 'block';
          // Blur the icon background (strong blur)
          // Blur only the fabBg, NOT the icon (remove filter from icon)
          fabBg.style.filter = 'blur(15px) brightness(0.2)';
          if (icon) icon.style.filter = 'none';
          // Focus input if present
          const input = modal.querySelector('input#search-input');
          if (input) input.focus();
        } else {
          modal.style.display = 'none';
          fabBg.style.filter = '';
          if (icon) icon.style.filter = '';
        }
      });
    }
    // Prevent modal from closing on background click
    modal.addEventListener('click', function(e) {
      // Do nothing
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Product data for filter and autocomplete
  const products = [
    { name: "ForzaMotorspot", type: "Racing", year: 2023 },
    { name: "Fortnite-Cauchemars", type: "Action", year: 2013 },
    { name: "CALL of DUTY-BLACK OPS III", type: "Fighting", year: 2015 },
    { name: "GTA-V", type: "openworld", year: 2013 },
    { name: "PalWorld", type: "Action", year: 2024 },
    // Add more products as needed
  ];

  // Remove the header search bar (if present)
  const headerSearchBar = document.querySelector('header .search-bar-container');
  if(headerSearchBar) headerSearchBar.style.display = 'none';

  // Floating search icon logic (now in navbar, replaces #btn)
  const fab = document.getElementById('search-fab');
  const fabBg = document.getElementById('fab-bg');
  const modal = document.getElementById('search-modal');
  const floatingInput = modal ? modal.querySelector('#search-input') : null;
  const suggestionsBox = modal ? modal.querySelector('#suggestions') : null;
  const boxes = document.querySelectorAll('.box, .box-2');
  let searchVisible = false;

  // Add this class to your search-fab (icon container) in HTML:
  // <div id="search-fab" class="search-fab-no-blur">...</div>

  function setAllBlur(blur = true) {
    const topIcons = document.getElementById('top-icons-bar');
    const mainContent = document.querySelector('.container');
    const footer = document.querySelector('.footer-gaming');

    if (blur) {
      if (topIcons) topIcons.style.filter = 'blur(4px)';
      if (mainContent) mainContent.style.filter = 'blur(4px)';
      if (footer) footer.style.filter = 'blur(4px)';
    } else {
      if (topIcons) topIcons.style.filter = 'none';
      if (mainContent) mainContent.style.filter = 'none';
      if (footer) footer.style.filter = 'none';
    }
  }

  function toggleSearchModal(force) {
    if (force === true || (force === undefined && !searchVisible)) {
      searchVisible = true;
      modal.style.display = 'block';
      fabBg.style.filter = 'blur(200px) brightness(0.5)';
      setAllBlur(true);
      setTimeout(()=>{ floatingInput && floatingInput.focus(); }, 200);
    } else {
      searchVisible = false;
      modal.style.display = 'none';
      fabBg.style.filter = '';
      setAllBlur(false);
      floatingInput && floatingInput.blur();
    }
  }

  // Only toggle if the icon itself is clicked
  fab.addEventListener('click', function(e) {
    if (
      e.target.classList.contains('gaming-search-icon') ||
      e.target.classList.contains('fa-search') ||
      e.target.tagName === 'I' ||
      e.target.tagName === 'SVG'
    ) {
      toggleSearchModal();
    }
  });

  // Escape closes modal and removes blur
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') {
      toggleSearchModal(false);
    }
  });

  // Remove blur when search bar closes via suggestion click or Enter
  if (floatingInput && suggestionsBox && boxes.length) {
    suggestionsBox.addEventListener('mousedown', function(e) {
      if (e.target.classList.contains('suggestion-item')) {
        toggleSearchModal(false);
      }
    });

    floatingInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        setTimeout(() => {
          toggleSearchModal(false);
        }, 100);
      }
    });
  }

  // Allow closing modal by clicking on modal background (not the search bar)
  if (modal) {
    modal.addEventListener('mousedown', function(e) {
      if (e.target === modal) {
        toggleSearchModal(false);
      }
    });
  }

  // --- SEARCH/AUTOCOMPLETE/FILTER LOGIC ---
  if(floatingInput && suggestionsBox && boxes.length) {
    // Autocomplete suggestions
    floatingInput.addEventListener('input', function () {
      const value = this.value.trim().toLowerCase();
      suggestionsBox.innerHTML = '';
      if (!value) {
        suggestionsBox.style.display = 'none';
        showAllBoxes();
        return;
      }
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(value) ||
        (p.type && p.type.toLowerCase().includes(value)) ||
        (p.year && p.year.toString().includes(value))
      );
      matches.forEach(product => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = product.name;
        // Use mousedown instead of click to ensure modal closes before blur
        div.addEventListener('mousedown', function(e) {
          e.preventDefault(); // Prevent input blur before handler
          floatingInput.value = product.name;
          suggestionsBox.style.display = 'none';
          // Hide the modal and blur first
          if (modal && fabBg) {
            modal.style.display = 'none';
            fabBg.style.filter = '';
            searchVisible = false;
          }
          floatingInput.blur();
          // Show only the selected box (case-insensitive, matches h1)
          let found = false;
          boxes.forEach(box => {
            const title = box.querySelector('h1')?.textContent.trim().toLowerCase() || '';
            if (title === product.name.trim().toLowerCase()) {
              box.style.display = '';
              found = true;
            } else {
              box.style.display = 'none';
            }
          });
          // If no exact h1 match, show all partial matches (by box content)
          if (!found) {
            boxes.forEach(box => {
              const text = box.textContent.toLowerCase();
              if (text.includes(product.name.trim().toLowerCase())) {
                box.style.display = '';
              } else {
                box.style.display = 'none';
              }
            });
          }
        });
        suggestionsBox.appendChild(div);
      });
      suggestionsBox.style.display = matches.length ? 'block' : 'none';
      filterBoxes(value);
    });

    // Listen for Enter key to show only the exact match
    floatingInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const value = this.value.trim().toLowerCase();
        if (!value) {
          showAllBoxes();
          suggestionsBox.style.display = 'none';
          e.preventDefault();
          return;
        }
        const exact = products.find(p => p.name.toLowerCase() === value);
        if (exact) {
          showOnlyBox(exact.name);
        } else {
          // If no exact match, check for partial matches
          const partials = products.filter(p =>
            p.name.toLowerCase().includes(value) ||
            (p.type && p.type.toLowerCase().includes(value)) ||
            (p.year && p.year.toString().includes(value))
          );
          if (partials.length > 0) {
            // Show all boxes that match partially
            filterBoxes(value);
          } else {
            // No match at all, hide all
            boxes.forEach(box => box.style.display = 'none');
          }
        }
        suggestionsBox.style.display = 'none';
        e.preventDefault();
      }
    });

    // Hide suggestions on blur
    floatingInput.addEventListener('blur', function () {
      setTimeout(() => suggestionsBox.style.display = 'none', 100);
    });

    // Show all boxes that match the query (partial match in title, type, or year)
    function filterBoxes(query) {
      const q = query.trim().toLowerCase();
      boxes.forEach(box => {
        // Get all visible text inside the box
        const text = box.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          box.style.display = '';
        } else {
          box.style.display = 'none';
        }
      });
    }

    // Show only the box with the given name (exact match)
    function showOnlyBox(name) {
      boxes.forEach(box => {
        const title = box.querySelector('h1')?.textContent.trim().toLowerCase() || '';
        if (title === name.trim().toLowerCase()) {
          box.style.display = '';
        } else {
          box.style.display = 'none';
        }
      });
    }

    // Show all boxes
    function showAllBoxes() {
      boxes.forEach(box => {
        box.style.display = '';
      });
    }

    // Optional: show all on empty
      floatingInput.addEventListener('search', function () {
      showAllBoxes();
    });
  }
});
