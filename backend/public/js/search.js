// Voice Search Variables - Global scope
let recognition;
let isListening = false;
let continuousRecognition;
let voiceBtn;
let micIcon;
let stopIcon;
let floatingInput;
let suggestionsBox;
let modal;
let boxes;
let searchVisible = false;

// Helper function to get current responsive transform scale
function getCurrentResponsiveScale() {
  const screenWidth = window.innerWidth;
  if (screenWidth <= 350) return 'scale(0.7)';
  if (screenWidth <= 379) return 'scale(0.75)';
  if (screenWidth <= 410) return 'scale(0.85)';
  if (screenWidth <= 436) return 'scale(0.8)';
  if (screenWidth <= 450) return 'scale(0.85)';
  return ''; // No scale for larger screens
}

// Helper function to preserve responsive sizes
function preserveResponsiveSizes(box) {
  const responsiveScale = getCurrentResponsiveScale();
  if (responsiveScale) {
    box.style.transform = responsiveScale;
  } else {
    box.style.transform = '';
  }
}

// Toggle search bar modal ONLY when clicking the icon (not background)
document.addEventListener('DOMContentLoaded', function() {
  const fab = document.getElementById('search-fab');
  const fabBg = document.getElementById('fab-bg');
  modal = document.getElementById('search-modal');
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
    { name: "GTA-V", type: "OpenWorld", year: 2013 },
    { name: "PalWorld", type: "Action", year: 2024 },
    { name: "CALL of DUTY-BLACK OPS III", type: "Fighting", year: 2015 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 },
    { name: "WAR-X-ZONE", type: "Fighting", year: 2013 }
    // Add more products as needed
  ];

  // Initialize voice search elements
  voiceBtn = document.getElementById('voice-search-btn');
  micIcon = document.getElementById('mic-icon');
  stopIcon = document.getElementById('stop-icon');
  
  // Ensure modal is available
  if (!modal) {
    modal = document.getElementById('search-modal');
  }
  
  floatingInput = modal ? modal.querySelector('#search-input') : null;
  suggestionsBox = modal ? modal.querySelector('#suggestions') : null;
  boxes = document.querySelectorAll('.box, .box-1, .box-2, .box-3, .box-4, .box-5, .box-6, .box-7, .box-8, .box-9, .box-10, .box-11, .box-12, .box-13, .box-14, .box-15, .game-card');

  // Add smooth transitions to all game boxes for better search experience
  boxes.forEach(box => {
    box.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  // Add window resize listener to maintain responsive sizes
  window.addEventListener('resize', function() {
    // Only apply responsive sizing if search is not active
    if (!floatingInput || !floatingInput.value.trim()) {
      boxes.forEach(box => {
        if (box.style.display !== 'none') {
          preserveResponsiveSizes(box);
        }
      });
    }
  });

  console.log('Search initialized with', {
    voiceBtn: !!voiceBtn,
    micIcon: !!micIcon,
    stopIcon: !!stopIcon,
    floatingInput: !!floatingInput,
    suggestionsBox: !!suggestionsBox,
    boxesCount: boxes.length,
    modal: !!modal
  });

  // Initialize Speech Recognition
  function initVoiceSearch() {
    console.log('Checking voice search support...');
    
    // Check if we're on HTTPS or localhost
    const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    console.log('Is secure context:', isSecure, 'Protocol:', location.protocol, 'Hostname:', location.hostname);
    
    if (!isSecure) {
      console.log('Voice search requires HTTPS or localhost');
      showErrorMessage('Voice search requires HTTPS connection. Using text search only.');
      return false;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported in this browser');
      return false;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = function() {
        console.log('Voice recognition started');
        isListening = true;
        if (voiceBtn) voiceBtn.classList.add('listening');
        if (micIcon) micIcon.style.display = 'none';
        if (stopIcon) stopIcon.style.display = 'block';
        if (floatingInput) floatingInput.placeholder = 'Listening... Speak now!';
      };
      
      recognition.onresult = function(event) {
        console.log('Voice recognition result:', event.results);
        let transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Transcript:', transcript);
        
        // Clean up common speech recognition errors for game names
        transcript = cleanTranscript(transcript);
        console.log('Cleaned transcript:', transcript);
        
        if (floatingInput) {
          floatingInput.value = transcript;
          
          // Trigger search with voice input
          const inputEvent = new Event('input', { bubbles: true });
          floatingInput.dispatchEvent(inputEvent);
          
          // Auto-search for exact matches after a short delay
          setTimeout(() => {
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
            floatingInput.dispatchEvent(enterEvent);
          }, 800);
        }
      };
      
      recognition.onerror = function(event) {
        console.log('Voice search error:', event.error);
        resetVoiceButton();
        
        // Don't show error for 'aborted' as it's usually intentional
        if (event.error === 'aborted') {
          console.log('Voice search was aborted (likely intentional)');
          // Restart continuous listening
          setTimeout(() => {
            startContinuousListening();
          }, 1000);
          return;
        }
        
        if (event.error === 'not-allowed') {
          showErrorMessage('Microphone access denied. Please allow microphone access to use voice search.');
        } else if (event.error === 'no-speech') {
          if (floatingInput) {
            floatingInput.placeholder = 'No speech detected. Try again!';
            setTimeout(() => {
              floatingInput.placeholder = 'Search games or say \'Hey Search\'...';
            }, 2000);
          }
          // Restart continuous listening
          setTimeout(() => {
            startContinuousListening();
          }, 2000);
        } else if (event.error === 'network') {
          showErrorMessage('Network error. Please check your internet connection.');
          // Restart continuous listening
          setTimeout(() => {
            startContinuousListening();
          }, 3000);
        } else {
          showErrorMessage('Voice search error: ' + event.error);
          // Restart continuous listening
          setTimeout(() => {
            startContinuousListening();
          }, 2000);
        }
      };
      
      recognition.onend = function() {
        console.log('Voice recognition ended');
        resetVoiceButton();
        // Restart continuous listening after manual search ends
        setTimeout(() => {
          startContinuousListening();
        }, 1000);
      };
      
      console.log('Voice search initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing voice search:', error);
      return false;
    }
  }
  
  // Clean transcript for better game name matching
  function cleanTranscript(transcript) {
    const gameNameMappings = {
      'forza motor sport': 'ForzaMotorspot',
      'forza motorsport': 'ForzaMotorspot',
      'forza': 'ForzaMotorspot',
      'fortnight': 'Fortnite-Cauchemars',
      'fortnite': 'Fortnite-Cauchemars',
      'fort night': 'Fortnite-Cauchemars',
      'call of duty': 'CALL of DUTY-BLACK OPS III',
      'cod': 'CALL of DUTY-BLACK OPS III',
      'black ops': 'CALL of DUTY-BLACK OPS III',
      'gta': 'GTA-V',
      'gta 5': 'GTA-V',
      'gta five': 'GTA-V',
      'grand theft auto': 'GTA-V',
      'pal world': 'PalWorld',
      'paul world': 'PalWorld',
      'war x zone': 'WAR-X-ZONE',
      'war zone': 'WAR-X-ZONE',
      'warzone': 'WAR-X-ZONE',
      'war ex zone': 'WAR-X-ZONE'
    };
    
    // Check for exact mappings first
    for (const [spoken, actual] of Object.entries(gameNameMappings)) {
      if (transcript.includes(spoken)) {
        return actual;
      }
    }
    
    return transcript;
  }
  
  // Show error message to user
  function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'voice-notification';
    errorDiv.style.background = 'linear-gradient(135deg, #ff4757, #ff6b9d)';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.classList.add('hide');
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 500);
    }, 4000);
    
    errorDiv.addEventListener('click', () => {
      errorDiv.classList.add('hide');
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 500);
    });
  }
  
  function resetVoiceButton() {
    console.log('Resetting voice button');
    isListening = false;
    if (voiceBtn) {
      voiceBtn.classList.remove('listening', 'processing');
    }
    if (micIcon) micIcon.style.display = 'block';
    if (stopIcon) stopIcon.style.display = 'none';
    if (floatingInput) {
      floatingInput.placeholder = 'Search games or say \'Hey Search\'...';
    }
  }
  
  function startVoiceSearch() {
    console.log('Starting voice search. Recognition available:', !!recognition, 'Is listening:', isListening);
    
    // Stop continuous recognition to prevent conflicts
    if (continuousRecognition) {
      try {
        continuousRecognition.stop();
      } catch (e) {
        console.log('Could not stop continuous recognition:', e);
      }
    }
    
    if (recognition && !isListening) {
      try {
        console.log('Starting recognition...');
        recognition.start();
      } catch (error) {
        console.error('Voice search start error:', error);
        resetVoiceButton();
        // Restart continuous listening after error
        setTimeout(() => {
          startContinuousListening();
        }, 2000);
        showErrorMessage('Could not start voice search: ' + error.message);
      }
    } else if (isListening && recognition) {
      console.log('Stopping recognition...');
      recognition.stop();
      resetVoiceButton();
    } else {
      console.log('Voice recognition not available');
      showErrorMessage('Voice search is not available in this browser.');
    }
  }

  // Remove the header search bar (if present)
  const headerSearchBar = document.querySelector('header .search-bar-container');
  if(headerSearchBar) headerSearchBar.style.display = 'none';

  // Floating search icon logic (now in navbar, replaces #btn)
  const fab = document.getElementById('search-fab');
  const fabBg = document.getElementById('fab-bg');
  
  console.log('Search elements found:', {
    fab: !!fab,
    fabBg: !!fabBg,
    modal: !!modal
  });

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
    console.log('Toggling search modal. Current visible:', searchVisible, 'Force:', force);
    
    if (force === true || (force === undefined && !searchVisible)) {
      searchVisible = true;
      modal.style.display = 'block';
      const fabBg = document.getElementById('fab-bg');
      if (fabBg) fabBg.style.filter = 'blur(200px) brightness(0.5)';
      setAllBlur(true);
      setTimeout(() => {
        if (floatingInput) {
          floatingInput.focus();
          console.log('Search input focused');
        }
      }, 200);
    } else {
      searchVisible = false;
      modal.style.display = 'none';
      const fabBg = document.getElementById('fab-bg');
      if (fabBg) fabBg.style.filter = '';
      setAllBlur(false);
      if (floatingInput) floatingInput.blur();
    }
  }

  // Only toggle if the icon itself is clicked
  // fab variable already declared above
  if (fab) {
    fab.addEventListener('click', function(e) {
      console.log('Fab clicked, target:', e.target.tagName, e.target.className);
      if (
        e.target.classList.contains('gaming-search-icon') ||
        e.target.classList.contains('fa-search') ||
        e.target.tagName === 'I' ||
        e.target.tagName === 'SVG' ||
        e.target.tagName === 'PATH'
      ) {
        console.log('Valid search icon clicked, toggling modal');
        toggleSearchModal();
      }
    });
  } else {
    console.log('Search fab element not found!');
  }

  // Escape closes modal and removes blur
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') {
      toggleSearchModal(false);
      if (isListening && recognition) {
        recognition.stop();
        resetVoiceButton();
      }
    }
    
    // Ctrl/Cmd + Shift + V for voice search
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      if (!searchVisible) {
        toggleSearchModal(true);
        setTimeout(() => {
          startVoiceSearch();
        }, 300);
      } else {
        startVoiceSearch();
      }
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
    
    // Initialize voice search if available
    const voiceAvailable = initVoiceSearch();
    
    // Update debug status
    const debugEl = document.getElementById('voice-debug');
    const statusEl = document.getElementById('voice-status');
    if (debugEl && statusEl) {
      debugEl.style.display = 'block';
      statusEl.textContent = voiceAvailable ? 'Available ✓' : 'Not Available ✗';
      
      // Hide debug after 5 seconds
      setTimeout(() => {
        debugEl.style.display = 'none';
      }, 5000);
    }
    
    // Show voice search notification
    function showVoiceNotification() {
      if (localStorage.getItem('voiceSearchNotificationShown')) {
        return;
      }
      
      const notification = document.createElement('div');
      notification.className = 'voice-notification';
      notification.innerHTML = `
        <i class="fas fa-microphone"></i> 
        Voice search enabled! Say "Hey Search" or click the mic button
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 4000);
      
      notification.addEventListener('click', () => {
        notification.classList.add('hide');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      });
      
      localStorage.setItem('voiceSearchNotificationShown', 'true');
    }
    
    // Voice button click handler
    if (voiceBtn && voiceAvailable) {
      console.log('Setting up voice button event listener');
      voiceBtn.addEventListener('click', function(e) {
        console.log('Voice button clicked!');
        e.preventDefault();
        e.stopPropagation();
        startVoiceSearch();
      });
      
      // Show voice button
      voiceBtn.style.display = 'flex';
      console.log('Voice button is now visible');
      
      // Show notification about voice search
      setTimeout(() => {
        showVoiceNotification();
      }, 1000);
    } else if (voiceBtn) {
      console.log('Voice not available, hiding voice button');
      // Hide voice button if not supported
      voiceBtn.style.display = 'none';
      if (floatingInput) floatingInput.style.width = '100%';
    } else {
      console.log('Voice button element not found!');
    }
    
    // Continuous listening for "Hey Search" wake word
    let continuousRecognition;
    let continuousListeningActive = false;
    
    function startContinuousListening() {
      // Don't start if manual recognition is active or if continuous is already running
      if (isListening || continuousListeningActive) {
        console.log('Cannot start continuous listening - manual recognition active or already running');
        return;
      }
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        try {
          continuousRecognition = new SpeechRecognition();
          
          continuousRecognition.continuous = true;
          continuousRecognition.interimResults = true;
          continuousRecognition.lang = 'en-US';
          
          continuousRecognition.onstart = function() {
            continuousListeningActive = true;
            console.log('Continuous listening started');
          };
          
          continuousRecognition.onresult = function(event) {
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript.toLowerCase();
              
              if (transcript.includes('hey search') || transcript.includes('voice search')) {
                console.log('Wake word detected:', transcript);
                continuousRecognition.stop();
                continuousListeningActive = false;
                
                // Open search modal and start voice search
                toggleSearchModal(true);
                setTimeout(() => {
                  startVoiceSearch();
                }, 500);
                
                return; // Don't restart continuous listening immediately
              }
            }
          };
          
          continuousRecognition.onerror = function(event) {
            continuousListeningActive = false;
            if (event.error !== 'aborted') {
              console.log('Continuous listening error:', event.error);
              // Restart after error (but not immediately to avoid loops)
              setTimeout(() => {
                if (!isListening) { // Only restart if manual recognition isn't active
                  startContinuousListening();
                }
              }, 5000);
            }
          };
          
          continuousRecognition.onend = function() {
            continuousListeningActive = false;
            console.log('Continuous listening ended');
            // Restart continuous listening if manual recognition isn't active
            setTimeout(() => {
              if (!isListening) {
                startContinuousListening();
              }
            }, 2000);
          };
          
          continuousRecognition.start();
        } catch (error) {
          continuousListeningActive = false;
          console.log('Could not start continuous listening:', error);
          // Retry after longer delay
          setTimeout(() => {
            if (!isListening) {
              startContinuousListening();
            }
          }, 10000);
        }
      }
    }
    
    // Start continuous listening when page loads
    setTimeout(() => {
      startContinuousListening();
    }, 2000);
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
          
          // Show only the selected box (exact match first)
          let found = false;
          let matchingBoxes = [];
          
          boxes.forEach(box => {
            const title = box.querySelector('h1')?.textContent.trim().toLowerCase() || '';
            if (title === product.name.trim().toLowerCase()) {
              box.style.display = 'block';
              box.style.opacity = '1';
              box.style.transform = ''; // Remove zoom effect
              box.style.transition = 'all 0.3s ease';
              matchingBoxes.push(box);
              found = true;
            } else {
              box.style.display = 'none';
              box.style.opacity = '0';
              box.style.transform = 'scale(0.8)';
            }
          });
          
          // If no exact h1 match, show all partial matches (by box content)
          if (!found) {
            boxes.forEach(box => {
              const text = box.textContent.toLowerCase();
              if (text.includes(product.name.trim().toLowerCase())) {
                box.style.display = 'block';
                box.style.opacity = '1';
                box.style.transform = ''; // Remove zoom effect
                box.style.transition = 'all 0.3s ease';
                matchingBoxes.push(box);
              } else {
                box.style.display = 'none';
                box.style.opacity = '0';
                box.style.transform = 'scale(0.8)';
              }
            });
          }
          
          // Center and highlight the selected results
          centerSearchResults(matchingBoxes, product.name, found);
          
          // Show search result count
          showSearchResultCount(matchingBoxes.length, product.name);
          
          console.log(`Autocomplete selection: "${product.name}" - ${matchingBoxes.length} games shown`);
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
            boxes.forEach(box => {
              box.style.display = 'none';
              box.style.opacity = '0';
              box.style.transform = 'scale(0.8)';
            });
            // Show no results notification
            showSearchResultCount(0, value);
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
      let visibleCount = 0;
      let matchingBoxes = [];
      
      // Reset any category highlighting
      boxes.forEach(box => {
        box.style.boxShadow = '';
        box.classList.remove('search-highlighted');
      });
      
      // Hide any category notifications
      const categoryNotification = document.getElementById('category-result-notification');
      if (categoryNotification) {
        categoryNotification.remove();
      }
      
      boxes.forEach(box => {
        // Get all visible text inside the box
        const text = box.textContent.toLowerCase();
        const title = box.querySelector('h1')?.textContent.trim().toLowerCase() || '';
        
        // Check if query matches game title, type, or year
        if (!q) {
          // Show all if no query - preserve responsive CSS sizes
          box.style.display = 'block';
          box.style.opacity = '1';
          preserveResponsiveSizes(box); // Apply responsive scale
          visibleCount++;
        } else if (title.includes(q) || text.includes(q)) {
          // Show matching games without zoom effect
          box.style.display = 'block';
          box.style.opacity = '1';
          box.style.transform = ''; // Remove zoom effect
          matchingBoxes.push(box);
          visibleCount++;
        } else {
          // Hide non-matching games completely
          box.style.display = 'none';
          box.style.opacity = '0';
          box.style.transform = 'scale(0.8)';
        }
      });
      
      // Center and highlight matching boxes
      if (q && matchingBoxes.length > 0) {
        centerSearchResults(matchingBoxes, q);
      }
      
      // Show search result count
      showSearchResultCount(visibleCount, q);
      
      console.log(`Search filter complete. Showing ${visibleCount} out of ${boxes.length} games for query: "${q}"`);
    }

    // Show only the box with the given name (exact match)
    function showOnlyBox(name) {
      let matchingBoxes = [];
      let visibleCount = 0;
      
      // Reset any category highlighting
      boxes.forEach(box => {
        box.style.boxShadow = '';
        box.classList.remove('search-highlighted');
      });
      
      // Hide any category notifications
      const categoryNotification = document.getElementById('category-result-notification');
      if (categoryNotification) {
        categoryNotification.remove();
      }
      
      boxes.forEach(box => {
        const title = box.querySelector('h1')?.textContent.trim().toLowerCase() || '';
        if (title === name.trim().toLowerCase()) {
          box.style.display = 'block';
          box.style.opacity = '1';
          box.style.transform = ''; // Remove zoom effect
          box.style.transition = 'all 0.3s ease';
          matchingBoxes.push(box);
          visibleCount++;
        } else {
          box.style.display = 'none';
          box.style.opacity = '0';
          box.style.transform = 'scale(0.8)';
        }
      });
      
      // Center and highlight the exact match
      centerSearchResults(matchingBoxes, name, true);
      
      // Show search result count
      showSearchResultCount(visibleCount, name);
      
      console.log(`Exact match search complete. Showing ${visibleCount} game for: "${name}"`);
    }

    // Show all boxes
    function showAllBoxes() {
      boxes.forEach(box => {
        box.style.display = 'block';
        box.style.opacity = '1';
        // Apply responsive scale based on current screen size
        preserveResponsiveSizes(box);
        box.style.transition = 'all 0.3s ease';
        box.style.boxShadow = '';
        box.classList.remove('search-highlighted');
      });
      
      // Remove search result indicator
      hideSearchResultCount();
      
      // Remove category notifications
      const categoryNotification = document.getElementById('category-result-notification');
      if (categoryNotification) {
        categoryNotification.remove();
      }
      
      // Reset any centering effects
      resetSearchLayout();
      
      console.log('Showing all games - search and category filters cleared, original responsive sizes restored');
    }

    // Optional: show all on empty
      floatingInput.addEventListener('search', function () {
      showAllBoxes();
    });
  }
});

// Helper functions for search results
function centerSearchResults(matchingBoxes, query, isExactMatch = false) {
  // Add search highlighting to matching boxes without zoom
  matchingBoxes.forEach(box => {
    box.classList.add('search-highlighted');
    // Removed zoom effects - only keeping box shadow for visual indication
    box.style.boxShadow = isExactMatch 
      ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)'
      : '0 0 15px rgba(0, 234, 255, 0.6), 0 0 30px rgba(0, 234, 255, 0.3)';
  });
  
  // Scroll to first matching box if any
  if (matchingBoxes.length > 0) {
    matchingBoxes[0].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
}

function showSearchResultCount(count, query) {
  // Remove existing indicator
  const existing = document.getElementById('search-result-count');
  if (existing) {
    existing.remove();
  }
  
  if (!query) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'search-result-count';
  indicator.className = 'search-result-indicator';
  
  indicator.innerHTML = `
    <div class="search-result-content">
      <i class="fas fa-search"></i>
      <span class="result-text">
        ${count > 0 
          ? `Found ${count} game${count !== 1 ? 's' : ''} for "${query}"`
          : `No games found for "${query}"`
        }
      </span>
      ${count > 0 ? '<i class="fas fa-gamepad result-icon"></i>' : '<i class="fas fa-times-circle result-icon"></i>'}
    </div>
  `;
  
  // Style the indicator
  indicator.style.cssText = `
    position: fixed;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    background: ${count > 0 
      ? 'linear-gradient(135deg, #00eaff, #7f00ff)' 
      : 'linear-gradient(135deg, #ff4757, #ff6b9d)'};
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${count > 0 ? 'rgba(0, 234, 255, 0.4)' : 'rgba(255, 71, 87, 0.4)'};
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 1200;
    opacity: 0;
    animation: searchSlideIn 0.4s ease-out forwards;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  document.body.appendChild(indicator);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (document.getElementById('search-result-count')) {
      indicator.style.animation = 'searchSlideOut 0.3s ease-in forwards';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  }, 3000);
}

function hideSearchResultCount() {
  const indicator = document.getElementById('search-result-count');
  if (indicator) {
    indicator.remove();
  }
}

function resetSearchLayout() {
  // Reset any search-specific layout changes
  const container = document.querySelector('.boxes-container');
  if (container) {
    container.style.justifyContent = '';
    container.style.alignItems = '';
  }
}

// Add CSS animations for search indicators
const searchStyles = document.createElement('style');
searchStyles.textContent = `
  @keyframes searchSlideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }
  
  @keyframes searchSlideOut {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px) scale(0.9);
    }
  }
  
  .search-result-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .search-result-content .result-text {
    margin: 0 4px;
  }
  
  .search-result-content .result-icon {
    font-size: 12px;
    opacity: 0.9;
  }
  
  .search-highlighted {
    transition: all 0.3s ease !important;
  }
  
  /* Responsive adjustments for search indicator */
  @media (max-width: 768px) {
    #search-result-count {
      top: 100px;
      font-size: 12px;
      padding: 10px 20px;
      max-width: 90vw;
    }
  }
`;

document.head.appendChild(searchStyles);
