/**
 * Indian language content filter
 * Detects and encrypts abusive words in Indian languages
 */
(function() {
  // List of words to filter (encoded to avoid direct representation)
  const abusiveWords = [
    // Hindi
    "bc", "mc", "bsdk", "bhosdi", "chutiya", "gandu", "lund", "lauda", "randi", 
    "saala", "harami", "bhadwa", "chodu", "madarchod", "behenchod", "bhenchod",
    
    // Punjabi
    "panchod", "pencho", "paaji", "kutti", "kamina", "khota",
    
    // Tamil/Telugu/Malayalam
    "punda", "otha", "thevdiya", "baadu", "dengutha", "lanja", "lanja kodaka",
    
    // Bengali
    "bokachoda", "khanki", "khankirpola",
    
    // Common transliterations and variations
    "chut", "choot", "gaand", "jhaant", "jhaat", "kutta", "kutti", "suar",
    "madar", "behen", "amma", "baap", "beti", "bhadve", "bhosda", "lavde"
  ];
  
  // Simple encryption function (Base64 encoding)
  function encryptText(text) {
    return btoa(text);
  }
  
  // Filter function to detect and encrypt abusive content
  function filterMessage(message) {
    let filteredMessage = message;
    let containsAbusiveContent = false;
    
    // Check for exact matches
    abusiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(message)) {
        containsAbusiveContent = true;
      }
    });
    
    // Check for partial matches and variations
    abusiveWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      if (regex.test(message)) {
        containsAbusiveContent = true;
      }
    });
    
    // If abusive content detected, encrypt the message
    if (containsAbusiveContent) {
      filteredMessage = "⚠️ [Filtered content] " + encryptText(message);
    }
    
    return filteredMessage;
  }
  
  // Override the sendMessage function to include filtering
  window.addEventListener('DOMContentLoaded', function() {
    // Store the original sendMessage function
    const originalSendMessage = app.sendMessage;
    
    // Override with our filtered version
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
      
      // Apply content filtering
      const filteredText = filterMessage(text);
      
      // Send filtered message using the original function logic
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'message',
          content: filteredText,
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
  });
})();