// User-specific animations
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Assign animation based on user ID
    function getUserAnimation(userId) {
      // Create a simple hash from the user ID
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        hash = ((hash << 5) - hash) + userId.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      
      // Get a number between 1-5 based on the hash
      const animationNumber = Math.abs(hash % 5) + 1;
      return `user-animation-${animationNumber}`;
    }
    
    // Add data-user-id attribute to all messages
    function addUserIdToMessages() {
      document.querySelectorAll('.message').forEach(message => {
        if (!message.hasAttribute('data-user-id')) {
          const senderEl = message.querySelector('.message-sender');
          if (senderEl) {
            const sender = senderEl.textContent;
            // Extract user ID from sender text (format: "User abc123")
            const match = sender.match(/User ([a-zA-Z0-9]+)/);
            if (match && match[1]) {
              message.setAttribute('data-user-id', match[1]);
            }
          }
        }
      });
    }
    
    // Function to animate a message
    function animateMessage(message) {
      // Skip if already animated
      if (message.classList.contains('animated')) return;
      
      // Get user ID from the message
      const userId = message.getAttribute('data-user-id');
      
      // If we have a userId, apply animation
      if (userId) {
        // Add user-specific animation class
        const animationClass = getUserAnimation(userId);
        message.classList.add(animationClass, 'animated');
        
        // Apply character animation for text content
        const textElement = message.querySelector('p');
        if (textElement && !textElement.querySelector('.char-animated')) {
          const text = textElement.textContent;
          
          // Split text into characters and wrap each in a span
          const characters = text.split('').map(char => 
            `<span class="char-animated">${char === ' ' ? '&nbsp;' : char}</span>`
          ).join('');
          
          // Replace the text with animated spans
          textElement.innerHTML = characters;
        }
      }
    }
    
    // Apply animations to all messages
    function animateAllMessages() {
      addUserIdToMessages();
      document.querySelectorAll('.message').forEach(animateMessage);
    }
    
    // Override the original message rendering
    if (app.render) {
      const originalRender = app.render;
      app.render = function() {
        // Call original render first
        originalRender.call(this);
        
        // Apply animations to messages
        setTimeout(animateAllMessages, 100);
      };
    }
    
    // Also handle new messages as they arrive
    if (app.ws && app.ws.onmessage) {
      const originalOnMessage = app.ws.onmessage;
      app.ws.onmessage = function(event) {
        // Call the original handler
        originalOnMessage.call(this, event);
        
        // Check if this was a message
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            // Wait for the message to be rendered
            setTimeout(animateAllMessages, 100);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      };
    }
    
    // Initial animation of existing messages
    setTimeout(animateAllMessages, 500);
  }, 1000);
});