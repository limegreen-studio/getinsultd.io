# GetInsultd - Chrome Extension That Roasts You for getting distracted :D

A brutal Chrome extension that blocks distracting websites and insults you when you try to access them. Get motivated through tough love! 🔥🥰🔪

## 🚀 What Does This Extension Do?

GetInsultd helps you stay focused by:

- **Blocking websites** you know you shouldn't visit during work/study time ( thou shall add them )
- **Showing you savage insults** when you try to access blocked sites
- **Giving you a motivational button** to close the tab and get back to work

## 📦 How to Install (Step-by-Step for Beginners)

Don't worry if you've never installed a Chrome extension from code before! Just follow these simple steps:

### Step 1: Install Git (if you don't have it)

**For Mac:**

1. Open Terminal (press `Cmd + Space`, type "Terminal", press Enter)
2. Type: `git --version` and press Enter
3. If you don't have it, you'll be prompted to install it automatically

**For Windows:**

1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Install it with default settings
3. Open Command Prompt and type `git --version` to verify

**For Linux:**

```bash
sudo apt-get install git  # For Ubuntu/Debian
# or
sudo yum install git       # For Fedora/CentOS
```

### Step 2: Download the Extension Code

1. **Open your terminal/command prompt**

   - Mac: `Cmd + Space` → type "Terminal"
   - Windows: Press `Win + R` → type "cmd" → press Enter
   - Linux: `Ctrl + Alt + T`

2. **Navigate to where you want to save the extension**

   ```bash
   cd Desktop  # This saves it to your Desktop
   # or
   cd Documents  # This saves it to your Documents
   ```

3. **Clone (download) the repository**

   ```bash
   git clone https://github.com/limegreen-studio/getinsultd.git
   ```

4. **Navigate into the extension folder**
   ```bash
   cd getinsultd/chrome-extension
   ```

### Step 3: Load the Extension in Chrome

1. **Open Google Chrome**

2. **Go to Extensions page**

   - Type `chrome://extensions/` in the address bar and press Enter
   - OR click the three dots (⋮) → More Tools → Extensions

3. **Enable Developer Mode**

   - Look for a toggle switch that says "Developer mode" in the top-right corner
   - Click it to turn it ON (it should turn blue/green)

4. **Load the extension**

   - Click the "Load unpacked" button (appears after enabling Developer mode)
   - Navigate to where you cloned the repository
   - Select the `chrome-extension` folder (the one that contains `manifest.json`)
   - Click "Select Folder" or "Open"

5. **Pin the extension (optional but recommended)**
   - Click the puzzle icon (🧩) in your Chrome toolbar
   - Find "GetInsultd" in the list
   - Click the pin icon (📌) next to it
   - Now it will show in your toolbar!

### Step 4: Start Using It!

You're all set! 🎉

## 🎯 How to Use GetInsultd

### Block a Website

1. Visit any website you want to block (like reddit.com, twitter.com, etc.)
2. Click the GetInsultd extension icon in your toolbar
3. Click "Block This Site"
4. Done! That site is now blocked

### What Happens When You Try to Access a Blocked Site?

Go try and see

### Unblock a Website

1. Click the GetInsultd extension icon
2. Find the website in your blocked list
3. Click the ✕ button next to it
4. The site is now unblocked!

## 📝 Customization

### Add Your Own Insults

1. Open the file: `data/insults.json`
2. Add your custom insults in this format:
   ```json
   "Your custom *insult* goes here"
   ```
   (Text between `*` will be shown in italic and in diff font)
3. Save the file
4. Reload the extension in Chrome

5. Save and reload the extension

## 🤝 Contributing

Want to make GetInsultd better? Here's how:

1. Prep a logo, we dont have one right now. Im thinking i in italics or something striking.

Ideas for contributions:

- Add more insults
- Give feedback on the usecase, Give suggestions for improvment :D

## 🙏 Credits

**Built by Lime Green Studios**

- [lime green studios](https://limegreenstudios.work)
- Star the repo if you like it! ⭐

## ⚖️ License

## Innum adha podala, podrom porumaiya

**Remember**: The insults are meant to motivate you, not hurt you. Use GetInsultd to build better habits and stay focused on what matters! 💪

**Stay focused. Get Insultd. Be Productive.** 🚀

P.S this is a WIP repo, dont blame us if things are not right :D
