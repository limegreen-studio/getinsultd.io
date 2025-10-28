# SelfBlock - Website Blocker with Accountability

A Chrome extension that helps you stay focused by blocking distracting websites and making you reflect on why you tried to access them.

## 🚀 Features

### 1. **Easy Website Blocking**
- Click the extension icon to block/unblock the current website
- Manage all blocked sites from the popup
- One-click toggle for quick changes

### 2. **Accountability & Reflection**
- When you try to access a blocked site, you're presented with an insulting question
- Must provide a written reason before proceeding
- Forces mindful decision-making about distractions

### 3. **Smart Theme Detection**
- Automatically adapts to your system's light/dark mode
- Beautiful, distraction-free blocked page design
- Smooth theme transitions

### 4. **Monthly Review Dashboard**
- View all your blocked site access attempts
- See your reasons for wanting to access each site
- Filter by month or specific websites
- Export your data for analysis

### 5. **Local Storage**
- All data stored locally in your browser
- No external servers or data collection
- Complete privacy and control

## 📦 Installation

### From Source (Development)

1. **Clone or download this repository**
   ```bash
   cd chrome-extension
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)

3. **Load the extension**
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

4. **Pin the extension**
   - Click the puzzle icon in Chrome toolbar
   - Pin "SelfBlock" for easy access

### Icon Setup

Before loading, you need to add icons. Create three PNG files:
- `icons/icon16.png` (16x16px)
- `icons/icon48.png` (48x48px)
- `icons/icon128.png` (128x128px)

Or use a placeholder by creating simple red "🚫" icons.

## 🎯 How to Use

### Blocking a Website

1. Visit the website you want to block
2. Click the SelfBlock extension icon
3. Click "Block This Site"
4. The site is now blocked!

### Accessing a Blocked Site

1. Try to visit a blocked website
2. You'll see a block page with an insulting question
3. Type your honest reason in the text box
4. Click "Submit & Continue Anyway" to proceed (temporary 5-second unblock)
5. Or click "Go Back" to stay focused

### Reviewing Your Activity

1. Click the extension icon
2. Click "📊 View Monthly Review"
3. See all your attempts and reasons
4. Filter by month or website
5. Export your data as JSON

### Managing Blocked Sites

- **Remove a site**: Click the ✕ next to it in the popup
- **Clear all blocks**: Click "Clear All Blocks" (with confirmation)
- **View blocked count**: See the red badge next to "Blocked Websites"

## 📊 What Data is Stored

All data is stored locally using Chrome's storage API:

### Blocked Sites List
```json
{
  "blockedSites": ["facebook.com", "twitter.com", "reddit.com"]
}
```

### Access Attempts
```json
{
  "blockAttempts": [
    {
      "id": "1234567890",
      "domain": "facebook.com",
      "url": "https://facebook.com/feed",
      "timestamp": 1234567890000,
      "question": "Seriously? This site again?",
      "reason": "I wanted to check notifications",
      "proceeded": true
    }
  ]
}
```

## 🎨 Insulting Questions

The extension uses 20 different insulting questions to make you think twice:

- "Seriously? This site again? What's your excuse this time?"
- "Can't stay focused for 5 minutes? Why are you back here?"
- "Oh look who's procrastinating again. What's your brilliant reason?"
- "Really productive day you're having, isn't it? Why this site?"
- And 16 more!

Each time you hit a blocked site, you get a random question.

## 🔧 Configuration

### Customizing Insult Questions

Edit `scripts/content.js` and modify the `INSULT_QUESTIONS` array:

```javascript
const INSULT_QUESTIONS = [
  "Your custom question here?",
  "Another custom question?",
  // Add more...
];
```

### Changing Grace Period

In `scripts/blocked.js`, adjust the timeout (default 5000ms = 5 seconds):

```javascript
setTimeout(async () => {
  await chrome.runtime.sendMessage({
    action: 'addBlock',
    domain: domain
  });
}, 5000); // Change this value
```

## 📱 Pages

### 1. Popup (`pages/popup.html`)
- Quick access to block/unblock current site
- List of all blocked sites
- Navigation to review page

### 2. Blocked Page (`pages/blocked.html`)
- Shown when accessing blocked sites
- Random insulting question
- Text input for reasoning
- Light/dark mode adaptive

### 3. Review Page (`pages/review.html`)
- Monthly statistics
- Full attempt history
- Filtering options
- Data export

## 🔐 Privacy & Security

- **100% Local**: All data stored in Chrome's local storage
- **No Tracking**: No analytics, no external calls
- **No Permissions Abuse**: Only requests necessary permissions
- **Open Source**: Review all code yourself

## 🛠️ Development

### File Structure

```
chrome-extension/
├── manifest.json           # Extension configuration
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── pages/                  # HTML pages
│   ├── popup.html         # Extension popup
│   ├── blocked.html       # Block page
│   └── review.html        # Review dashboard
├── styles/                 # CSS files
│   ├── popup.css
│   ├── blocked.css
│   └── review.css
├── scripts/                # JavaScript files
│   ├── background.js      # Service worker
│   ├── content.js         # Content script
│   ├── popup.js           # Popup logic
│   ├── blocked.js         # Block page logic
│   └── review.js          # Review page logic
└── README.md              # This file
```

### Key Components

1. **Service Worker** (`background.js`)
   - Manages blocked sites list
   - Handles storage operations
   - Monthly review notifications

2. **Content Script** (`content.js`)
   - Runs on all pages
   - Checks if page is blocked
   - Redirects to block page

3. **Popup** (`popup.js`)
   - UI for managing blocks
   - Current site status
   - Quick actions

4. **Block Page** (`blocked.js`)
   - Theme detection
   - Answer collection
   - Temporary unblock logic

5. **Review Page** (`review.js`)
   - Statistics calculation
   - Filtering and display
   - Data export

## 🎯 Use Cases

### For Students
- Block social media during study time
- Review why you got distracted
- Build better focus habits

### For Professionals
- Block time-wasting sites during work
- Track productivity patterns
- Maintain accountability

### For Anyone
- Reduce mindless browsing
- Understand your distraction triggers
- Make conscious choices

## 🤝 Contributing

Feel free to:
- Add more insulting questions
- Improve the UI/UX
- Add new features
- Fix bugs
- Suggest improvements

## 📝 Future Ideas

- [ ] Scheduling (block only during work hours)
- [ ] Statistics graphs and charts
- [ ] Custom block messages per site
- [ ] Share anonymous insights
- [ ] Mobile companion app
- [ ] AI-generated personalized questions
- [ ] Gamification (streaks, achievements)

## ⚖️ License

MIT License - Use freely, no attribution required

## 🙏 Credits

Built with vanilla JavaScript, Chrome Extensions API, and tough love.

---

**Remember**: The goal isn't to make you feel bad - it's to make you think twice before breaking your own rules. Use this extension to build better habits and stay accountable to yourself.

Stay focused! 🎯
