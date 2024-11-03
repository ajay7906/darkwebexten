// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const brightnessSlider = document.getElementById('brightness');
  const contrastSlider = document.getElementById('contrast');
  const excludedSitesText = document.getElementById('excludedSites');
  
  // Load saved settings
  chrome.storage.sync.get({
    darkMode: false,
    brightness: 85,
    contrast: 100,
    excludedSites: ''
  }, function(items) {
    darkModeToggle.checked = items.darkMode;
    brightnessSlider.value = items.brightness;
    contrastSlider.value = items.contrast;
    excludedSitesText.value = items.excludedSites;
  });
  
  // Save settings and apply dark mode when changed
  function updateSettings() {
    const settings = {
      darkMode: darkModeToggle.checked,
      brightness: brightnessSlider.value,
      contrast: contrastSlider.value,
      excludedSites: excludedSitesText.value
    };
    
    chrome.storage.sync.set(settings);
    applyDarkMode(settings);
  }
  
  darkModeToggle.addEventListener('change', updateSettings);
  brightnessSlider.addEventListener('input', updateSettings);
  contrastSlider.addEventListener('input', updateSettings);
  excludedSitesText.addEventListener('input', updateSettings);
});

async function applyDarkMode(settings) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [settings],
    function: (settings) => {
      const hostname = window.location.hostname;
      const excludedSites = settings.excludedSites.split('\n').map(s => s.trim());
      
      if (excludedSites.includes(hostname)) {
        document.documentElement.style.filter = 'none';
        return;
      }
      
      if (settings.darkMode) {
        document.documentElement.style.filter = `
          brightness(${settings.brightness}%) 
          contrast(${settings.contrast}%) 
          invert(90%) 
          hue-rotate(180deg)
        `;
      } else {
        document.documentElement.style.filter = 'none';
      }
    }
  });
}