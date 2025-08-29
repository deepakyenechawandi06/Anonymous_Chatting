// Smashing effect for messages
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Override the original sendMessage method
    if (app && app.sendMessage) {
      const originalSendMessage = app.sendMessage;
      
      app.sendMessage = function() {
        // Call the original method first
        const result = originalSendMessage.apply(this, arguments);
        
        // Add smashing effect after sending
        setTimeout(() => {
          const messages = document.querySelectorAll('.message.sent');
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            
            // Add smash effect class
            lastMessage.classList.add('smash-effect');
            
            // Create shockwave effect
            createShockwave(lastMessage);
            
            // Shake the chat area
            const chatArea = document.getElementById('chatMessages');
            chatArea.classList.add('shake');
            setTimeout(() => {
              chatArea.classList.remove('shake');
            }, 500);
          }
        }, 100);
        
        return result;
      };
    }
    
    // Function to create shockwave effect
    function createShockwave(element) {
      // Make sure element has position relative
      if (element.style.position !== 'relative') {
        element.style.position = 'relative';
      }
      
      // Create shockwave element
      const shockwave = document.createElement('div');
      shockwave.className = 'shockwave';
      element.appendChild(shockwave);
      
      // Remove after animation completes
      setTimeout(() => {
        if (element.contains(shockwave)) {
          element.removeChild(shockwave);
        }
      }, 600);
    }
  }, 1000);
});