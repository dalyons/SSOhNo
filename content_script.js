(function() {
  'use strict';

  function autoClickButtons(buttonSelectors) {
    buttonSelectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => button.click());
    });
  }

  function closeTabIfUrlMatches(closeUrls) {
    const currentUrl = window.location.href;
    const shouldCloseTab = closeUrls.some(url => currentUrl.includes(url));
    if (shouldCloseTab) {
      setTimeout(function() {
        chrome.runtime.sendMessage({ action: 'close_tab' });
      }, 3000);
    }
  }

  chrome.storage.sync.get(['buttonSelectors', 'closeUrls'], ({ buttonSelectors, closeUrls }) => {
    if (buttonSelectors) {
      autoClickButtons(buttonSelectors);

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            autoClickButtons(buttonSelectors);
            break;
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (closeUrls) {
      closeTabIfUrlMatches(closeUrls);
    }
  });
})();

