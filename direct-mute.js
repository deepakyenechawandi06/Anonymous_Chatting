/**
 * Direct Mute System - Adds mute buttons to messages
 */
(function() {
  let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
  
  // Add mute buttons to messages
  function addMuteButtons() {
    document.querySelectorAll('.message').forEach(message => {
      if (message.querySelector('.direct-mute-btn')) return;
      
      const sender = message.querySelector('strong');
      if (!sender) return;
      
      const userId = sender.textContent.replace('User ', '').trim();
      if (!userId) return;
      
      const isMuted = mutedUsers.includes(userId);
      
      const muteBtn = document.createElement('button');
      muteBtn.className = 'direct-mute-btn';
      muteBtn.innerHTML = isMuted ? '🔊' : '🔇';
      muteBtn.title = isMuted ? 'Unmute user' : 'Mute user';
      muteBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 10;
      `;
      
      muteBtn.addEventListener('click', () => {
        if (mutedUsers.includes(userId)) {
          // Unmute
          mutedUsers = mutedUsers.filter(id => id !== userId);
          muteBtn.innerHTML = '🔇';
          muteBtn.title = 'Mute user';
          showUserMessages(userId);
          alert(`User ${userId.slice(0, 8)} unmuted`);
        } else {
          // Mute
          mutedUsers.push(userId);
          muteBtn.innerHTML = '🔊';
          muteBtn.title = 'Unmute user';
          hideUserMessages(userId);
          alert(`User ${userId.slice(0, 8)} muted`);
        }
        localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
      });
      
      message.style.position = 'relative';
      message.appendChild(muteBtn);
      
      // Show button on hover
      message.addEventListener('mouseenter', () => {
        muteBtn.style.opacity = '1';
      });
      message.addEventListener('mouseleave', () => {
        muteBtn.style.opacity = '0';
      });
    });
  }
  
  // Hide messages from muted user
  function hideUserMessages(userId) {
    document.querySelectorAll('.message').forEach(message => {
      const sender = message.querySelector('strong');
      if (sender && sender.textContent.includes(userId)) {
        message.style.display = 'none';
      }
    });
  }
  
  // Show messages from unmuted user
  function showUserMessages(userId) {
    document.querySelectorAll('.message').forEach(message => {
      const sender = message.querySelector('strong');
      if (sender && sender.textContent.includes(userId)) {
        message.style.display = '';
      }
    });
  }
  
  // Hide messages from already muted users
  function hideExistingMutedMessages() {
    mutedUsers.forEach(userId => {
      hideUserMessages(userId);
    });
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Add mute buttons to existing messages
    setTimeout(() => {
      addMuteButtons();
      hideExistingMutedMessages();
    }, 1000);
    
    // Watch for new messages
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        addMuteButtons();
        hideExistingMutedMessages();
      }, 100);
    });
    
    const chatArea = document.getElementById('chatMessages') || document.querySelector('.chat-area');
    if (chatArea) {
      observer.observe(chatArea, { childList: true, subtree: true });
    }
  });
})();