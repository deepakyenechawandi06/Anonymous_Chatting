/**
 * Mute System - Allows users to mute other users
 */
(function() {
  // Store muted users
  let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
  
  // Mute a user
  function muteUser(userId) {
    if (!mutedUsers.includes(userId)) {
      mutedUsers.push(userId);
      localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
      hideMessagesFromUser(userId);
      showToast(`User ${userId.slice(0, 8)} has been muted`);
    }
  }
  
  // Unmute a user
  function unmuteUser(userId) {
    mutedUsers = mutedUsers.filter(id => id !== userId);
    localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
    showMessagesFromUser(userId);
    showToast(`User ${userId.slice(0, 8)} has been unmuted`);
  }
  
  // Check if user is muted
  function isUserMuted(userId) {
    return mutedUsers.includes(userId);
  }
  
  // Hide messages from muted user
  function hideMessagesFromUser(userId) {
    document.querySelectorAll('.message').forEach(message => {
      const messageUserId = message.getAttribute('data-user-id');
      if (messageUserId === userId) {
        message.style.display = 'none';
      }
    });
  }
  
  // Show messages from unmuted user
  function showMessagesFromUser(userId) {
    document.querySelectorAll('.message').forEach(message => {
      const messageUserId = message.getAttribute('data-user-id');
      if (messageUserId === userId) {
        message.style.display = '';
      }
    });
  }
  
  // Add mute button to messages
  function addMuteButtons() {
    document.querySelectorAll('.message').forEach(message => {
      // Skip if already has mute button
      if (message.querySelector('.mute-btn')) return;
      
      const messageUserId = message.getAttribute('data-user-id');
      if (!messageUserId || messageUserId === window.app?.userId) return;
      
      // Create mute button
      const muteBtn = document.createElement('button');
      muteBtn.className = 'mute-btn';
      muteBtn.innerHTML = isUserMuted(messageUserId) ? '🔊' : '🔇';
      muteBtn.title = isUserMuted(messageUserId) ? 'Unmute user' : 'Mute user';
      
      muteBtn.addEventListener('click', () => {
        if (isUserMuted(messageUserId)) {
          unmuteUser(messageUserId);
          muteBtn.innerHTML = '🔇';
          muteBtn.title = 'Mute user';
        } else {
          muteUser(messageUserId);
          muteBtn.innerHTML = '🔊';
          muteBtn.title = 'Unmute user';
        }
      });
      
      // Add button to message
      message.appendChild(muteBtn);
    });
  }
  
  // Filter incoming messages
  function filterMessage(messageData) {
    if (messageData.userId && isUserMuted(messageData.userId)) {
      return null; // Don't display message from muted user
    }
    return messageData;
  }
  
  // Show toast message
  function showToast(message) {
    if (window.app && window.app.showToast) {
      window.app.showToast(message);
    } else {
      alert(message);
    }
  }
  
  // Initialize mute system
  function init() {
    // Add mute buttons to existing messages
    addMuteButtons();
    
    // Hide messages from already muted users
    mutedUsers.forEach(userId => {
      hideMessagesFromUser(userId);
    });
    
    // Set up observer for new messages
    const observer = new MutationObserver(() => {
      setTimeout(addMuteButtons, 100);
    });
    
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) {
      observer.observe(chatArea, { childList: true, subtree: true });
    }
    
    // Override message handler if app exists
    if (window.app && window.app.ws) {
      const originalOnMessage = window.app.ws.onmessage;
      window.app.ws.onmessage = function(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && filterMessage(data) === null) {
            return; // Don't process muted user's message
          }
        } catch (e) {}
        
        // Call original handler
        originalOnMessage.call(this, event);
        
        // Add mute buttons after message is rendered
        setTimeout(addMuteButtons, 100);
      };
    }
  }
  
  // Export functions to global scope
  window.muteSystem = {
    muteUser,
    unmuteUser,
    isUserMuted,
    getMutedUsers: () => [...mutedUsers]
  };
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 1000);
  });
})();