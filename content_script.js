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
    const currentFragment = window.location.hash;
    const urlWithFragment = currentFragment ? currentUrl + currentFragment : currentUrl;

    function urlMatchesPattern(url, pattern) {
      const regex = new RegExp(pattern.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*'));
      return regex.test(url);
    }

	
    const shouldCloseTab = closeUrls.some(url => urlMatchesPattern(urlWithFragment, url));
    if (shouldCloseTab) {
      chrome.runtime.sendMessage({ action: 'close_tab' });
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
      setTimeout(function() {
        closeTabIfUrlMatches(closeUrls);
      }, 2000);
    }
  });
})();

