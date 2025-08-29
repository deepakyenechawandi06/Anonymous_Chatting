// Optimize message sending speed
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!app) return;
    
    // Store the original sendMessage function
    const originalSendMessage = app.sendMessage;
    
    // Fix the sendMessage function
    app.sendMessage = function(text) {
      // Get text from input if not provided
      if (!text) {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
          text = messageInput.value.trim();
        }
      }
      
      // Skip empty messages
      if (!text || text.length === 0) return false;
      
      // Send message to server
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'message',
          content: text,
          groupId: this.groupId
        }));
        
        // Clear input field
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
          messageInput.value = '';
          messageInput.focus();
        }
        
        return true;
      } else {
        this.showToast('Connection lost. Please refresh the page.');
        return false;
      }
    };
    
    console.log('Message sending fixed');
  }, 1000);
});