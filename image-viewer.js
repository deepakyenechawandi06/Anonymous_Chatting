// Image viewer functionality
document.addEventListener('DOMContentLoaded', () => {
  // Create image viewer element
  const createImageViewer = () => {
    if (document.getElementById('imageViewer')) return;
    
    const imageViewer = document.createElement('div');
    imageViewer.id = 'imageViewer';
    imageViewer.className = 'image-viewer';
    imageViewer.innerHTML = `
      <div class="image-viewer-close">×</div>
      <img id="fullImage" src="" alt="Full size image">
      <div class="image-viewer-info">Click anywhere to close</div>
    `;
    
    document.body.appendChild(imageViewer);
    
    // Close on click
    imageViewer.addEventListener('click', (e) => {
      if (e.target !== document.getElementById('fullImage')) {
        closeImageViewer();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeImageViewer();
      }
    });
    
    // Close button
    const closeBtn = imageViewer.querySelector('.image-viewer-close');
    closeBtn.addEventListener('click', closeImageViewer);
  };
  
  // Show image in viewer
  const showImage = (imageUrl, sender) => {
    createImageViewer();
    
    const imageViewer = document.getElementById('imageViewer');
    const fullImage = document.getElementById('fullImage');
    
    // Set image source
    fullImage.src = imageUrl;
    
    // Add sender info if available
    const infoElement = imageViewer.querySelector('.image-viewer-info');
    if (sender) {
      infoElement.textContent = `Shared by ${sender} • Click anywhere to close`;
    } else {
      infoElement.textContent = 'Click anywhere to close';
    }
    
    // Show the viewer
    setTimeout(() => {
      imageViewer.classList.add('active');
    }, 10);
    
    // Broadcast to other users that someone opened this image
    if (app.ws && app.ws.readyState === WebSocket.OPEN) {
      app.ws.send(JSON.stringify({
        type: 'imageView',
        imageUrl: imageUrl,
        viewerId: app.userId,
        viewerName: app.nickname || `User ${app.userId.substring(0, 6)}`
      }));
    }
  };
  
  // Close image viewer
  const closeImageViewer = () => {
    const imageViewer = document.getElementById('imageViewer');
    if (imageViewer) {
      imageViewer.classList.remove('active');
      
      // Remove after animation completes
      setTimeout(() => {
        if (imageViewer.parentNode) {
          imageViewer.parentNode.removeChild(imageViewer);
        }
      }, 300);
    }
  };
  
  // Add showFullImage method to app
  if (app) {
    app.showFullImage = function(imageUrl) {
      // Find sender name from the message containing this image
      let sender = '';
      document.querySelectorAll('.chat-image').forEach(img => {
        if (img.src === imageUrl) {
          const messageEl = img.closest('.message');
          if (messageEl) {
            const senderEl = messageEl.querySelector('.message-sender');
            if (senderEl) {
              sender = senderEl.textContent;
            }
          }
        }
      });
      
      showImage(imageUrl, sender);
    };
  }
  
  // Add event listener for image clicks in messages
  const addImageClickListeners = () => {
    document.querySelectorAll('.chat-image').forEach(img => {
      // Skip if already has listener
      if (img.dataset.hasClickListener) return;
      
      img.dataset.hasClickListener = 'true';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Find sender name from parent message
        let sender = '';
        const messageEl = img.closest('.message');
        if (messageEl) {
          const senderEl = messageEl.querySelector('.message-sender');
          if (senderEl) {
            sender = senderEl.textContent;
          }
        }
        
        showImage(img.src, sender);
      });
    });
  };
  
  // Monitor for new images
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        addImageClickListeners();
      }
    }
  });
  
  // Start observing the chat area
  setTimeout(() => {
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) {
      observer.observe(chatArea, { 
        childList: true, 
        subtree: true 
      });
      
      // Add listeners to existing images
      addImageClickListeners();
    }
  }, 1000);
  
  // Handle image view events from other users
  if (app && app.ws) {
    const originalOnMessage = app.ws.onmessage;
    app.ws.onmessage = function(event) {
      // Call the original handler first
      originalOnMessage.call(this, event);
      
      // Check if this is an image view event
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'imageView' && data.viewerId !== app.userId) {
          // Show notification that someone is viewing an image
          app.showToast(`${data.viewerName} is viewing an image`);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };
  }
});