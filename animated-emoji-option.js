/**
 * Animated Emoji Option
 * Adds interactive emoji animations that simulate real actions
 */
(function() {
  // Emoji actions with their animations
  const emojiActions = {
    '👋': { name: 'Wave', animation: 'wave-animation', description: 'Waves hello' },
    '👍': { name: 'Thumbs Up', animation: 'thumbs-up-animation', description: 'Shows approval' },
    '👎': { name: 'Thumbs Down', animation: 'thumbs-down-animation', description: 'Shows disapproval' },
    '👏': { name: 'Clap', animation: 'clap-animation', description: 'Applauds' },
    '🔥': { name: 'Fire', animation: 'fire-animation', description: 'Burns with excitement' },
    '❤️': { name: 'Heart', animation: 'heart-animation', description: 'Shows love' },
    '😂': { name: 'Laugh', animation: 'laugh-animation', description: 'Laughs out loud' },
    '🎉': { name: 'Party', animation: 'party-animation', description: 'Celebrates' }
  };

  // Create emoji option panel
  function createEmojiOptionPanel() {
    const panel = document.createElement('div');
    panel.id = 'emojiOptionPanel';
    panel.className = 'emoji-option-panel';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'emoji-option-header';
    header.innerHTML = '<h3>Animated Emojis</h3><button id="closeEmojiOption">×</button>';
    panel.appendChild(header);
    
    // Create emoji grid
    const emojiGrid = document.createElement('div');
    emojiGrid.className = 'emoji-grid';
    
    // Add emojis to grid
    Object.keys(emojiActions).forEach(emoji => {
      const action = emojiActions[emoji];
      const emojiItem = document.createElement('div');
      emojiItem.className = 'emoji-action-item';
      emojiItem.innerHTML = `
        <div class="emoji-display ${action.animation}" data-emoji="${emoji}">
          ${emoji}
        </div>
        <div class="emoji-action-name">${action.name}</div>
      `;
      
      // Add click event to send animated emoji
      emojiItem.addEventListener('click', () => {
        sendAnimatedEmoji(emoji);
        toggleEmojiOptionPanel();
      });
      
      emojiGrid.appendChild(emojiItem);
    });
    
    panel.appendChild(emojiGrid);
    document.body.appendChild(panel);
    
    // Add close button event
    document.getElementById('closeEmojiOption').addEventListener('click', toggleEmojiOptionPanel);
    
    return panel;
  }
  
  // Toggle emoji option panel
  function toggleEmojiOptionPanel() {
    const panel = document.getElementById('emojiOptionPanel') || createEmojiOptionPanel();
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
  
  // Send animated emoji as a special message
  function sendAnimatedEmoji(emoji) {
    if (!emoji || !emojiActions[emoji]) return;
    
    const action = emojiActions[emoji];
    
    // Create special emoji message
    if (window.app && window.app.ws && window.app.ws.readyState === WebSocket.OPEN) {
      // Send as special emoji action message
      window.app.ws.send(JSON.stringify({
        type: 'emoji-action',
        emoji: emoji,
        animation: action.animation,
        description: action.description,
        groupId: window.app.groupId
      }));
    }
  }
  
  // Process incoming emoji action messages
  function processEmojiActionMessage(data) {
    if (!data.emoji || !data.animation) return false;
    
    // Create special emoji message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message emoji-action-message';
    
    // Add sender info if available
    if (data.sender) {
      const senderSpan = document.createElement('span');
      senderSpan.className = 'emoji-action-sender';
      senderSpan.textContent = data.sender;
      messageDiv.appendChild(senderSpan);
    }
    
    // Create emoji container
    const emojiContainer = document.createElement('div');
    emojiContainer.className = `emoji-action-container ${data.animation}`;
    emojiContainer.innerHTML = `
      <div class="emoji-action-display">${data.emoji}</div>
      <div class="emoji-action-description">${data.description || ''}</div>
    `;
    
    messageDiv.appendChild(emojiContainer);
    
    // Add to chat
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    return true;
  }
  
  // Add emoji option button to the interface
  function addEmojiOptionButton() {
    // Find the message input area
    const messageForm = document.getElementById('messageForm');
    if (!messageForm) return;
    
    // Create emoji option button
    const emojiOptionBtn = document.createElement('button');
    emojiOptionBtn.id = 'emojiOptionBtn';
    emojiOptionBtn.className = 'emoji-option-btn';
    emojiOptionBtn.innerHTML = '😊';
    emojiOptionBtn.title = 'Animated Emojis';
    
    // Add click event
    emojiOptionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleEmojiOptionPanel();
    });
    
    // Add to message form
    const sendButton = messageForm.querySelector('button[type="submit"]');
    if (sendButton) {
      messageForm.insertBefore(emojiOptionBtn, sendButton);
    } else {
      messageForm.appendChild(emojiOptionBtn);
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to initialize
    setTimeout(() => {
      // Add emoji option button
      addEmojiOptionButton();
      
      // Override message handler to process emoji actions
      if (window.app && window.app.ws) {
        const originalOnMessage = window.app.ws.onmessage;
        window.app.ws.onmessage = function(event) {
          // Call original handler first
          originalOnMessage.call(this, event);
          
          // Process as emoji action if applicable
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'emoji-action') {
              processEmojiActionMessage(data);
            }
          } catch (err) {
            // Ignore parsing errors
          }
        };
      }
    }, 1000);
  });
})();