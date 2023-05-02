(function() {
  'use strict';

  function autoClickButtons(selectors) {
    selectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(button => button.click());
    });
  }

  function closeTabIfUrlMatches(urls) {
    const currentUrl = window.location.href;
    const currentFragment = window.location.hash;
    const urlWithFragment = currentFragment ? currentUrl + currentFragment : currentUrl;

    function urlMatchesPattern(url, pattern) {
      const regex = new RegExp(pattern.split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*'));
      return regex.test(url);
    }

	
    const shouldCloseTab = urls.some(url => urlMatchesPattern(urlWithFragment, url));
    if (shouldCloseTab) {
      chrome.runtime.sendMessage({ action: 'close_tab' });
    }
  }

  chrome.storage.sync.get(['autoButtonClickSelectors', 'autoCloseUrls'], ({ autoButtonClickSelectors, autoCloseUrls }) => {
    if (autoButtonClickSelectors) {
      autoClickButtons(autoButtonClickSelectors);

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            autoClickButtons(autoButtonClickSelectors);
            break;
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (autoCloseUrls) {
      setTimeout(function() {
        closeTabIfUrlMatches(autoCloseUrls);
      }, 2000);
    }
  });
})();

