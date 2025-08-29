// Auto-moderation system to remove users who use abusive language
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Track abusive message count per user
    const userViolations = {};
    
    // Maximum allowed violations before removal
    const MAX_VIOLATIONS = 2;
    
    // Check if the content moderation system is available
    if (!window.toxicityModel) {
      console.warn('Content moderation system not available for auto-removal');
      return;
    }
    
    // Override the sendMessage method to track violations
    if (app && app.sendMessage) {
      const originalSendMessage = app.sendMessage;
      
      app.sendMessage = async function(text) {
        // If no text is provided, it's coming from the input field
        if (!text) {
          const messageInput = document.getElementById('messageInput');
          if (messageInput) {
            text = messageInput.value.trim();
          }
        }
        
        if (text) {
          try {
            // Check for toxic content
            const result = await checkToxicity(text);
            
            if (result.isToxic) {
              // Record violation for this user
              const userId = app.userId;
              userViolations[userId] = (userViolations[userId] || 0) + 1;
              
              console.log(`User ${userId} violation count: ${userViolations[userId]}`);
              
              // Show warning to the user
              app.showToast(`Warning: Inappropriate language detected (${userViolations[userId]}/${MAX_VIOLATIONS})`);
              
              // If user has exceeded the maximum violations, remove them
              if (userViolations[userId] >= MAX_VIOLATIONS) {
                // Clear the input field
                const messageInput = document.getElementById('messageInput');
                if (messageInput) {
                  messageInput.value = '';
                }
                
                // Send system message about removal
                sendRemovalMessage(userId);
                
                // Remove the user after a short delay
                setTimeout(() => {
                  leaveChat();
                }, 2000);
                
                return false;
              }
              
              // Clear the input field
              const messageInput = document.getElementById('messageInput');
              if (messageInput) {
                messageInput.value = '';
              }
              
              return false;
            }
          } catch (error) {
            console.error('Error in auto-moderation:', error);
          }
        }
        
        // If not toxic or no text to check, proceed with sending
        return originalSendMessage.apply(this, arguments);
      };
    }
    
    // Function to check if text contains toxic content
    async function checkToxicity(text) {
      if (!text || text.trim().length < 3) {
        return { isToxic: false };
      }
      
      try {
        const predictions = await window.toxicityModel.classify(text);
        
        // Check if any category is flagged as toxic
        let isToxic = false;
        let worstCategory = '';
        
        predictions.forEach(prediction => {
          const categoryResult = prediction.results[0];
          if (categoryResult.match) {
            isToxic = true;
            if (!worstCategory) {
              worstCategory = prediction.label;
            }
          }
        });
        
        return { isToxic, worstCategory };
      } catch (error) {
        console.error('Error checking toxicity:', error);
        return { isToxic: false };
      }
    }
    
    // Function to send a system message about user removal
    function sendRemovalMessage(userId) {
      if (app.ws && app.ws.readyState === WebSocket.OPEN) {
        const nickname = app.nickname || `User ${userId.substring(0, 6)}`;
        
        app.ws.send(JSON.stringify({
          type: 'system',
          groupId: app.groupId,
          content: `${nickname} has been automatically removed for repeated use of inappropriate language.`
        }));
      }
    }
    
    // Function to leave the chat
    function leaveChat() {
      // Show alert to the user
      alert('You have been removed from the chat for repeated use of inappropriate language.');
      
      // Disconnect WebSocket
      if (app.ws) {
        app.ws.close();
      }
      
      // Redirect to login page
      window.location.href = '/';
    }
    
    console.log('Auto-moderation system initialized');
  }, 2000);
});