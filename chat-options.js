/**
 * Chat Options Manager
 * Handles user preferences and chat options
 */
(function() {
  // Available options
  const chatOptions = {
    emoji: {
      id: 'emoji-option',
      label: 'Emoji Reactions',
      icon: '😊',
      description: 'Enable emoji reactions on messages',
      default: true
    },
    sound: {
      id: 'sound-option',
      label: 'Message Sounds',
      icon: '🔊',
      description: 'Play sounds when messages are received',
      default: true
    },
    animation: {
      id: 'animation-option',
      label: 'Message Animations',
      icon: '✨',
      description: 'Show animations for new messages',
      default: true
    },
    background: {
      id: 'background-option',
      label: 'Custom Background',
      icon: '🖼️',
      description: 'Use custom chat background',
      default: false
    }
    // King option removed as requested
  };

  // Initialize options
  function initOptions() {
    // Create options panel
    const optionsPanel = document.createElement('div');
    optionsPanel.id = 'optionsPanel';
    optionsPanel.className = 'options-panel';
    optionsPanel.style.display = 'none';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'options-header';
    header.innerHTML = '<h3>Chat Options</h3><button id="closeOptions">×</button>';
    optionsPanel.appendChild(header);
    
    // Add options
    const optionsList = document.createElement('div');
    optionsList.className = 'options-list';
    
    // Create option toggles
    Object.keys(chatOptions).forEach(key => {
      const option = chatOptions[key];
      const optionItem = document.createElement('div');
      optionItem.className = 'option-item';
      
      // Get saved preference or use default
      const isEnabled = localStorage.getItem(`option_${key}`) !== null ? 
        localStorage.getItem(`option_${key}`) === 'true' : 
        option.default;
      
      optionItem.innerHTML = `
        <div class="option-info">
          <span class="option-icon">${option.icon}</span>
          <div class="option-text">
            <div class="option-label">${option.label}</div>
            <div class="option-description">${option.description}</div>
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" id="${option.id}" ${isEnabled ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      `;
      
      optionsList.appendChild(optionItem);
    });
    
    optionsPanel.appendChild(optionsList);
    document.body.appendChild(optionsPanel);
    
    // Add event listeners
    document.getElementById('closeOptions').addEventListener('click', toggleOptionsPanel);
    
    // Add change listeners to all option toggles
    Object.keys(chatOptions).forEach(key => {
      const option = chatOptions[key];
      const toggle = document.getElementById(option.id);
      if (toggle) {
        toggle.addEventListener('change', function() {
          saveOption(key, this.checked);
          applyOption(key, this.checked);
        });
        
        // Apply initial state
        applyOption(key, toggle.checked);
      }
    });
    
    // Add options button to header
    addOptionsButton();
  }
  
  // Add options button to the header
  function addOptionsButton() {
    const headerButtons = document.querySelector('.header-buttons');
    if (!headerButtons) return;
    
    const optionsButton = document.createElement('button');
    optionsButton.id = 'optionsButton';
    optionsButton.className = 'button';
    optionsButton.innerHTML = '⚙️';
    optionsButton.title = 'Chat Options';
    optionsButton.style.marginLeft = '5px';
    
    optionsButton.addEventListener('click', toggleOptionsPanel);
    headerButtons.appendChild(optionsButton);
  }
  
  // Toggle options panel visibility
  function toggleOptionsPanel() {
    const panel = document.getElementById('optionsPanel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }
  
  // Save option to localStorage
  function saveOption(key, value) {
    localStorage.setItem(`option_${key}`, value);
    console.log(`Option ${key} set to ${value}`);
  }
  
  // Apply option changes
  function applyOption(key, enabled) {
    switch(key) {
      case 'emoji':
        toggleEmojiFeature(enabled);
        break;
      case 'sound':
        toggleSoundFeature(enabled);
        break;
      case 'animation':
        toggleAnimationFeature(enabled);
        break;
      case 'background':
        toggleBackgroundFeature(enabled);
        break;
    }
  }
  
  // Toggle emoji feature
  function toggleEmojiFeature(enabled) {
    // Show/hide emoji button
    const emojiButton = document.getElementById('emojiButton');
    if (emojiButton) {
      emojiButton.style.display = enabled ? 'block' : 'none';
    }
    
    // Enable/disable emoji reactions
    document.documentElement.classList.toggle('emoji-disabled', !enabled);
    
    // Notify the app
    if (window.app) {
      app.emojiEnabled = enabled;
    }
  }
  
  // Toggle sound feature
  function toggleSoundFeature(enabled) {
    // Update sound toggle button if it exists
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
      soundToggle.classList.toggle('active', enabled);
    }
    
    // Notify the app
    if (window.app) {
      app.soundEnabled = enabled;
    }
  }
  
  // Toggle animation feature
  function toggleAnimationFeature(enabled) {
    document.documentElement.classList.toggle('animations-disabled', !enabled);
    
    // Notify the app
    if (window.app) {
      app.animationsEnabled = enabled;
    }
  }
  
  // Toggle background feature
  function toggleBackgroundFeature(enabled) {
    const backgroundBtn = document.getElementById('backgroundBtn');
    if (backgroundBtn) {
      backgroundBtn.style.display = enabled ? 'block' : 'none';
    }
    
    // Reset to default background if disabled
    if (!enabled) {
      const chatArea = document.querySelector('.chat-area');
      if (chatArea && window.changeBackground) {
        window.changeBackground('default');
      }
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for app to initialize
    setTimeout(initOptions, 1000);
  });
})();