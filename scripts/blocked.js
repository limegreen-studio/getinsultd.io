// Blocked page script

document.addEventListener('DOMContentLoaded', async () => {
  await loadRandomInsult();
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
