// Content script to detect and block pages

// Insulting questions to ask users
const INSULT_QUESTIONS = [
  "Seriously? This site again? What's your excuse this time?",
  "Can't stay focused for 5 minutes? Why are you back here?",
  "Oh look who's procrastinating again. What's your brilliant reason?",
  "Really productive day you're having, isn't it? Why this site?",
  "Another distraction? Mind telling me what's so important here?",
  "Back so soon? What compelling reason brings you here?",
  "Wow, impressive self-control. Why do you think you need this now?",
  "Couldn't resist, could you? What's your justification?",
  "Breaking your own rules already? Care to explain why?",
  "This is the third time today. What's your excuse NOW?",
  "Oh, this must be REALLY important. Tell me why.",
  "Let me guess, you're being 'productive'? Why are you here?",
  "Can't control yourself? What's the emergency this time?",
  "Blocked this for a reason. What's YOUR reason for ignoring that?",
  "Time management not your strong suit? Why do you need this?",
  "Self-discipline is hard, isn't it? What's your reasoning?",
  "Yet another distraction. What makes this one so special?",
  "Interesting choice. Care to defend it?",
  "Your future self will love this decision. Why are you here?",
  "Breaking promises to yourself again? What's the excuse?"
];

// Check if current page should be blocked
async function checkAndBlock() {
  const currentUrl = window.location.href;

  // Don't check extension pages or chrome URLs
  if (currentUrl.startsWith('chrome://') ||
      currentUrl.startsWith('chrome-extension://') ||
      currentUrl.includes('/blocked.html')) {
    return;
  }

  // Check if site is blocked
  const response = await chrome.runtime.sendMessage({
    action: 'checkBlocked',
    url: currentUrl
  });

  if (response && response.blocked) {
    blockPage(response.domain, currentUrl);
  }
}

// Block the page and redirect to blocked page
function blockPage(domain, url) {
  // Get random insult question
  const question = INSULT_QUESTIONS[Math.floor(Math.random() * INSULT_QUESTIONS.length)];

  // Store the data for the blocked page
  sessionStorage.setItem('blockedData', JSON.stringify({
    domain,
    url,
    question,
    timestamp: Date.now()
  }));

  // Redirect to blocked page
  const blockedPageUrl = chrome.runtime.getURL('pages/blocked.html');
  window.location.replace(blockedPageUrl);
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndBlock);
} else {
  checkAndBlock();
}

// Listen for URL changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    checkAndBlock();
  }
}).observe(document, { subtree: true, childList: true });
