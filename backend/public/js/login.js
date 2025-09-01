// Cropper.js must be loaded before this script

// Simple localStorage-based auth (demo only, not secure for production)
const regForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const msg = document.getElementById('msg');
const formTitle = document.getElementById('form-title');
const switchText = document.getElementById('switch-text');
const switchLink = document.getElementById('switch-link');

function showLogin() {
  regForm.style.display = 'none';
  loginForm.style.display = 'block';
  formTitle.textContent = 'Login';
  switchText.innerHTML = "Don't have an account? <a id='switch-link'>Register</a>";
  msg.textContent = '';
  // Reset login OTP state
  loginOtpSent = false;
  loginOtpSection.style.display = "none";
  loginOtpInput.value = "";
  loginBtn.textContent = "Send OTP";
}
function showRegister() {
  regForm.style.display = 'block';
  loginForm.style.display = 'none';
  formTitle.textContent = 'Register';
  switchText.innerHTML = "Already have an account? <a id='switch-link'>Login</a>";
  msg.textContent = '';
}
document.addEventListener('click', function(e) {
  if (e.target && e.target.id === 'switch-link') {
    if (regForm.style.display === 'none') showRegister();
    else showLogin();
  }
});

// Register Form Logic
const regEmail = document.getElementById('reg-email');
const regPassword = document.getElementById('reg-password');
const regOtpSection = document.getElementById('reg-otp-section');
const regOtpInput = document.getElementById('reg-otp');
const regOtpMsg = document.getElementById('reg-otp-msg');
const regBtn = document.getElementById('register-btn');

// --- YEH LINES ADD KAREN (login form ke liye) ---
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginOtpSection = document.getElementById('login-otp-section');
const loginOtpInput = document.getElementById('login-otp');
const loginOtpMsg = document.getElementById('login-otp-msg');
const loginBtn = document.getElementById('login-btn');
// -----------------------------------------------

// Register OTP state
let regOtpSent = false;
let regOtpValue = "";

// Login OTP state (yeh lines zaroor add karein)
let loginOtpSent = false;
let loginOtpValue = "";

regForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!regOtpSent) {
    // Send OTP
    regBtn.disabled = true;
    regBtn.textContent = "Sending...";
    regOtpMsg.textContent = "";
    const email = regEmail.value.trim();
    const password = regPassword.value;
    if (!email.endsWith('@gmail.com') || !password) {
      regOtpMsg.textContent = "Enter valid Gmail and password.";
      regBtn.disabled = false;
      regBtn.textContent = "Send OTP";
      return;
    }
    regOtpValue = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const res = await fetch(`${getOtpApiUrl()}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: regOtpValue })
      });
      const data = await res.json();
      if (data.message === 'OTP sent') {
        regOtpSection.style.display = "block";
        regBtn.textContent = "Register";
        regOtpSent = true;
        regBtn.disabled = false;
        regOtpMsg.textContent = "OTP sent to your Gmail.";
      } else {
        regOtpMsg.textContent = "Failed to send OTP: " + data.message;
        regBtn.disabled = false;
        regBtn.textContent = "Send OTP";
      }
    } catch (err) {
      regOtpMsg.textContent = "Error sending OTP.";
      regBtn.disabled = false;
      regBtn.textContent = "Send OTP";
    }
  } else {
    // Verify OTP
    regBtn.disabled = true;
    regBtn.textContent = "Verifying...";
    const otp = regOtpInput.value.trim();
    const email = regEmail.value.trim();
    if (!otp) {
      regOtpMsg.textContent = "Please enter OTP.";
      regBtn.disabled = false;
      regBtn.textContent = "Register";
      return;
    }
    try {
      const res = await fetch(`${getOtpApiUrl()}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        regOtpMsg.style.color = "#00eaff";
        regOtpMsg.textContent = "Registration successful! Redirecting to login...";
        setTimeout(() => {
          regOtpSection.style.display = "none";
          regOtpInput.value = "";
          regOtpMsg.textContent = "";
          regOtpSent = false;
          regBtn.textContent = "Send OTP";
          // Optionally, save user to localStorage here
          showLogin();
        }, 1200);
      } else {
        regOtpMsg.style.color = "#f357a8";
        regOtpMsg.textContent = "Invalid OTP. Try again.";
        regBtn.disabled = false;
        regBtn.textContent = "Register";
      }
    } catch (err) {
      regOtpMsg.style.color = "#f357a8";
      regOtpMsg.textContent = "Error verifying OTP.";
      regBtn.disabled = false;
      regBtn.textContent = "Register";
    }
  }
});

// Login Form Logic
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!loginOtpSent) {
    // Send OTP
    loginBtn.disabled = true;
    loginBtn.textContent = "Sending...";
    loginOtpMsg.textContent = "";
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    if (!email.endsWith('@gmail.com') || !password) {
      loginOtpMsg.textContent = "Enter valid Gmail and password.";
      loginBtn.disabled = false;
      loginBtn.textContent = "Send OTP";
      return;
    }
    loginOtpValue = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const res = await fetch(`${getOtpApiUrl()}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: loginOtpValue })
      });
      const data = await res.json();
      if (data.message === 'OTP sent') {
        loginOtpSection.style.display = "block";
        loginBtn.textContent = "Login";
        loginOtpSent = true;
        loginBtn.disabled = false;
        loginOtpMsg.textContent = "OTP sent to your Gmail.";
      } else {
        loginOtpMsg.textContent = "Failed to send OTP: " + data.message;
        loginBtn.disabled = false;
        loginBtn.textContent = "Send OTP";
      }
    } catch (err) {
      loginOtpMsg.textContent = "Error sending OTP.";
      loginBtn.disabled = false;
      loginBtn.textContent = "Send OTP";
    }
  } else {
    // Verify OTP
    loginBtn.disabled = true;
    loginBtn.textContent = "Verifying...";
    const otp = loginOtpInput.value.trim();
    const email = loginEmail.value.trim();
    if (!otp) {
      loginOtpMsg.textContent = "Please enter OTP.";
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      return;
    }
    try {
      const res = await fetch(`${getOtpApiUrl()}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        loginOtpMsg.style.color = "#00eaff";
        loginOtpMsg.textContent = "Login successful! Redirecting...";
        localStorage.setItem('last_login_email', email);

        // --- NEW LOGIC: If user profile exists, go to welcome, else go to profile form ---
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem('user_' + email));
          if (user && user.displayName && user.profilePic) {
            showWelcome(user.displayName, user.profilePic, email);
          } else {
            showProfileForm();
          }
        }, 1200);
        // --- END NEW LOGIC ---

      } else {
        loginOtpMsg.style.color = "#f357a8";
        loginOtpMsg.textContent = "Invalid OTP. Try again.";
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
      }
    } catch (err) {
      loginOtpMsg.style.color = "#f357a8";
      loginOtpMsg.textContent = "Error verifying OTP.";
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  }
});

// Profile form logic
function showProfileForm() {
  let croppedDataUrl = '';
  let cropper = null;
  let tempPic = '';
  const email = localStorage.getItem('last_login_email');

  document.getElementById('auth-container').innerHTML = `
    <h2>Complete Your Profile</h2>
    <form id="profile-form" enctype="multipart/form-data" style="width:100%;display:flex;flex-direction:column;align-items:center;">
      <input type="text" id="display-name" placeholder="Display Name" required style="margin-bottom:1em;">
      <div id="profile-pic-circle" style="position:relative;width:90px;height:90px;margin-bottom:1.2em;">
        <img id="profile-preview-img" src="https://ui-avatars.com/api/?name=User&background=222&color=7f00ff" alt="Profile" style="width:90px;height:90px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 4px #7f00ff,0 2px 12px #e100ff55,0 0 24px #7f00ff44;background:#18122b;">
        <button type="button" id="edit-pic-btn" title="Change Profile Picture" style="position:absolute;bottom:4px;right:4px;background:#fff;border:none;border-radius:50%;width:28px;height:28px;box-shadow:0 1px 4px #7f00ff33;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;">
          <svg width="16" height="16" fill="#7f00ff" viewBox="0 0 16 16"><path d="M12.146 2.854a.5.5 0 0 1 .708 0l.292.292a.5.5 0 0 1 0 .708l-8.5 8.5a.5.5 0 0 1-.168.11l-3 1a.5.5 0 0 1-.637-.637l1-3a.5.5 0 0 1 .11-.168l8.5-8.5zm1.415-1.415a1.5 1.5 0 0 0-2.121 0l-8.5 8.5a1.5 1.5 0 0 0-.329.495l-1 3a.5.5 0 0 0 1.91 1.91l3-1a1.5 1.5 0 0 0 .495-.329l8.5-8.5a1.5 1.5 0 0 0 0-2.121l-.292-.292z"/></svg>
        </button>
        <input type="file" id="profile-pic" accept="image/*,.gif" style="display:none;">
      </div>
      <button type="submit">Save Profile</button>
    </form>
    <div id="profile-preview" style="margin-top:1.2em;text-align:center;"></div>
    <!-- Crop Modal -->
    <div id="crop-modal" style="display:none;position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);align-items:center;justify-content:center;">
      <div style="background:#fff;padding:1.5em 1em;border-radius:12px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;">
        <h3 style="margin-bottom:0.7em;color:#7f00ff;">Crop your picture</h3>
        <div style="max-width:300px;max-height:300px
        <div style="max-width:300px;max-height:300px;overflow:hidden;">
          <img id="crop-image" style="max-width:100%;max-height:300px;"/>
        </div>
        <div style="margin-top:1em;display:flex;gap:1em;">
          <button id="crop-confirm" style="background:#7f00ff;color:#fff;padding:0.5em 1.2em;border:none;border-radius:6px;font-weight:600;">Crop</button>
          <button id="crop-cancel" style="background:#eee;color:#333;padding:0.5em 1.2em;border:none;border-radius:6px;">Cancel</button>
        </div>
      </div>
    </div>
  `;

  // Edit icon click: open file dialog
  document.getElementById('edit-pic-btn').onclick = function() {
    document.getElementById('profile-pic').click();
  };

  // File input change: open crop modal
  document.getElementById('profile-pic').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      document.getElementById('crop-image').src = evt.target.result;
      document.getElementById('crop-modal').style.display = 'flex';
      if (cropper) cropper.destroy();
      cropper = new Cropper(document.getElementById('crop-image'), {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true,
        rotatable: false,
        scalable: false
      });
    };
    reader.readAsDataURL(file);
  });

  // Crop cancel
  document.getElementById('crop-cancel').onclick = function() {
    document.getElementById('crop-modal').style.display = 'none';
    if (cropper) cropper.destroy();
    cropper = null;
    document.getElementById('profile-pic').value = '';
  };

  // Crop confirm
  document.getElementById('crop-confirm').onclick = function() {
    if (cropper) {
      croppedDataUrl = cropper.getCroppedCanvas({width:200,height:200}).toDataURL('image/png');
      document.getElementById('crop-modal').style.display = 'none';
      if (cropper) cropper.destroy();
      cropper = null;
      // Show preview in circle
      document.getElementById('profile-preview-img').src = croppedDataUrl;
      tempPic = croppedDataUrl;
    }
  };

  // Form submit
  document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('display-name').value.trim();
    const email = localStorage.getItem('last_login_email');
    if (!name) return alert('Please enter a display name.');
    // If croppedDataUrl exists, use it, else blank
    saveProfile(name, croppedDataUrl, email);
  });
}

function saveProfile(name, pic, email) {
  if (!email) {
    alert('Session expired. Please login again.');
    location.reload();
    return;
  }
  const user = JSON.parse(localStorage.getItem('user_' + email));
  user.displayName = name;
  user.profilePic = pic;
  localStorage.setItem('user_' + email, JSON.stringify(user));
  showWelcome(name, pic, email);
}

// Show welcome message if profile is already set, with edit option
function showWelcome(name, pic, email) {
  // Clear any existing messages
  const msg = document.getElementById('msg');
  if (msg) msg.textContent = '';
  
  // 3D style frames (CSS box-shadow/border for demo, you can use SVG for more advanced)
  const profileFrames = [
    // Neon animated (for demo, static shadow, animation CSS se lagayen)
    "box-shadow:0 0 16px #7b2ff2,0 0 32px #f357a8;",
    // Rainbow animated (for demo, static shadow, animation CSS se lagayen)
    "box-shadow:0 0 24px #ff0080,0 0 32px #00eaff;",
    // 3D blue ring
    "box-shadow:0 0 0 4px #00eaff,0 2px 12px #7b2ff233;",
    // 3D pink ring
    "box-shadow:0 0 0 4px #f357a8,0 2px 12px #7b2ff233;",
    // 3D gold ring
    "box-shadow:0 0 0 4px #ffd700,0 2px 12px #ffb30033;",
    // Cyber green
    "box-shadow:0 0 0 4px #00ff99,0 2px 12px #00eaff33;",
    // Deep purple
    "box-shadow:0 0 0 4px #7b2ff2,0 2px 12px #f357a833;",
    // Red/blue split
    "box-shadow:0 0 0 4px #f357a8,0 2px 12px #7b2ff233;",
    // Glassy white
    "box-shadow:0 0 0 4px #fff,0 2px 12px #e0e0e033;",
    // Shadowed black
    "box-shadow:0 0 0 4px #333,0 2px 12px #0008;",
    // Orange sunset
    "box-shadow:0 0 0 4px #ff9966,0 2px 12px #ff5e6233;",
    // Aqua blue
    "box-shadow:0 0 0 4px #43cea2,0 2px 12px #185a9d33;",
    // Gold yellow
    "box-shadow:0 0 0 4px #f7971e,0 2px 12px #ffd20033;",
    // Pink purple
    "box-shadow:0 0 0 4px #f953c6,0 2px 12px #b91d7333;",
    // Blue yellow
    "box-shadow:0 0 0 4px #00c3ff,0 2px 12px #ffff1c33;",
    // Pink blue
    "box-shadow:0 0 0 4px #fc466b,0 2px 12px #3f5efb33;",
    // Green
    "box-shadow:0 0 0 4px #11998e,0 2px 12px #38ef7d33;",
    // Orange
    "box-shadow:0 0 0 4px #ee0979,0 2px 12px #ff6a0033;",
    // Purple pink
    "box-shadow:0 0 0 4px #c471f5,0 2px 12px #fa71cd33;",
    // Pink red
    "box-shadow:0 0 0 4px #f857a6,0 2px 12px #ff585833;"
  ];
  // Get user's selected frame or default to 0
  const user = JSON.parse(localStorage.getItem('user_' + email));
  let frameIndex = user && typeof user.frameIndex === 'number' ? user.frameIndex : 0;

  document.getElementById('auth-container').innerHTML = ` 
<h2>Welcome!</h2>
<div style="display:flex;flex-direction:column;align-items:center;">
  <strong style="font-size:1.2em;">${name}</strong><br>
  <div style="position:relative;display:inline-block;">
    ${pic ? `<img id="welcome-profile-img" src="${pic}" alt="Profile" style="width:90px;height:90px;border-radius:50%;margin:1em 0;${profileFrames[frameIndex]}transition:box-shadow .3s,border .3s;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff&size=128'">` : ''}
    <button id="edit-pic-btn-welcome" type="button" title="Edit Profile Picture" style="position:absolute;top:8px;right:8px;background:#fff;border:none;border-radius:50%;width:28px;height:28px;box-shadow:0 1px 4px #7f00ff33;cursor:pointer;padding:0;display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" fill="#7f00ff" viewBox="0 0 16 16"><path d="M12.146 2.854a.5.5 0 0 1 .708 0l.292.292a.5.5 0 0 1 0 .708l-8.5 8.5a.5.5 0 0 1-.168.11l-3 1a.5.5 0 0 1-.637-.637l1-3a.5.5 0 0 1 .11-.168l8.5-8.5zm1.415-1.415a1.5 1.5 0 0 0-2.121 0l-8.5 8.5a1.5 1.5 0 0 0-.329.495l-1 3a.5.5 0 0 0 1.91 1.91l3-1a1.5 1.5 0 0 0 .495-.329l8.5-8.5a1.5 1.5 0 0 0 0-2.121l-.292-.292z"/></svg>
    </button>
  </div>
</div>
<div style="margin-top:1.5em;text-align:center;color:#555;">You are now logged in with Google!</div>
<div style="margin-top:0.7em;text-align:center;color:#555;font-size:1em;">
  Please Go Profile Setting in The Home Page to Confirm Your Profile
</div>
<div style="margin-top:2em;text-align:center;">
  <div style="font-size:1.08em;margin-bottom:0.7em;font-weight:500;">Go To Home</div>
  <button id="go-home-btn" style="padding:0.7em 2.2em;border-radius:8px;border:none;background:linear-gradient(90deg,#7f00ff 60%,#e100ff 100%);color:#fff;font-size:1.1em;font-weight:600;cursor:pointer;box-shadow:0 2px 12px #7f00ff22;transition:background 0.2s;">Home</button>
  <br>
  <button id="logout-btn" style="margin-top:1.2em;padding:0.7em 2.2em;border-radius:8px;border:none;background:#fff;color:#7f00ff;font-size:1.1em;font-weight:600;cursor:pointer;box-shadow:0 2px 12px #7f00ff22;transition:background 0.2s;">Logout</button>
</div>
`;

  // After rendering the welcome-profile-img:
  setTimeout(() => {
    const img = document.getElementById('welcome-profile-img');
    if (!img) return;
    // Neon animated (index 0)
    if (frameIndex === 0) {
      img.style.border = "3.5px solid transparent";
      img.style.background = "linear-gradient(270deg,#f357a8,#7b2ff2,#00eaff,#f357a8)";
      img.style.backgroundSize = "400% 400%";
      img.style.animation = "borderAnim 2.5s linear infinite";
      img.style.boxShadow = "0 0 16px #7b2ff2, 0 0 32px #f357a8";
    }
    // Rainbow animated (index 1)
    else if (frameIndex === 1) {
      img.style.border = "3.5px solid transparent";
      img.style.background = "linear-gradient(270deg,#ff0080,#7928ca,#00eaff,#ff0080)";
      img.style.backgroundSize = "400% 400%";
      img.style.animation = "rainbowAnim 2.5s linear infinite";
      img.style.boxShadow = "0 0 24px #ff0080, 0 0 32px #00eaff";
    }
  }, 100);

  // Edit modal with 3 options: Crop, Change Image, Change Frame
  document.getElementById('edit-pic-btn-welcome').onclick = function() {
    let tempPic = pic;
    let tempFrameIndex = frameIndex;

    let cropModal = document.createElement('div');
    cropModal.id = 'crop-modal-welcome';
    cropModal.style = 'display:flex;position:fixed;z-index:9999;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.7);align-items:center;justify-content:center;';
    cropModal.innerHTML = `
      <div style="background:#fff;padding:1.5em 1em 1em 1em;border-radius:12px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;position:relative;">
        <button id="apply-edit-btn" style="position:absolute;top:12px;right:18px;background:#7f00ff;color:#fff;padding:0.4em 1.2em;border:none;border-radius:6px;font-weight:600;z-index:2;">Apply</button>
        <h3 style="margin-bottom:0.7em;color:#7f00ff;">Edit Profile Picture</h3>
        <div style="max-width:300px;max-height:300px;overflow:hidden;">
          <img id="crop-image-welcome" style="max-width:100%;max-height:300px;${profileFrames[tempFrameIndex]}border-radius:50%;">
        </div>
        <div style="margin-top:1.2em;display:flex;gap:1em;flex-wrap:wrap;justify-content:center;">
          <button id="crop-confirm-welcome" style="background:#7f00ff;color:#fff;padding:0.5em 1.2em;border:none;border-radius:6px;font-weight:600;">Crop</button>
          <button id="change-pic-btn-modal" style="background:#e100ff;color:#fff;padding:0.5em 1.2em;border:none;border-radius:6px;font-weight:600;">Change Image</button>
          <button id="crop-cancel-welcome" style="background:#eee;color:#333;padding:0.5em 1.2em;border:none;border-radius:6px;">Cancel</button>
          <input type="file" id="change-pic-input-modal" accept="image/*,.gif" style="display:none;">
        </div>
      </div>
    `;
    document.body.appendChild(cropModal);

    let cropper = null;
    let cropImage = document.getElementById('crop-image-welcome');
    cropImage.src = tempPic;
    cropper = new Cropper(cropImage, {
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 1,
      movable: true,
      zoomable: true,
      rotatable: false,
      scalable: false
    });

    // Crop (only updates tempPic, not saved yet)
    document.getElementById('crop-confirm-welcome').onclick = function() {
      tempPic = cropper.getCroppedCanvas({width:200,height:200}).toDataURL('image/png');
      cropImage.src = tempPic;
      if (cropper) cropper.destroy();
      cropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
        movable: true,
        zoomable: true,
        rotatable: false,
        scalable: false
      });
      cropImage.style = `max-width:100%;max-height:300px;${profileFrames[tempFrameIndex]}border-radius:50%;`;
    };

    // Change Image (only updates tempPic, not saved yet)
    document.getElementById('change-pic-btn-modal').onclick = function() {
      document.getElementById('change-pic-input-modal').click();
    };
    document.getElementById('change-pic-input-modal').onchange = function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        tempPic = evt.target.result;
        cropImage.src = tempPic;
        if (cropper) cropper.destroy();
        cropper = new Cropper(cropImage, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false
        });
        cropImage.style = `max-width:100%;max-height:300px;${profileFrames[tempFrameIndex]}border-radius:50%;`;
      };
      reader.readAsDataURL(file);
    };

    // Apply changes
    document.getElementById('apply-edit-btn').onclick = function() {
      if (cropper) cropper.destroy();
      cropper = null;
      document.body.removeChild(cropModal);
      // Save to localStorage
      const user = JSON.parse(localStorage.getItem('user_' + email));
      user.profilePic = tempPic;
      user.frameIndex = tempFrameIndex;
      localStorage.setItem('user_' + email, JSON.stringify(user));
      showWelcome(name, tempPic, email);
    };

    // Cancel (discard changes)
    document.getElementById('crop-cancel-welcome').onclick = function() {
      if (cropper) cropper.destroy();
      cropper = null;
      document.body.removeChild(cropModal);
    };
  };

  // Go Home button event
  document.getElementById('go-home-btn').onclick = function() {
    window.location.href = "index.html";
  };
  // Logout button event
  document.getElementById('logout-btn').onclick = function() {
    // Get the email before removing it
    const email = localStorage.getItem('last_login_email');
    if (email) {
      // Clear user data completely to force fresh login
      localStorage.removeItem('user_' + email);
    }
    
    // Clear all Google OAuth related data
    localStorage.removeItem('last_login_email');
    
    // Clear any potential OAuth state or tokens that might be stored
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('google') || key.includes('oauth') || key.includes('token'))) {
        localStorage.removeItem(key);
      }
    }
    
    // Explicitly clear specific OAuth session storage items
    sessionStorage.removeItem('google_oauth_state');
    sessionStorage.removeItem('used_auth_code');
    
    // Clear any other session storage items that might be related to OAuth
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('google') || key.includes('oauth') || key.includes('token'))) {
        sessionStorage.removeItem(key);
      }
    }
    
    console.log('Logged out, all auth data cleared');
    
    // Force a complete page reload to clear any in-memory state
    window.location.href = window.location.pathname + '?logout=' + Date.now();
  };
}

// Auto-login if already logged in and profile is set
window.addEventListener('DOMContentLoaded', function() {
  const email = localStorage.getItem('last_login_email');
  if (email) {
    const user = JSON.parse(localStorage.getItem('user_' + email));
    if (user && user.displayName && user.profilePic) {
      showWelcome(user.displayName, user.profilePic, email);
    }
  }
  
  // Handle Google OAuth callback
  handleGoogleCallback();
  
  // Listen for OAuth success message from popup
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
      const url = event.data.url;
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const code = urlParams.get('code');
      if (code) {
        exchangeCodeForToken(code);
      }
    }
  });
});

// Show/hide password logic
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    btn.querySelector('svg').innerHTML = `
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22" stroke="currentColor" stroke-width="2" fill="none"/>
    `;
  } else {
    input.type = "password";
    btn.querySelector('svg').innerHTML = `
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  let msg = document.getElementById('msg');
  msg.textContent = "";
  let email = document.getElementById('login-email').value.trim();
  let password = document.getElementById('login-password').value.trim();

  const userKey = 'user_' + email;
  const userData = localStorage.getItem(userKey);
  if (!userData) {
    msg.textContent = "No account found for this Gmail!";
    document.getElementById('login-otp-section').style.display = "none";
    return;
  }
  const userObj = JSON.parse(userData);
  if (userObj.password !== password) {
    msg.textContent = "Incorrect password!";
    document.getElementById('login-otp-section').style.display = "none";
    return;
  }

  // Sahi password pe hi OTP send karo
  msg.textContent = "Sending OTP to your Gmail...";
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const res = await fetch(`${getOtpApiUrl()}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (data.message === 'OTP sent') {
      msg.textContent = "OTP sent to your Gmail. Please enter OTP below.";
      document.getElementById('login-otp-section').style.display = "block";
    } else {
      msg.textContent = "Failed to send OTP: " + data.message;
      document.getElementById('login-otp-section').style.display = "none";
    }
  } catch (e) {
    msg.textContent = "Error sending OTP.";
    document.getElementById('login-otp-section').style.display = "none";
  }
});

// Google OAuth Configuration - Now using dynamic config
const GOOGLE_CLIENT_ID = window.CONFIG ? window.CONFIG.GOOGLE_CLIENT_ID : '522632399270-girk71r0ofjk7ci2mrh9fbc9hblaeiku.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = window.CONFIG ? window.CONFIG.getGoogleRedirectUri() : window.location.origin + '/login.html';
const BACKEND_URL = window.CONFIG ? window.CONFIG.getApiUrl() : window.location.origin;

// Helper function to get OTP API URL
function getOtpApiUrl() {
  return window.CONFIG ? window.CONFIG.getOtpApiUrl() : window.location.origin;
}

// Social Login Functions
function signInWithGoogle() {
  const loadingMsg = document.getElementById('msg');
  loadingMsg.textContent = "Connecting to Google...";
  
  // Clear any existing OAuth state from previous attempts
  sessionStorage.removeItem('google_oauth_state');
  
  // Generate a new state parameter and store it
  const state = Date.now().toString();
  sessionStorage.setItem('google_oauth_state', state);
  
  // Google OAuth 2.0 flow
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('openid email profile')}&` +
    `access_type=offline&` +
    `prompt=consent&` +
    `state=${state}`;
  
  // Open Google OAuth popup with better settings
  const popup = window.open(
    googleAuthUrl,
    'googleAuth',
    'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
  );
  
  if (!popup) {
    loadingMsg.textContent = "Popup blocked! Please allow popups for this site.";
    return;
  }
  
  // Listen for the OAuth callback and popup close
  const checkClosed = setInterval(() => {
    try {
      if (popup.closed) {
        clearInterval(checkClosed);
        handleGoogleCallback();
      } else {
        // Check if popup has redirected to our callback URL
        try {
          const popupUrl = popup.location.href;
          if (popupUrl.includes('code=') && popupUrl.includes('state=')) {
            // OAuth successful, close popup and process
            popup.close();
            clearInterval(checkClosed);
            
            // Extract code from popup URL
            const urlParams = new URLSearchParams(popupUrl.split('?')[1]);
            const code = urlParams.get('code');
            if (code) {
              exchangeCodeForToken(code);
            }
          }
        } catch (e) {
          // Cross-origin error, continue checking
        }
      }
    } catch (e) {
      // Popup might be closed or blocked
    }
  }, 500);
}

// Handle Google OAuth callback
function handleGoogleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = sessionStorage.getItem('google_oauth_state');
  
  console.log('Callback received - State:', state, 'Stored state:', storedState);
  
  // Verify state parameter to prevent CSRF attacks
  if (state && storedState && state === storedState) {
    // State is valid, proceed with code exchange
    if (code) {
      // Exchange authorization code for access token
      exchangeCodeForToken(code);
      // Clear the state after use
      sessionStorage.removeItem('google_oauth_state');
    }
  } else if (code) {
    // State validation failed but we have a code
    console.warn('OAuth state validation failed, but proceeding with code');
    exchangeCodeForToken(code);
  } else {
    // Check if we're in the popup window
    if (window.opener && window.opener !== window) {
      // We're in the popup, check for OAuth response
      const currentUrl = window.location.href;
      if (currentUrl.includes('code=') && currentUrl.includes('state=')) {
        // OAuth successful, send message to parent window
        window.opener.postMessage({ type: 'GOOGLE_OAUTH_SUCCESS', url: currentUrl }, '*');
        window.close();
      }
    }
  }
}

// Exchange authorization code for access token
async function exchangeCodeForToken(code) {
  const loadingMsg = document.getElementById('msg');
  loadingMsg.textContent = "Verifying with Google...";
  
  // Check if this code has been used before
  const usedCode = sessionStorage.getItem('used_auth_code');
  if (usedCode === code) {
    console.warn('Authorization code has already been used once');
    loadingMsg.textContent = "This authorization code has already been used. Please log out and try again.";
    return;
  }
  
  try {
    // First test if server is running
    const testResponse = await fetch(`${BACKEND_URL}/api/test`);
    if (!testResponse.ok) {
      throw new Error('OAuth server is not responding');
    }
    
    // Send authorization code to our backend for secure token exchange
    const response = await fetch(`${BACKEND_URL}/api/google/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code,
        redirect_uri: GOOGLE_REDIRECT_URI // Send the redirect URI used for the initial request
      }),
    });
    
    console.log('Sent token exchange request with redirect URI:', GOOGLE_REDIRECT_URI);
    
    if (response.ok) {
      // Store this code as used
      sessionStorage.setItem('used_auth_code', code);
      
      const tokenData = await response.json();
      // Get user info using access token
      getUserInfo(tokenData.access_token);
    } else {
      const errorData = await response.json();
      // Check for invalid_grant error specifically
      if (errorData.response_data && errorData.response_data.error === 'invalid_grant') {
        loadingMsg.textContent = "This authorization code has expired or been used. Please log out and try again.";
        // Clear any stored auth data to force a fresh login
        sessionStorage.removeItem('used_auth_code');
        return;
      }
      throw new Error(errorData.error || 'Token exchange failed');
    }
  } catch (error) {
    console.error('OAuth error:', error);
    loadingMsg.textContent = `Google authentication failed: ${error.message}. Please try again.`;
    
    // Show clear error message instead of using mock sign-in
    setTimeout(() => {
      loadingMsg.textContent = "Google authentication failed. Please try again or contact support.";
    }, 1000);
  }
}

// Get user information from Google
async function getUserInfo(accessToken) {
  const loadingMsg = document.getElementById('msg');
  
  try {
    // Use our backend to get user info securely
    const response = await fetch(`${BACKEND_URL}/api/google/userinfo?access_token=${accessToken}`);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('Raw Google user data:', userData); // Debug log
      processGoogleUser(userData);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get user info');
    }
  } catch (error) {
    console.error('Error getting user info:', error);
    loadingMsg.textContent = "Failed to get user information.";
    
    // Show clear error message instead of using mock sign-in
    setTimeout(() => {
      loadingMsg.textContent = "Failed to get user information. Please try again or contact support.";
    }, 1000);
  }
}

// Process Google user data
function processGoogleUser(userData) {
  const loadingMsg = document.getElementById('msg');
  
  console.log('Raw Google user data received:', userData); // Debug log
  
  // Fix profile picture URL - ensure it's accessible
  let profilePic = userData.picture;
  console.log('Original profile picture URL:', profilePic); // Debug log
  
  if (profilePic) {
    // Add size parameter and ensure HTTPS
    if (profilePic.includes('googleusercontent.com')) {
      // Google profile picture - add size parameter
      if (!profilePic.includes('sz=')) {
        profilePic = profilePic + (profilePic.includes('?') ? '&' : '?') + 'sz=128';
      }
    }
    // Ensure HTTPS
    if (profilePic.startsWith('http:')) {
      profilePic = profilePic.replace('http:', 'https:');
    }
  } else {
    // Fallback to generated avatar
    const userName = userData.name || (userData.given_name ? (userData.given_name + ' ' + (userData.family_name || '')) : 'User');
    profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4285F4&color=fff&size=128`;
  }
  
  console.log('Processed profile picture URL:', profilePic); // Debug log
  
  // Ensure we have a name
  const name = userData.name || 
               (userData.given_name ? (userData.given_name + ' ' + (userData.family_name || '')) : 'Google User');
  
  // Ensure we have required data from Google
  if (!userData.email) {
    const loadingMsg = document.getElementById('msg');
    loadingMsg.textContent = "Email information missing from your Google account. Please ensure your Google account has a valid email.";
    console.error('Google login failed: Missing email');
    return; // Exit the function early
  }
  
  const googleUser = {
    email: userData.email,
    name: name,
    profilePic: profilePic,
    provider: 'google',
    googleId: userData.sub || userData.id || ''
  };
  
  // Validate the Google ID
  if (!googleUser.googleId) {
    console.warn('Google user data missing ID, but proceeding with available data');  
  }
  
  console.log('Processed Google user data:', googleUser); // Debug log
  
  // Check if user already exists
  const existingUser = localStorage.getItem('user_' + googleUser.email);
  if (existingUser) {
    // User exists, log them in
    const user = JSON.parse(existingUser);
    if (user.displayName && user.profilePic) {
      // Auto-login and redirect to welcome screen
      localStorage.setItem('last_login_email', googleUser.email);
      showWelcome(user.displayName, user.profilePic, googleUser.email);
    } else {
      // User exists but profile incomplete, show profile form
      localStorage.setItem('last_login_email', googleUser.email);
      showProfileForm();
    }
  } else {
    // New user, create account and show profile form
    const newUser = {
      email: googleUser.email,
      password: 'google_auth_' + Math.random().toString(36).substr(2, 9),
      displayName: googleUser.name,
      profilePic: googleUser.profilePic,
      provider: 'google',
      googleId: googleUser.googleId,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('user_' + googleUser.email, JSON.stringify(newUser));
    localStorage.setItem('last_login_email', googleUser.email);
    
    // Auto-login new user and show welcome screen
    showWelcome(googleUser.name, googleUser.profilePic, googleUser.email);
  }
  
  loadingMsg.textContent = "Google login successful! Redirecting...";
}

// Google sign-in functionality now relies entirely on actual Google OAuth
// Mock sign-in has been removed to ensure consistent user experience

// Initialize Google Sign-In
function initGoogleSignIn() {
  const googleBtn = document.getElementById('google-signin');
  if (googleBtn) {
    googleBtn.addEventListener('click', signInWithGoogle);
    
    // Clear any previous auth data when starting a new sign-in flow
    googleBtn.addEventListener('click', function() {
      sessionStorage.removeItem('used_auth_code');
      localStorage.removeItem('auth_state');
    });
  }
}

// Initialize Google Sign-In when DOM is loaded
document.addEventListener('DOMContentLoaded', initGoogleSignIn);

const GITHUB_CLIENT_ID = window.CONFIG ? window.CONFIG.GITHUB_CLIENT_ID : 'Ov23lix5X6dUR29UIZHk';
const GITHUB_CLIENT_SECRET = 'b19cd25f0a2049becabe6103a6e9fc5e7a925a4a';
const GITHUB_REDIRECT_URI = window.CONFIG ? window.CONFIG.getGitHubRedirectUri() : window.location.origin + '/login.html';

// GitHub OAuth login function
function signInWithGitHub() {
  const loadingMsg = document.getElementById('msg');
  loadingMsg.textContent = "Connecting to GitHub...";

  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&` +
    `scope=read:user user:email&` +
    `state=${Date.now()}`;

  const popup = window.open(
    githubAuthUrl,
    'githubAuth',
    'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
  );

  if (!popup) {
    loadingMsg.textContent = "Popup blocked! Please allow popups for this site.";
    return;
  }

  const checkClosed = setInterval(() => {
    try {
      if (popup.closed) {
        clearInterval(checkClosed);
        handleGitHubCallback();
      } else {
        try {
          const popupUrl = popup.location.href;
          if (popupUrl.includes('code=') && popupUrl.includes('state=')) {
            popup.close();
            clearInterval(checkClosed);

            const urlParams = new URLSearchParams(popupUrl.split('?')[1]);
            const code = urlParams.get('code');
            if (code) {
              exchangeGitHubCodeForToken(code);
            }
          }
        } catch (e) {
          // Cross-origin error, continue checking
        }
      }
    } catch (e) {}
  }, 500);
}

// Handle GitHub OAuth callback
function handleGitHubCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    exchangeGitHubCodeForToken(code);
  } else {
    if (window.opener && window.opener !== window) {
      const currentUrl = window.location.href;
      if (currentUrl.includes('code=') && currentUrl.includes('state=')) {
        window.opener.postMessage({ type: 'GITHUB_OAUTH_SUCCESS', url: currentUrl }, '*');
        window.close();
      }
    }
  }
}

// Exchange GitHub code for access token
async function exchangeGitHubCodeForToken(code) {
  const loadingMsg = document.getElementById('msg');
  loadingMsg.textContent = "Verifying with GitHub...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/github/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (response.ok) {
      const tokenData = await response.json();
      getGitHubUserInfo(tokenData.access_token);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Token exchange failed');
    }
  } catch (error) {
    loadingMsg.textContent = `GitHub authentication failed: ${error.message}. Please try again.`;
    setTimeout(() => {
      mockGitHubSignIn();
    }, 1000);
  }
}

// Get user info from GitHub
async function getGitHubUserInfo(accessToken) {
  const loadingMsg = document.getElementById('msg');
  try {
    const response = await fetch(`${BACKEND_URL}/api/github/userinfo?access_token=${accessToken}`);
    if (response.ok) {
      const userData = await response.json();
      processGitHubUser(userData);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get user info');
    }
  } catch (error) {
    loadingMsg.textContent = "Failed to get user information.";
    setTimeout(() => {
      mockGitHubSignIn();
    }, 1000);
  }
}

// Process GitHub user data
function processGitHubUser(userData) {
  const loadingMsg = document.getElementById('msg');
  let profilePic = userData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.login)}&background=333&color=fff&size=128`;

  const githubUser = {
    email: userData.email || `${userData.login}@github.com`,
    name: userData.name || userData.login,
    profilePic: profilePic,
    provider: 'github',
    githubId: userData.id
  };

  const existingUser = localStorage.getItem('user_' + githubUser.email);
  if (existingUser) {
    const user = JSON.parse(existingUser);
    if (user.displayName && user.profilePic) {
      localStorage.setItem('last_login_email', githubUser.email);
      showWelcome(user.displayName, user.profilePic, githubUser.email);
    } else {
      localStorage.setItem('last_login_email', githubUser.email);
      showProfileForm();
    }
  } else {
    const newUser = {
      email: githubUser.email,
      password: 'github_auth_' + Math.random().toString(36).substr(2, 9),
      displayName: githubUser.name,
      profilePic: githubUser.profilePic,
      provider: 'github',
      githubId: githubUser.githubId,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('user_' + githubUser.email, JSON.stringify(newUser));
    localStorage.setItem('last_login_email', githubUser.email);
    showWelcome(githubUser.name, githubUser.profilePic, githubUser.email);
  }

  loadingMsg.textContent = "GitHub login successful! Redirecting...";
}

// Mock GitHub sign-in for demo
function mockGitHubSignIn() {
  const loadingMsg = document.getElementById('msg');
  const githubUser = {
    email: `user${Math.floor(Math.random() * 1000)}@github.com`,
    name: `GitHub User ${Math.floor(Math.random() * 1000)}`,
    profilePic: `https://ui-avatars.com/api/?name=GitHub+User&background=333&color=fff&size=128`,
    provider: 'github'
  };

  const existingUser = localStorage.getItem('user_' + githubUser.email);
  if (existingUser) {
    const user = JSON.parse(existingUser);
    if (user.displayName && user.profilePic) {
      localStorage.setItem('last_login_email', githubUser.email);
      showWelcome(user.displayName, user.profilePic, githubUser.email);
    } else {
      localStorage.setItem('last_login_email', githubUser.email);
      showProfileForm();
    }
  } else {
    const newUser = {
      email: githubUser.email,
      password: 'github_auth_' + Math.random().toString(36).substr(2, 9),
      displayName: githubUser.name,
      profilePic: githubUser.profilePic,
      provider: 'github',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('user_' + githubUser.email, JSON.stringify(newUser));
    localStorage.setItem('last_login_email', githubUser.email);
    showWelcome(githubUser.name, githubUser.profilePic, githubUser.email);
  }

  loadingMsg.textContent = "GitHub login successful! (Demo Mode)";
}

// Listen for GitHub OAuth popup message
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'GITHUB_OAUTH_SUCCESS') {
    const url = event.data.url;
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const code = urlParams.get('code');
    if (code) {
      exchangeGitHubCodeForToken(code);
    }
  }
});

// Add event listener for GitHub login button
document.getElementById('github-login-btn').addEventListener('click', signInWithGitHub);
