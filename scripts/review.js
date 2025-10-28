// Monthly review page script

document.addEventListener('DOMContentLoaded', async () => {
  await loadReviewData();
  setupEventListeners();
  updateLastReviewDate();
});

// Load and display review data
async function loadReviewData() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAttempts' });
    const attempts = response || [];

    displayStats(attempts);
    displayAttempts(attempts);
    populateSiteFilter(attempts);
  } catch (error) {
    console.error('Error loading review data:', error);
  }
}

// Display statistics
function displayStats(attempts) {
  const now = new Date();
  const thisMonth = attempts.filter(attempt => {
    const attemptDate = new Date(attempt.timestamp);
    return attemptDate.getMonth() === now.getMonth() &&
           attemptDate.getFullYear() === now.getFullYear();
  });

  const uniqueSites = new Set(attempts.map(a => a.domain));

  document.getElementById('totalAttempts').textContent = attempts.length;
  document.getElementById('uniqueSites').textContent = uniqueSites.size;
  document.getElementById('thisMonth').textContent = thisMonth.length;
}

// Display attempts list
function displayAttempts(attempts, filter = { month: 'all', site: 'all' }) {
  const container = document.getElementById('attemptsList');

  // Filter attempts
  let filtered = [...attempts];

  if (filter.month === 'current') {
    const now = new Date();
    filtered = filtered.filter(attempt => {
      const attemptDate = new Date(attempt.timestamp);
      return attemptDate.getMonth() === now.getMonth() &&
             attemptDate.getFullYear() === now.getFullYear();
    });
  }

  if (filter.site !== 'all') {
    filtered = filtered.filter(attempt => attempt.domain === filter.site);
  }

  // Sort by newest first
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No access attempts recorded yet</p>
        <p class="empty-subtitle">When you try to access blocked sites, they'll appear here</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(attempt => {
    const date = new Date(attempt.timestamp);
    const formattedDate = formatDate(date);

    return `
      <div class="attempt-card">
        <div class="attempt-header">
          <div class="attempt-site">${attempt.domain}</div>
          <div class="attempt-date">${formattedDate}</div>
        </div>
        <div class="attempt-question">${attempt.question}</div>
        <div class="attempt-reason ${attempt.reason ? '' : 'empty'}">
          ${attempt.reason || 'No reason provided'}
        </div>
      </div>
    `;
  }).join('');
}

// Format date
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

// Populate site filter
function populateSiteFilter(attempts) {
  const sites = new Set(attempts.map(a => a.domain));
  const select = document.getElementById('siteFilter');

  sites.forEach(site => {
    const option = document.createElement('option');
    option.value = site;
    option.textContent = site;
    select.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('closeReview').addEventListener('click', () => {
    window.close();
  });

  document.getElementById('monthFilter').addEventListener('change', handleFilterChange);
  document.getElementById('siteFilter').addEventListener('change', handleFilterChange);

  document.getElementById('exportData').addEventListener('click', handleExport);
  document.getElementById('clearHistory').addEventListener('click', handleClearHistory);
}

// Handle filter changes
async function handleFilterChange() {
  const monthFilter = document.getElementById('monthFilter').value;
  const siteFilter = document.getElementById('siteFilter').value;

  const response = await chrome.runtime.sendMessage({ action: 'getAttempts' });
  const attempts = response || [];

  displayAttempts(attempts, { month: monthFilter, site: siteFilter });
}

// Handle export data
async function handleExport() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAttempts' });
    const attempts = response || [];

    const data = {
      exportDate: new Date().toISOString(),
      totalAttempts: attempts.length,
      attempts: attempts.map(a => ({
        domain: a.domain,
        date: new Date(a.timestamp).toISOString(),
        question: a.question,
        reason: a.reason,
        proceeded: a.proceeded
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `selfblock-review-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Error exporting data. Please try again.');
  }
}

// Handle clear history
async function handleClearHistory() {
  if (!confirm('Are you sure you want to clear all attempt history? This cannot be undone.')) {
    return;
  }

  try {
    await chrome.runtime.sendMessage({ action: 'clearHistory' });
    await loadReviewData();
  } catch (error) {
    console.error('Error clearing history:', error);
    alert('Error clearing history. Please try again.');
  }
}

// Update last review date
function updateLastReviewDate() {
  chrome.storage.local.set({ lastReview: Date.now() });
}
