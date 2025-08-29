/**
 * Simple message sound effects
 */
(function() {
  // Create audio elements with base64 encoded sounds
  const sendSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD4+Pj4+Pj4+Pj4+Pj4+Pj4//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYFAAAAAAAAAbDWWLpxAAAAAAAAAAAAAAAAAAAA/+MYxAANmAqyQUwQAhqZTq9RNc9S+fQPj5d/DAkOByHIchyHAAAAAP/i/4PPPTw8PDw8AAAAAAAAAAAQ4HDg4ODg8PDw8P/////j4+Pj4+Pj4+P/4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/+MYxBkMAAKyIcxEAP/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+P/4xDEIgAAEqAAAAA=");
  
  const receiveSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAcAAkJCQkJCQkJCQkJCQkJCQwMDAwMDAwMDAwMDAwMDAwMD4+Pj4+Pj4+Pj4+Pj4+Pj4//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUFAAAAAAAAAdDXxdRxAAAAAAAAAAAAAAAAAAAA/+MYxAAPmAqyQUwQAkSZTq9RNc9S+fQPj5d/DAkOByHIchyHAAAAAP/i/4PPPTw8PDw8AAAAAAAAAAAQ4HDg4ODg8PDw8P/////j4+Pj4+Pj4+P/4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/+MYxBcMAAKyIcxEAP/j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+P/4xDEIgAAEqAAAAA=");
  
  // Set volume
  sendSound.volume = 0.7;
  receiveSound.volume = 0.7;
  
  // Override the original sendMessage function
  const originalSendMessage = app.sendMessage;
  app.sendMessage = function(text) {
    // Call the original function
    const result = originalSendMessage.call(this, text);
    
    // Play sound if message was sent successfully
    if (result) {
      sendSound.currentTime = 0; // Reset sound to beginning
      sendSound.play().catch(e => console.log("Couldn't play send sound"));
    }
    
    return result;
  };
  
  // Create a MutationObserver to detect new messages
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any of the added nodes is a received message
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1 && // Element node
                node.classList && 
                node.classList.contains('message') && 
                node.classList.contains('received') &&
                !node.dataset.soundPlayed) {
              
              // Mark as played and play sound
              node.dataset.soundPlayed = 'true';
              receiveSound.currentTime = 0; // Reset sound to beginning
              receiveSound.play().catch(e => console.log("Couldn't play receive sound"));
              break;
            }
          }
        }
      });
    });
    
    // Start observing the chat area
    observer.observe(chatMessages, { 
      childList: true, 
      subtree: true 
    });
  }
  
  // Also listen for WebSocket messages directly
  if (app.ws) {
    const originalOnMessage = app.ws.onmessage;
    app.ws.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && data.sender !== app.clientId) {
          // Play sound for incoming messages
          receiveSound.currentTime = 0;
          receiveSound.play().catch(e => {});
        }
      } catch (e) {}
      
      // Call original handler
      if (originalOnMessage) {
        originalOnMessage.call(this, event);
      }
    };
  }
})();