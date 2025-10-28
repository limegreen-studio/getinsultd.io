// Background service worker for blocking logic

// Storage keys
const STORAGE_KEYS = {
  BLOCKED_SITES: 'blockedSites',
  ATTEMPTS: 'blockAttempts',
  SETTINGS: 'settings'
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('SelfBlock extension installed');

  // Initialize storage
  chrome.storage.local.get([STORAGE_KEYS.BLOCKED_SITES, STORAGE_KEYS.ATTEMPTS], (result) => {
    if (!result[STORAGE_KEYS.BLOCKED_SITES]) {
      chrome.storage.local.set({ [STORAGE_KEYS.BLOCKED_SITES]: [] });
    }
    if (!result[STORAGE_KEYS.ATTEMPTS]) {
      chrome.storage.local.set({ [STORAGE_KEYS.ATTEMPTS]: [] });
    }
  });
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkBlocked') {
    checkIfBlocked(request.url).then(sendResponse);
    return true;
  }

  if (request.action === 'addBlock') {
    addBlockedSite(request.domain).then(sendResponse);
    return true;
  }

  if (request.action === 'removeBlock') {
    removeBlockedSite(request.domain).then(sendResponse);
    return true;
  }

  if (request.action === 'getBlocked') {
    getBlockedSites().then(sendResponse);
    return true;
  }

  if (request.action === 'recordAttempt') {
    recordAttempt(request.data).then(sendResponse);
    return true;
  }

  if (request.action === 'getAttempts') {
    getAttempts().then(sendResponse);
    return true;
  }

  if (request.action === 'clearAllBlocks') {
    clearAllBlocks().then(sendResponse);
    return true;
  }

  if (request.action === 'clearHistory') {
    clearHistory().then(sendResponse);
    return true;
  }
});

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

// Check if URL is blocked
async function checkIfBlocked(url) {
  const domain = extractDomain(url);
  if (!domain) return { blocked: false };

  const blockedSites = await getBlockedSites();
  const isBlocked = blockedSites.some(site =>
    domain === site || domain.endsWith('.' + site)
  );

  return { blocked: isBlocked, domain };
}

// Get blocked sites
function getBlockedSites() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.BLOCKED_SITES], (result) => {
      resolve(result[STORAGE_KEYS.BLOCKED_SITES] || []);
    });
  });
}

// Add blocked site
async function addBlockedSite(domain) {
  const blockedSites = await getBlockedSites();

  if (!blockedSites.includes(domain)) {
    blockedSites.push(domain);
    await chrome.storage.local.set({ [STORAGE_KEYS.BLOCKED_SITES]: blockedSites });
    return { success: true, blockedSites };
  }

  return { success: false, message: 'Site already blocked' };
}

// Remove blocked site
async function removeBlockedSite(domain) {
  const blockedSites = await getBlockedSites();
  const filtered = blockedSites.filter(site => site !== domain);

  await chrome.storage.local.set({ [STORAGE_KEYS.BLOCKED_SITES]: filtered });
  return { success: true, blockedSites: filtered };
}

// Clear all blocked sites
async function clearAllBlocks() {
  await chrome.storage.local.set({ [STORAGE_KEYS.BLOCKED_SITES]: [] });
  return { success: true };
}

// Record attempt to access blocked site
async function recordAttempt(data) {
  const attempts = await getAttempts();

  const attempt = {
    id: Date.now().toString(),
    domain: data.domain,
    url: data.url,
    timestamp: Date.now(),
    question: data.question,
    reason: data.reason || '',
    proceeded: data.proceeded || false
  };

  attempts.push(attempt);

  await chrome.storage.local.set({ [STORAGE_KEYS.ATTEMPTS]: attempts });
  return { success: true, attempt };
}

// Get all attempts
function getAttempts() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.ATTEMPTS], (result) => {
      resolve(result[STORAGE_KEYS.ATTEMPTS] || []);
    });
  });
}

// Clear history
async function clearHistory() {
  await chrome.storage.local.set({ [STORAGE_KEYS.ATTEMPTS]: [] });
  return { success: true };
}

// Check for monthly review notification
async function checkMonthlyReview() {
  const lastReview = await getLastReviewDate();
  const now = new Date();
  const daysSinceReview = Math.floor((now - lastReview) / (1000 * 60 * 60 * 24));

  if (daysSinceReview >= 30) {
    // Show notification for monthly review
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon128.png',
      title: 'SelfBlock Monthly Review',
      message: 'Time to review your blocked site attempts from this month!',
      priority: 2
    });
  }
}

function getLastReviewDate() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['lastReview'], (result) => {
      resolve(result.lastReview ? new Date(result.lastReview) : new Date(0));
    });
  });
}

// Run monthly check on startup
chrome.runtime.onStartup.addListener(() => {
  checkMonthlyReview();
});
