const createCustomStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    img, video, canvas {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Preserve original colors for these elements */
    [data-dark-mode-preserve="true"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  `;
  document.head.appendChild(style);
};