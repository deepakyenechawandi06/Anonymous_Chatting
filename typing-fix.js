// Enhanced message draft system
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Add draft functionality to the app
    app.drafts = {};
    
    // Store the original render method
    const originalRender = app.render;
    
    // Override the render method to preserve input text
    app.render = function() {
      // Save current input text if we're in chat mode
      if (this.currentPage === 'chat') {
        const messageInput = document.getElementById('messageInput');
        if (messageInput && messageInput.value.trim()) {
          // Save draft for current group
          this.drafts[this.groupId] = messageInput.value;
          // Also save to localStorage for persistence across sessions
          localStorage.setItem(`draft_${this.groupId}`, messageInput.value);
        }
      }
      
      // Call the original render method
      originalRender.call(this);
      
      // Restore input text if we're in chat mode
      if (this.currentPage === 'chat') {
        const newMessageInput = document.getElementById('messageInput');
        if (newMessageInput) {
          // Try to get draft from memory first, then localStorage
          let draft = this.drafts[this.groupId] || localStorage.getItem(`draft_${this.groupId}`);
          if (draft) {
            newMessageInput.value = draft;
            // Set cursor position to end
            newMessageInput.selectionStart = newMessageInput.selectionEnd = draft.length;
          }
        }
      }
    };
    
    // Override the sendMessage method to clear drafts when sent
    const originalSendMessage = app.sendMessage;
    app.sendMessage = function() {
      const result = originalSendMessage.apply(this, arguments);
      
      // Clear draft after sending
      if (this.groupId) {
        delete this.drafts[this.groupId];
        localStorage.removeItem(`draft_${this.groupId}`);
      }
      
      return result;
    };
    
    // Add method to clear draft manually
    app.clearDraft = function(groupId) {
      const id = groupId || this.groupId;
      if (id) {
        delete this.drafts[id];
        localStorage.removeItem(`draft_${id}`);
        
        // Clear input if we're in the same group
        if (id === this.groupId) {
          const messageInput = document.getElementById('messageInput');
          if (messageInput) {
            messageInput.value = '';
          }
        }
      }
    };
    
    // Check for existing drafts when joining a group
    const originalJoinGroup = app.joinGroup;
    app.joinGroup = function(id) {
      const result = originalJoinGroup.apply(this, arguments);
      
      // Show toast if there's a draft
      setTimeout(() => {
        const draft = localStorage.getItem(`draft_${id}`);
        if (draft) {
          app.showToast('Draft message restored');
        }
      }, 1000);
      
      return result;
    };
  }, 500);
});