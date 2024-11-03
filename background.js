// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get({
      darkMode: false,
      brightness: 85,
      contrast: 100,
      excludedSites: ''
    }, function(settings) {
      if (settings.darkMode) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          args: [settings],
          function: (settings) => {
            const hostname = window.location.hostname;
            const excludedSites = settings.excludedSites.split('\n').map(s => s.trim());
            
            if (excludedSites.includes(hostname)) {
              document.documentElement.style.filter = 'none';
              return;
            }
            
            document.documentElement.style.filter = `
              brightness(${settings.brightness}%) 
              contrast(${settings.contrast}%) 
              invert(90%) 
              hue-rotate(180deg)
            `;
          }
        });
      }
    });
  }
});