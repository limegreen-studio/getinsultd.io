// Popup script for managing blocked sites

document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentSite();
  await loadBlockedSites();
  setupEventListeners();
});

// Load current site information
async function loadCurrentSite() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      document.getElementById('currentSite').textContent = 'No active tab';
      document.getElementById('toggleBlock').disabled = true;
      return;
    }

    const url = tab.url;
    const domain = extractDomain(url);

    // Don't allow blocking chrome:// or extension pages
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      document.getElementById('currentSite').textContent = 'Cannot block system pages';
      document.getElementById('toggleBlock').disabled = true;
      return;
    }

    document.getElementById('currentSite').textContent = domain;

    // Check if already blocked
    const response = await chrome.runtime.sendMessage({
      action: 'checkBlocked',
      url: url
    });

    updateToggleButton(response.blocked, domain);
  } catch (error) {
    console.error('Error loading current site:', error);
  }
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return 'Invalid URL';
  }
}

// Update toggle button state
function updateToggleButton(isBlocked, domain) {
  const button = document.getElementById('toggleBlock');
  const text = document.getElementById('toggleText');
  const status = document.getElementById('siteStatus');

  if (isBlocked) {
    button.classList.remove('block');
    button.classList.add('unblock');
    text.textContent = 'Unblock This Site';
    status.textContent = 'BLOCKED';
    status.classList.add('blocked');
    status.classList.remove('active');
  } else {
    button.classList.remove('unblock');
    button.classList.add('block');
    text.textContent = 'Block This Site';
    status.textContent = 'ACTIVE';
    status.classList.add('active');
    status.classList.remove('blocked');
  }

  button.dataset.domain = domain;
  button.dataset.blocked = isBlocked;
}

// Load and display blocked sites
async function loadBlockedSites() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getBlocked' });
    const blockedSites = response || [];

    const container = document.getElementById('blockedSites');
    const count = document.getElementById('blockedCount');

    count.textContent = blockedSites.length;

    if (blockedSites.length === 0) {
      container.innerHTML = '<p class="empty-state">No blocked sites yet</p>';
      return;
    }

    container.innerHTML = blockedSites.map(site => `
      <div class="blocked-item" data-domain="${site}">
        <span class="blocked-item-url">${site}</span>
        <button class="btn-remove" data-domain="${site}">✕</button>
      </div>
    `).join('');

    // Add remove handlers
    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', handleRemoveSite);
    });
  } catch (error) {
    console.error('Error loading blocked sites:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('toggleBlock').addEventListener('click', handleToggleBlock);
  document.getElementById('viewReview').addEventListener('click', handleViewReview);
  document.getElementById('clearAll').addEventListener('click', handleClearAll);
}

// Handle block/unblock toggle
async function handleToggleBlock(e) {
  const button = e.currentTarget;
  const domain = button.dataset.domain;
  const isBlocked = button.dataset.blocked === 'true';

  try {
    if (isBlocked) {
      // Unblock
      await chrome.runtime.sendMessage({
        action: 'removeBlock',
        domain: domain
      });
    } else {
      // Block
      await chrome.runtime.sendMessage({
        action: 'addBlock',
        domain: domain
      });
    }

    // Reload UI
    await loadCurrentSite();
    await loadBlockedSites();
  } catch (error) {
    console.error('Error toggling block:', error);
  }
}

// Handle remove site
async function handleRemoveSite(e) {
  const domain = e.target.dataset.domain;

  try {
    await chrome.runtime.sendMessage({
      action: 'removeBlock',
      domain: domain
    });

    // Reload UI
    await loadCurrentSite();
    await loadBlockedSites();
  } catch (error) {
    console.error('Error removing site:', error);
  }
}

// Handle view review
function handleViewReview() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('pages/review.html')
  });
}

// Handle clear all
async function handleClearAll() {
  if (!confirm('Are you sure you want to unblock all sites?')) {
    return;
  }

  try {
    await chrome.runtime.sendMessage({ action: 'clearAllBlocks' });

    // Reload UI
    await loadCurrentSite();
    await loadBlockedSites();
  } catch (error) {
    console.error('Error clearing all blocks:', error);
  }
}
