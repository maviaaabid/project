// All JS from <script> tag in setting.html goes here

// Helper function to get OTP API URL
function getOtpApiUrl() {
  return window.CONFIG ? window.CONFIG.getOtpApiUrl() : window.location.origin;
}

// Load user data from localStorage
const email = localStorage.getItem('last_login_email');
let user = email ? localStorage.getItem('user_' + email) : null;
let userObj = user ? JSON.parse(user) : {name:'', email:'', profilePic:'', password:''};

// Get frame index from localStorage (global key preferred)
let frameIndex = 0;
if (localStorage.getItem('profileFrameIndex')) {
  frameIndex = parseInt(localStorage.getItem('profileFrameIndex'), 10);
} else if (typeof userObj.frameIndex === 'number') {
  frameIndex = userObj.frameIndex;
}

// Set initial values
document.getElementById('profilePicPreview').src = userObj.profilePic || 'https://ui-avatars.com/api/?name=User&background=222&color=7b2ff2';
document.getElementById('nameInput').value = userObj.displayName || userObj.name || '';
document.getElementById('emailInput').value = userObj.email || '';

// Gaming, 3D & animated frames
const frames = [
  "animated-gradient",
  "animated-rainbow",
  "conic-gradient(from 180deg at 50% 50%, #00eaff 0deg, #7b2ff2 120deg, #222 360deg)",
  "conic-gradient(from 90deg at 50% 50%, #f357a8 0deg, #7b2ff2 120deg, #222 360deg)",
  "conic-gradient(from 0deg at 50% 50%, #ffd700 0deg, #ffb300 120deg, #fffbe6 360deg)",
  "linear-gradient(135deg,#00ff99 0%,#00eaff 100%)",
  "linear-gradient(135deg,#7b2ff2 0%,#f357a8 100%)",
  "linear-gradient(90deg,#f357a8 50%,#7b2ff2 50%)",
  "radial-gradient(circle at 50% 50%, #fff 60%, #e0e0e0 100%)",
  "radial-gradient(circle at 60% 40%, #333 60%, #000 100%)",
  "linear-gradient(135deg,#ff9966 0%,#ff5e62 100%)",
  "linear-gradient(135deg,#43cea2 0%,#185a9d 100%)",
  "linear-gradient(135deg,#f7971e 0%,#ffd200 100%)",
  "linear-gradient(135deg,#f953c6 0%,#b91d73 100%)",
  "linear-gradient(135deg,#00c3ff 0%,#ffff1c 100%)",
  "linear-gradient(135deg,#fc466b 0%,#3f5efb 100%)",
  "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)",
  "linear-gradient(135deg,#ee0979 0%,#ff6a00 100%)",
  "linear-gradient(135deg,#c471f5 0%,#fa71cd 100%)",
  "linear-gradient(135deg,#f857a6 0%,#ff5858 100%)"
];

// Helper: animated frame CSS
function setAnimatedBorder(el, type = "neon") {
  if (type === "neon") {
    el.style.border = "3.5px solid transparent";
    el.style.background = "linear-gradient(270deg,#f357a8,#7b2ff2,#00eaff,#f357a8)";
    el.style.backgroundSize = "400% 400%";
    el.style.animation = "borderAnim 2.5s linear infinite";
    el.style.boxShadow = "0 0 16px #7b2ff2, 0 0 32px #f357a8";
  } else if (type === "rainbow") {
    el.style.border = "3.5px solid transparent";
    el.style.background = "linear-gradient(270deg,#ff0080,#7928ca,#00eaff,#ff0080)";
    el.style.backgroundSize = "400% 400%";
    el.style.animation = "rainbowAnim 2.5s linear infinite";
    el.style.boxShadow = "0 0 24px #ff0080, 0 0 32px #00eaff";
  }
}
function removeAnimatedBorder(el) {
  el.style.animation = "";
  el.style.background = "";
  el.style.boxShadow = "";
}

// Helper: get border from frame gradient
function getFrameBorder(frame, el) {
  if (frame === "animated-gradient") {
    setAnimatedBorder(el, "neon");
    return "3.5px solid transparent";
  }
  if (frame === "animated-rainbow") {
    setAnimatedBorder(el, "rainbow");
    return "3.5px solid transparent";
  }
  removeAnimatedBorder(el);
  if (!frame) return "#7b2ff2";
  if (frame.startsWith("conic-gradient") || frame.startsWith("radial-gradient") || frame.startsWith("linear-gradient")) {
    el.style.background = frame;
    el.style.boxShadow = "0 0 12px #0008";
    return "3.5px solid transparent";
  }
  // fallback
  const match = frame.match(/#([0-9a-fA-F]{3,8})/);
  return match ? `3.5px solid ${match[0]}` : "3.5px solid #7b2ff2";
}

let tempPic = null;
let tempFrame = null;

// Show edit modal on edit icon click
document.getElementById('editPicBtn').onclick = function() {
  tempPic = document.getElementById('profilePicPreview').src;
  tempFrame = localStorage.getItem('profileFrame') || '';
  document.getElementById('modalPicPreview').src = tempPic;
  if (tempFrame === "animated-gradient") {
    setAnimatedBorder(document.getElementById('modalPicPreview'));
    document.getElementById('modalPicPreview').style.border = "3px solid transparent";
  } else {
    removeAnimatedBorder(document.getElementById('modalPicPreview'));
    document.getElementById('modalPicPreview').style.border = `3px solid ${getFrameBorder(tempFrame, document.getElementById('modalPicPreview'))}`;
  }
  document.getElementById('editPicModal').style.display = 'flex';
};

// Change image option
document.getElementById('changePicBtn').onclick = function() {
  document.getElementById('profilePicInput').click();
};

// When image changes in modal, update tempPic and modal preview only
document.getElementById('profilePicInput').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(evt){
      tempPic = evt.target.result;
      document.getElementById('modalPicPreview').src = tempPic;
      if (tempFrame === "animated-gradient") {
        setAnimatedBorder(document.getElementById('modalPicPreview'));
        document.getElementById('modalPicPreview').style.border = "3px solid transparent";
      } else {
        removeAnimatedBorder(document.getElementById('modalPicPreview'));
        document.getElementById('modalPicPreview').style.border = `3px solid ${getFrameBorder(tempFrame, document.getElementById('modalPicPreview'))}`;
      }
    }
    reader.readAsDataURL(file);
  }
});

// Render frames
const frameList = document.getElementById('frameList');
frameList.innerHTML = '';
frames.forEach((frame, idx) => {
  const btn = document.createElement('button');
  btn.type = "button";
  btn.title = "Select Frame";
  if (frame === "animated-gradient") {
    btn.style.background = "linear-gradient(270deg,#f357a8,#7b2ff2,#00eaff,#f357a8)";
    btn.style.backgroundSize = "400% 400%";
    btn.style.animation = "borderAnim 2.5s linear infinite";
    btn.style.border = "2.5px solid transparent";
    btn.innerHTML = '<span style="font-size:1.2em;">✨</span>';
  } else if (frame === "animated-rainbow") {
    btn.style.background = "linear-gradient(270deg,#ff0080,#7928ca,#00eaff,#ff0080)";
    btn.style.backgroundSize = "400% 400%";
    btn.style.animation = "rainbowAnim 2.5s linear infinite";
    btn.style.border = "2.5px solid transparent";
    btn.innerHTML = '<span style="font-size:1.2em;">🌈</span>';
  } else if (frame.startsWith("conic-gradient")) {
    btn.style.background = frame;
    btn.style.border = "2.5px solid transparent";
    btn.innerHTML = '<span style="font-size:1.2em;">🌀</span>';
  } else if (frame.startsWith("radial-gradient")) {
    btn.style.background = frame;
    btn.style.border = "2.5px solid transparent";
    btn.innerHTML = '<span style="font-size:1.2em;">⚪</span>';
  } else {
    btn.style.background = frame;
  }
  btn.onclick = function() {
    tempFrame = frame;
    Array.from(frameList.children).forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    if (frame === "animated-gradient") {
      setAnimatedBorder(document.getElementById('modalPicPreview'), "neon");
      document.getElementById('modalPicPreview').style.border = "3px solid transparent";
    } else if (frame === "animated-rainbow") {
      setAnimatedBorder(document.getElementById('modalPicPreview'), "rainbow");
      document.getElementById('modalPicPreview').style.border = "3px solid transparent";
    } else if (frame.startsWith("conic-gradient") || frame.startsWith("radial-gradient") || frame.startsWith("linear-gradient")) {
      removeAnimatedBorder(document.getElementById('modalPicPreview'));
      document.getElementById('modalPicPreview').style.background = frame;
      document.getElementById('modalPicPreview').style.border = "3px solid transparent";
      document.getElementById('modalPicPreview').style.boxShadow = "0 0 12px #0008";
    } else {
      removeAnimatedBorder(document.getElementById('modalPicPreview'));
      document.getElementById('modalPicPreview').style.border = `3px solid ${getFrameBorder(tempFrame, document.getElementById('modalPicPreview'))}`;
    }
  };
  frameList.appendChild(btn);
});

// Apply button: turant save karo
document.getElementById('applyPicBtn').onclick = function() {
  if(tempPic) {
    document.getElementById('profilePicPreview').src = tempPic;
    userObj.profilePic = tempPic;
  }
  if(tempFrame) {
    if (tempFrame === "animated-gradient") {
      setAnimatedBorder(document.getElementById('profilePicPreview'));
      document.getElementById('profilePicPreview').style.border = "3.5px solid transparent";
    } else {
      removeAnimatedBorder(document.getElementById('profilePicPreview'));
      document.getElementById('profilePicPreview').style.border = `3.5px solid ${getFrameBorder(tempFrame, document.getElementById('profilePicPreview'))}`;
    }
    localStorage.setItem('profileFrame', tempFrame);
    localStorage.setItem('profileFrameIndex', frameIndex);
  }
  // Save to localStorage (user object)
  localStorage.setItem('user_' + userObj.email, JSON.stringify(userObj));
  document.getElementById('editPicModal').style.display = 'none';
};

// On page load, set main preview border from frame
(function(){
  const frame = localStorage.getItem('profileFrame');
  if(frame) {
    if (frame === "animated-gradient") {
      setAnimatedBorder(document.getElementById('profilePicPreview'));
      document.getElementById('profilePicPreview').style.border = "3.5px solid transparent";
    } else {
      removeAnimatedBorder(document.getElementById('profilePicPreview'));
      document.getElementById('profilePicPreview').style.border = `3.5px solid ${getFrameBorder(frame, document.getElementById('profilePicPreview'))}`;
    }
  }
})();

// Save Changes
document.getElementById('settingsForm').addEventListener('submit', function(e){
  e.preventDefault();
  const msg = document.getElementById('msg');
  msg.textContent = '';
  msg.className = '';

  // Get new values
  const newName = document.getElementById('nameInput').value.trim();
  const newEmail = document.getElementById('emailInput').value.trim();
  const oldPassword = document.getElementById('oldPasswordInput').value;
  const newPassword = document.getElementById('passwordInput').value;
  const newPic = document.getElementById('profilePicPreview').src;

  if(!newName || !newEmail){
    msg.textContent = "Name and Email are required!";
    msg.className = "error-msg";
    return;
  }

  // Password change logic
  if(newPassword) {
    if(!oldPassword) {
      msg.textContent = "Please enter your old password to set a new password.";
      msg.className = "error-msg";
      return;
    }
    if(oldPassword !== userObj.password) {
      msg.textContent = "Old password is incorrect!";
      msg.className = "error-msg";
      return;
    }
    userObj.password = newPassword;
  }

  // Update user object
  userObj.name = newName;
  userObj.email = newEmail;
  userObj.profilePic = newPic;

  // Remove old user if email changed
  if(email && newEmail !== email){
    localStorage.removeItem('user_' + email);
    localStorage.setItem('last_login_email', newEmail);
  }

  // Save updated user
  localStorage.setItem('user_' + newEmail, JSON.stringify(userObj));
  msg.textContent = "Profile updated successfully!";
  msg.className = "success-msg";

  // Redirect to index.html after 2 seconds
  setTimeout(function() {
    window.location.href = "index.html";
  }, 2000);
});

// Hide modal on outside click
document.getElementById('editPicModal').addEventListener('click', function(e){
  if(e.target === this) this.style.display = 'none';
});

// On page load, set main preview border from frame
(function(){
  const frame = localStorage.getItem('profileFrame');
  if(frame) {
    document.getElementById('profilePicPreview').style.border = `3.5px solid ${getFrameBorder(frame)}`;
  }
})();

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

document.addEventListener('DOMContentLoaded', function() {
  // --- Auto-fill Name and Email if available in localStorage ---
  // Assume user info is saved as 'user_{email}' in localStorage after registration/login
  let userEmail = localStorage.getItem('last_login_email'); // You should set this on login/register
  let userObj = null;
  if (userEmail) {
    userObj = JSON.parse(localStorage.getItem('user_' + userEmail));
  }
  // If found, set the name and email fields
  if (userObj) {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    if (nameInput && userObj.displayName) nameInput.value = userObj.displayName;
    if (emailInput && userObj.email) emailInput.value = userObj.email;
  }

  // Auto-fill Name and Email from localStorage
  const email = localStorage.getItem('last_login_email');
  if (email) {
    const user = JSON.parse(localStorage.getItem('user_' + email));
    if (user) {
      const nameInput = document.getElementById('nameInput');
      const emailInput = document.getElementById('emailInput');
      // Name field: try user.displayName, user.name, ya email prefix
      if (nameInput) nameInput.value = user.displayName || user.name || email.split('@')[0];
      if (emailInput) emailInput.value = user.email || email;
    }
  }

  const settingsForm = document.getElementById('settingsForm');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const oldPasswordInput = document.getElementById('oldPasswordInput');
  const msg = document.getElementById('msg');

  // OTP section (dynamic)
  let otpSection = null;
  let otpInput = null;
  let otpMsg = null;
  let otpBtn = null;
  let otpSent = false;
  let otpValue = "";

  settingsForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    msg.textContent = "";

    // Check if email or password changed
    const oldEmail = localStorage.getItem('last_login_email');
    const newEmail = emailInput.value.trim();
    const newPassword = passwordInput.value.trim();
    const oldPassword = oldPasswordInput.value.trim();

    // Only send OTP if email or password changed
    if (!otpSent && (newEmail !== oldEmail || newPassword)) {
      otpValue = Math.floor(100000 + Math.random() * 900000).toString();

      // Show OTP input section
      if (!otpSection) {
        otpSection = document.createElement('div');
        otpSection.id = "otp-section";
        otpSection.innerHTML = `
          <input type="text" id="setting-otp" class="otp-input" placeholder="Enter OTP" maxlength="6" style="margin-top:10px;width:90%;padding:10px 12px;border-radius:8px;border:1.5px solid #7b2ff2;font-size:1.1em;outline:none;background:#18122b;color:#fff;">
          <button type="button" id="verify-setting-otp-btn" class="otp-btn" style="margin-top:10px;">Verify OTP</button>
          <div class="otp-msg" id="setting-otp-msg" style="margin-top:10px;color:#00eaff;min-height:24px;"></div>
        `;
        settingsForm.appendChild(otpSection);
      }
      otpInput = document.getElementById('setting-otp');
      otpMsg = document.getElementById('setting-otp-msg');
      otpBtn = document.getElementById('verify-setting-otp-btn');

      msg.textContent = "Sending OTP to your Gmail...";
      try {
        const res = await fetch(`${getOtpApiUrl()}/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newEmail, otp: otpValue })
        });
        const data = await res.json();
        if (data.message === 'OTP sent') {
          msg.textContent = "OTP sent to your Gmail. Please enter OTP below.";
          otpSent = true;

          // YEH ADD KAREN: Verify OTP button pe click event
          otpBtn.onclick = async function() {
            const enteredOtp = otpInput.value.trim();
            otpMsg.textContent = "";
            if (!enteredOtp) {
              otpMsg.textContent = "Please enter OTP.";
              return;
            }
            try {
              const res = await fetch(`${getOtpApiUrl()}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail, otp: enteredOtp })
              });
              const data = await res.json();
              if (data.success) {
                otpMsg.style.color = "#00eaff";
                otpMsg.textContent = "OTP verified! Saving changes...";
                setTimeout(() => {
                  otpSection.remove();
                  otpSection = null;
                  otpSent = false;
                  otpValue = "";
                  msg.textContent = "Changes saved!";
                  // Yahan aapka update logic (localStorage update, etc.)
                  // ...aapka save/update code...
                  settingsForm.submit(); // Ya custom save logic
                }, 1000);
              } else {
                otpMsg.style.color = "#f357a8";
                otpMsg.textContent = "Invalid OTP. Try again.";
              }
            } catch (err) {
              otpMsg.style.color = "#f357a8";
              otpMsg.textContent = "Error verifying OTP.";
            }
          };
        } else {
          msg.textContent = "Failed to send OTP: " + data.message;
        }
      } catch (err) {
        msg.textContent = "Error sending OTP.";
      }

      // Prevent form submit until OTP verified
      return;
    }

    // If OTP sent, verify OTP before saving changes
    if (otpSent) {
      const enteredOtp = otpInput.value.trim();
      otpMsg.textContent = "";
      if (!enteredOtp) {
        otpMsg.textContent = "Please enter OTP.";
        return;
      }
      try {
        const res = await fetch(`${getOtpApiUrl()}/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newEmail, otp: enteredOtp })
        });
        const data = await res.json();
        if (data.success) {
          otpMsg.style.color = "#00eaff";
          otpMsg.textContent = "OTP verified! Saving changes...";
          setTimeout(() => {
            otpSection.remove();
            otpSection = null;
            otpSent = false;
            otpValue = "";
            msg.textContent = "Changes saved!";
            // Yahan aapka update logic (localStorage update, etc.)
            // Example:
            // let user = JSON.parse(localStorage.getItem('user_' + oldEmail)) || {};
            // user.email = newEmail;
            // user.password = newPassword;
            // localStorage.setItem('user_' + newEmail, JSON.stringify(user));
            // localStorage.setItem('last_login_email', newEmail);
            // ...etc...
            settingsForm.submit(); // Ya apna custom save logic
          }, 1000);
        } else {
          otpMsg.style.color = "#f357a8";
          otpMsg.textContent = "Invalid OTP. Try again.";
        }
      } catch (err) {
        otpMsg.style.color = "#f357a8";
        otpMsg.textContent = "Error verifying OTP.";
      }
      return;
    }

    // If nothing changed, allow normal save
    // ...your normal save logic here...
  });
});
