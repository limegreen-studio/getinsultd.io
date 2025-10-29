// Blocked page script

const motivationalTexts = [
  "I'm not dumb",
  "I have an ambition",
  "I believe in myself",
  "I can do better",
  "I'm capable of greatness",
  "I won't give up"
];

document.addEventListener('DOMContentLoaded', async () => {
  await loadRandomInsult();
  setupMotivationalButton();
  fetchGitHubStars();
});

// Load and display a random insult
async function loadRandomInsult() {
  try {
    const response = await fetch(chrome.runtime.getURL('data/insults.json'));
    const data = await response.json();
    const insults = data.insults;

    // Get random insult
    const randomInsult = insults[Math.floor(Math.random() * insults.length)];

    // Parse and format the insult
    const formattedInsult = formatInsult(randomInsult);

    // Display it
    document.getElementById('insultText').innerHTML = formattedInsult;
  } catch (error) {
    console.error('Error loading insult:', error);
    document.getElementById('insultText').innerHTML = 'You are an insult to <span class="italic">people</span> who <span class="italic">believe</span> in you.';
  }
}

// Format insult text with proper styling
function formatInsult(insultText) {
  // Split by * and format accordingly
  const parts = insultText.split('*');
  let formatted = '';

  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      // Regular text (not enclosed in *)
      formatted += part;
    } else {
      // Text that was enclosed in * (italic)
      formatted += `<span class="italic">${part}</span>`;
    }
  });

  return formatted;
}

// Setup the motivational button with random text
function setupMotivationalButton() {
  const randomText = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];

  document.getElementById('buttonText').textContent = randomText;
  document.getElementById('buttonHoverText').textContent = randomText;

  // Add click event to close the tab
  document.getElementById('motivationalButton').addEventListener('click', () => {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.remove(tab.id);
    });
  });
}

// Fetch GitHub star count
async function fetchGitHubStars() {
  try {
    // previous fetch URL (official github's fetching)
    // const star_fetch_url = "https://api.github.com/repos/limegreen-studio/getinsultd.io"; 

    // this is an endpoint from shields.io that generates badges - instead we get JSON with the star count stored against "values" key
    const star_fetch_url = "https://img.shields.io/github/stars/limegreen-studio/getinsultd.io.json?cacheSeconds=3600";

    const response = await fetch(star_fetch_url);
    const data = await response.json();
    const stars = data.value || 0;
    document.getElementById('starCount').textContent = stars;
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    document.getElementById('starCount').textContent = '★';
  }
}
