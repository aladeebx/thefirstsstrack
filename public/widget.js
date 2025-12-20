(function() {
  'use strict';

  // Get configuration from window object
  const config = window.TrakoShipConfig || {};
  const mode = config.mode || 'inline'; // 'inline' or 'modal'
  const userId = config.userId || '';
  const containerId = config.containerId || 'trakoship-widget';
  const buttonText = config.buttonText || 'Track Your Shipment';
  const baseUrl = config.baseUrl || window.location.origin;

  // Validate required configuration
  if (!userId) {
    console.error('TrakoShip Widget: No userId provided. Please set window.TrakoShipConfig.userId');
    return;
  }

  if (mode === 'inline') {
    // INLINE MODE: Create search widget embedded in page
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`TrakoShip Widget: Container element with id "${containerId}" not found`);
      return;
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/embed/search?userId=${encodeURIComponent(userId)}`;
    iframe.style.width = '100%';
    iframe.style.height = '700px';
    iframe.style.border = '1px solid #e2e8f0';
    iframe.style.borderRadius = '0.5rem';
    iframe.frameBorder = '0';
    iframe.scrolling = 'auto';
    iframe.setAttribute('title', 'Shipment Tracking Widget');

    // Append iframe to container
    container.appendChild(iframe);

  } else if (mode === 'modal') {
    // MODAL MODE: Create button that opens modal popup
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${baseUrl}/embed/modal?userId=${encodeURIComponent(userId)}&buttonText=${encodeURIComponent(buttonText)}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.zIndex = '999999';
    iframe.style.display = 'none';
    iframe.frameBorder = '0';
    iframe.setAttribute('title', 'Shipment Tracking Modal');
    
    // Add iframe to body
    document.body.appendChild(iframe);

    // Show iframe after it loads
    iframe.onload = function() {
      iframe.style.display = 'block';
    };

  } else {
    console.error('TrakoShip Widget: Invalid mode. Use "inline" or "modal"');
  }

  // Handle responsive height for inline mode
  if (mode === 'inline') {
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'trakoship-resize') {
        const iframes = document.querySelectorAll('iframe[src*="/embed/search"]');
        iframes.forEach(function(iframe) {
          iframe.style.height = event.data.height + 'px';
        });
      }
    });
  }
})();

