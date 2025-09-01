# Voice Search Testing Guide

## 🧪 Quick Test Steps

### 1. **Open the Website**
- Click the preview button to open the website in browser
- The server is running on `http://localhost:3001`

### 2. **Test Voice Search Button**
1. Click the search icon (magnifying glass) to open the search modal
2. You should see a microphone button inside the search bar
3. Look for debug info showing "Voice Status: Available ✓" (appears for 5 seconds)
4. Click the microphone button
5. The button should turn red and start pulsing
6. Speak clearly: "Forza" or "GTA" or "PalWorld"
7. The search should automatically filter results

### 3. **Test Wake Word**
1. Close the search modal (click outside)
2. Say "Hey Search" clearly
3. The search modal should open automatically
4. Then speak a game name

### 4. **Test Keyboard Shortcut**
1. Press `Ctrl + Shift + V` (Windows) or `Cmd + Shift + V` (Mac)
2. The search modal should open and start listening
3. Speak your game name

## 🐛 Troubleshooting

### If Voice Search Not Working:

1. **Check Browser Console:**
   - Press F12 to open developer tools
   - Look for console messages starting with "Voice search..."
   - Check for any error messages

2. **Check Microphone Permission:**
   - Browser should ask for microphone permission
   - Click "Allow" when prompted
   - If already denied, click the microphone icon in address bar to enable

3. **Browser Requirements:**
   - Use Chrome, Edge, or Safari (Firefox may not work)
   - Voice search works best in Chrome

4. **HTTPS Requirement:**
   - Voice search requires HTTPS in production
   - Works on localhost for development

## 🔍 Debug Information

- **Voice Status**: Look for debug info under search bar (shows for 5 seconds)
- **Console Logging**: Check browser console for detailed debug messages
- **Button States**: 
  - Normal: Blue gradient microphone
  - Listening: Red pulsing animation
  - Error: Returns to normal with error message

## ✅ Expected Behavior

1. **Microphone button appears** in search modal
2. **Click microphone** → button turns red and pulses
3. **Speak game name** → text appears in search box
4. **Search results filter** automatically after speech
5. **"Hey Search" wake word** works from any page location
6. **Keyboard shortcut** opens modal and starts listening

## 📝 Test Games to Say

Try speaking these game names clearly:
- "Forza" (should find ForzaMotorspot)
- "GTA" or "GTA 5" (should find GTA-V)
- "Call of Duty" (should find COD: Black Ops III)
- "Fortnite" (should find Fortnite-Cauchemars)
- "Pal World" (should find PalWorld)

---

**Note**: If voice search isn't working, the system gracefully falls back to text search without any issues.