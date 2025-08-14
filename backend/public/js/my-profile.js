// --- Same frames array as your app ---
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
  "linear-gradient(135deg,#f857a6 0%,#ff5858 100%)",
  "box-shadow:0 0 0 4px #7f00ff,0 2px 12px #7f00ff33;",
  "box-shadow:0 0 0 4px #e100ff,0 2px 12px #e100ff33;",
  "box-shadow:0 0 0 4px #00eaff,0 2px 12px #00eaff33;",
  "box-shadow:0 0 0 4px #fec53a,0 2px 12px #fec53a33;",
  "border:4px dashed #7f00ff;",
  "border:4px double #e100ff;",
  "border:4px solid #00eaff;",
  "border:4px groove #fec53a;",
  "box-shadow:0 0 0 4px #fff,0 0 16px #7f00ff,0 2px 12px #e100ff33;",
  "box-shadow:0 0 0 4px #18122b,0 2px 12px #00eaff33;"
];

// --- Utility functions for frame rendering ---
function setAnimatedBorder(el, type = "neon") {
  el.style.border = "4px solid transparent";
  if (type === "neon") {
    el.style.background = "linear-gradient(270deg,#f357a8,#7b2ff2,#00eaff,#f357a8)";
    el.style.backgroundSize = "400% 400%";
    el.style.animation = "borderAnim 2.5s linear infinite";
    el.style.boxShadow = "0 0 16px #7b2ff2, 0 0 32px #f357a8";
  } else if (type === "rainbow") {
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

// --- Load user info and frame ---
window.addEventListener('DOMContentLoaded', function() {
  const email = localStorage.getItem('last_login_email');
  let user = email ? localStorage.getItem('user_' + email) : null;
  let userObj = user ? JSON.parse(user) : {};
  let frameIndex = 0;
  if (localStorage.getItem('profileFrameIndex')) {
    frameIndex = parseInt(localStorage.getItem('profileFrameIndex'), 10);
  } else if (typeof userObj.frameIndex === 'number') {
    frameIndex = userObj.frameIndex;
  }
  const frame = frames[frameIndex] || frames[0];

  // Set profile pic
  const pic = userObj.profilePic || "https://ui-avatars.com/api/?name=User&background=222&color=7f00ff";
  document.getElementById('profilePic').src = pic;

  // Set name/email/password
  document.getElementById('profileName').value = userObj.displayName || userObj.name || "";
  document.getElementById('profileEmail').value = userObj.email || "";
  document.getElementById('profilePassword').value = userObj.password ? "********" : "";

  // Frame logic
  const frameDiv = document.getElementById('profilePicFrame');
  // Reset styles
  frameDiv.style.border = "";
  frameDiv.style.boxShadow = "";
  frameDiv.style.background = "#18122b";
  removeAnimatedBorder(frameDiv);

  if (frame === "animated-gradient") {
    setAnimatedBorder(frameDiv, "neon");
    frameDiv.style.border = "4px solid transparent";
  } else if (frame === "animated-rainbow") {
    setAnimatedBorder(frameDiv, "rainbow");
    frameDiv.style.border = "4px solid transparent";
  } else if (frame.startsWith("conic-gradient") || frame.startsWith("radial-gradient") || frame.startsWith("linear-gradient")) {
    frameDiv.style.background = frame;
    frameDiv.style.border = "4px solid transparent";
    frameDiv.style.boxShadow = "0 0 12px #0008";
  } else if (frame.startsWith("box-shadow")) {
    frameDiv.style.border = "4px solid #fff";
    frameDiv.style.boxShadow = frame.replace("box-shadow:", "");
  } else if (frame.startsWith("border:")) {
    frameDiv.style.border = frame.replace("border:", "");
  } else {
    frameDiv.style.border = "4px solid #7f00ff";
  }

  // Rating logic
  const stars = document.querySelectorAll('.star');
  const ratingMsg = document.getElementById('rating-msg');
  let userRating = localStorage.getItem('siteRating') ? parseInt(localStorage.getItem('siteRating'), 10) : 0;

  function updateStars(rating) {
    stars.forEach((star, idx) => {
      star.innerHTML = idx < rating ? '&#9733;' : '&#9734;';
      star.style.color = idx < rating ? '#ffd700' : '#bdbdbd';
      star.style.textShadow = idx < rating ? '0 0 8px #ffd70088' : 'none';
      star.style.transition = 'color 0.2s, text-shadow 0.2s';
    });
  }
  function showRatingMsg(rating) {
    if (rating === 0) ratingMsg.textContent = '';
    else if (rating === 1) ratingMsg.textContent = "Very Poor";
    else if (rating === 2) ratingMsg.textContent = "Needs Improvement";
    else if (rating === 3) ratingMsg.textContent = "Average";
    else if (rating === 4) ratingMsg.textContent = "Good!";
    else if (rating === 5) ratingMsg.textContent = "Excellent! 🚀";
  }
  updateStars(userRating);
  showRatingMsg(userRating);

  stars.forEach(star => {
    star.addEventListener('mouseenter', function() {
      updateStars(parseInt(this.dataset.value));
    });
    star.addEventListener('mouseleave', function() {
      updateStars(userRating);
    });
    star.addEventListener('click', function() {
      userRating = parseInt(this.dataset.value);
      localStorage.setItem('siteRating', userRating);
      updateStars(userRating);
      showRatingMsg(userRating);
    });
  });
});