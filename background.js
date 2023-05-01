chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.tabs.remove(sender.tab.id);
});

