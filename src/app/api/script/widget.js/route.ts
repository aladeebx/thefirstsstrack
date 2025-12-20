import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Get the base URL from the request
  const protocol = request.headers.get('x-forwarded-proto') || 
                   (request.headers.get('host')?.includes('localhost') ? 'http' : 'https');
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  if (!code) {
    // Return error script if no code provided
    const errorScript = `
(function() {
  console.error('TrakoShip Widget: Missing code parameter. Please add ?code=YOUR_USER_ID to the script URL.');
})();
`;
    return new NextResponse(errorScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Generate the widget script dynamically
  const widgetScript = `
(function() {
  'use strict';
  
  // Configuration from URL parameter
  const userId = '${code.replace(/'/g, "\\'")}';
  const baseUrl = '${baseUrl.replace(/'/g, "\\'")}';
  const containerId = 'trakoship-widget-' + Math.random().toString(36).substr(2, 9);
  let widgetInitialized = false;
  
  // Robust DOM ready function that handles all cases
  function waitForDOM(callback) {
    // If DOM is already complete, execute immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(callback, 0);
      return;
    }
    
    // If DOM is loading, wait for DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
      return;
    }
    
    // Fallback: execute immediately
    setTimeout(callback, 0);
  }
  
  // Wait for body to be available
  function waitForBody(callback) {
    if (document.body) {
      callback();
      return;
    }
    
    // If body doesn't exist, wait for it
    const checkBody = setInterval(function() {
      if (document.body) {
        clearInterval(checkBody);
        callback();
      }
    }, 10);
    
    // Timeout after 5 seconds
    setTimeout(function() {
      clearInterval(checkBody);
      if (document.body) {
        callback();
      } else {
        console.error('TrakoShip Widget: document.body not found after timeout');
      }
    }, 5000);
  }
  
  function createWidget() {
    // Prevent multiple initializations
    if (widgetInitialized) {
      return;
    }
    
    try {
      // Wait for body to be available
      waitForBody(function() {
        try {
          // Create container div if it doesn't exist
          let container = document.getElementById(containerId);
          
          if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.style.width = '100%';
            container.style.minHeight = '400px';
            container.style.margin = '0';
            container.style.padding = '0';
            
            // Always append to body - most reliable method
            document.body.appendChild(container);
          }
          
          // Create iframe
          const iframe = document.createElement('iframe');
          iframe.src = baseUrl + '/embed/search?userId=' + encodeURIComponent(userId);
          iframe.style.width = '100%';
          iframe.style.height = '700px';
          iframe.style.border = '1px solid #e2e8f0';
          iframe.style.borderRadius = '0.5rem';
          iframe.frameBorder = '0';
          iframe.scrolling = 'auto';
          iframe.setAttribute('title', 'Shipment Tracking Widget');
          iframe.setAttribute('allow', 'fullscreen');
          
          // Clear container and append iframe
          container.innerHTML = '';
          container.appendChild(iframe);
          
          // Handle responsive height (only add listener once)
          if (!window.trakoshipResizeHandler) {
            window.trakoshipResizeHandler = function(event) {
              if (event.data && event.data.type === 'trakoship-resize') {
                const containers = document.querySelectorAll('[id^="trakoship-widget-"]');
                containers.forEach(function(container) {
                  const iframes = container.querySelectorAll('iframe');
                  iframes.forEach(function(iframe) {
                    iframe.style.height = event.data.height + 'px';
                  });
                });
              }
            };
            window.addEventListener('message', window.trakoshipResizeHandler);
          }
          
          widgetInitialized = true;
        } catch (error) {
          console.error('TrakoShip Widget: Error creating widget:', error);
        }
      });
    } catch (error) {
      console.error('TrakoShip Widget: Error initializing widget:', error);
    }
  }
  
  // Initialize widget when DOM is ready
  waitForDOM(function() {
    createWidget();
  });
  
  // Also try to initialize immediately in case DOM is already ready
  // This handles the case where script is loaded after page load
  if (document.body) {
    createWidget();
  }
})();
`;

  return new NextResponse(widgetScript, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

