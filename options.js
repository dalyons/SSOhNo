document.getElementById('saveButton').addEventListener('click', () => {
  const buttonSelectors = document.getElementById('buttonSelectors').value.split(',').map(selector => selector.trim());
  const closeUrls = document.getElementById('closeUrls').value.split(',').map(url => url.trim());
  chrome.storage.sync.set({ buttonSelectors, closeUrls }, () => {
    alert('Button selectors and close URLs saved.');
  });
});

chrome.storage.sync.get(['buttonSelectors', 'closeUrls'], ({ buttonSelectors, closeUrls }) => {
  if (buttonSelectors) {
    document.getElementById('buttonSelectors').value = buttonSelectors.join(', ');
  }
  if (closeUrls) {
    document.getElementById('closeUrls').value = closeUrls.join(', ');
  }
});

