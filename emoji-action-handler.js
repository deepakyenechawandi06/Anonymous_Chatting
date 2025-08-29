/**
 * Emoji Action Handler
 * Processes emoji actions and displays them as real-life animations
 */
(function() {
  // Store emoji action data
  const emojiActionData = {
    // Track active emoji animations
    activeAnimations: {},
    
    // Sound effects for emoji actions (if enabled)
    soundEffects: {
      '👋': 'whoosh',
      '👍': 'pop',
      '👎': 'thud',
      '👏': 'clap',
      '🔥': 'sizzle',
      '❤️': 'heartbeat',
      '😂': 'laugh',
      '🎉': 'party'
    }
  };
  
  // Process emoji action in chat
  function processEmojiAction(data) {
    // Create a unique ID for this animation
    const animationId = `emoji-action-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    // Create the emoji action element
    const actionElement = document.createElement('div');
    actionElement.id = animationId;
    actionElement.className = 'emoji-action-fullscreen';
    
    // Add the emoji with its animation class
    actionElement.innerHTML = `
      <div class="emoji-action-wrapper ${data.animation || ''}">
        <div class="emoji-action-emoji">${data.emoji}</div>
        <div class="emoji-action-user">${data.sender || 'Someone'}</div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(actionElement);
    
    // Play sound effect if enabled
    if (window.app && window.app.soundEnabled !== false && data.emoji && emojiActionData.soundEffects[data.emoji]) {
      playEmojiSound(emojiActionData.soundEffects[data.emoji]);
    }
    
    // Store animation reference
    emojiActionData.activeAnimations[animationId] = {
      element: actionElement,
      timestamp: Date.now()
    };
    
    // Remove after animation completes
    setTimeout(() => {
      if (actionElement.parentNode) {
        actionElement.classList.add('emoji-action-exit');
        
        setTimeout(() => {
          if (actionElement.parentNode) {
            actionElement.parentNode.removeChild(actionElement);
          }
          delete emojiActionData.activeAnimations[animationId];
        }, 1000);
      }
    }, 3000);
    
    return true;
  }
  
  // Play emoji sound effect
  function playEmojiSound(soundName) {
    // Check if sound module exists
    if (!window.soundEffects) return;
    
    // Play the sound
    window.soundEffects.play(soundName);
  }
  
  // Create sound effects for emoji actions
  function createEmojiSoundEffects() {
    // Check if sound module exists, if not create it
    if (!window.soundEffects) {
      window.soundEffects = {
        sounds: {},
        
        // Initialize a sound
        init: function(name, url) {
          this.sounds[name] = new Audio(url);
        },
        
        // Play a sound
        play: function(name) {
          if (this.sounds[name]) {
            // Clone the audio to allow overlapping sounds
            const sound = this.sounds[name].cloneNode();
            sound.volume = 0.5;
            sound.play().catch(e => console.log('Sound play error:', e));
          }
        }
      };
      
      // Initialize emoji sounds
      window.soundEffects.init('whoosh', 'sounds/whoosh.mp3');
      window.soundEffects.init('pop', 'sounds/pop.mp3');
      window.soundEffects.init('thud', 'sounds/thud.mp3');
      window.soundEffects.init('clap', 'sounds/clap.mp3');
      window.soundEffects.init('sizzle', 'sounds/sizzle.mp3');
      window.soundEffects.init('heartbeat', 'sounds/heartbeat.mp3');
      window.soundEffects.init('laugh', 'sounds/laugh.mp3');
      window.soundEffects.init('party', 'sounds/party.mp3');
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to initialize
    setTimeout(() => {
      // Create sound effects
      createEmojiSoundEffects();
      
      // Add message handler for emoji actions
      if (window.app && window.app.ws) {
        const originalOnMessage = window.app.ws.onmessage;
        window.app.ws.onmessage = function(event) {
          // Call original handler
          originalOnMessage.call(this, event);
          
          // Process as emoji action if applicable
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'emoji-action') {
              processEmojiAction(data);
            }
          } catch (err) {
            // Ignore parsing errors
          }
        };
      }
      
      // Add custom emoji action method to app
      if (window.app) {
        window.app.sendEmojiAction = function(emoji, animation) {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              type: 'emoji-action',
              emoji: emoji,
              animation: animation,
              sender: this.username || 'You',
              groupId: this.groupId
            }));
            return true;
          }
          return false;
        };
      }
    }, 1000);
  });
})();