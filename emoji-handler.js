/**
 * Emoji Handler - Adds animation and special effects to emojis in chat
 */
class EmojiHandler {
  constructor() {
    this.emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    this.animationTypes = ['bounce', 'pulse', 'spin', 'shake', 'fade'];
    this.commonEmojis = [
      '😀', '😂', '🥰', '😍', '😎', '🤔', '😢', '😡', 
      '👍', '👎', '❤️', '🔥', '🎉', '✨', '🙏', '👏'
    ];
    this.emojiDescriptions = {
      '😀': 'Grinning Face',
      '😂': 'Face with Tears of Joy',
      '🥰': 'Smiling Face with Hearts',
      '😍': 'Smiling Face with Heart-Eyes',
      '😎': 'Smiling Face with Sunglasses',
      '🤔': 'Thinking Face',
      '😢': 'Crying Face',
      '😡': 'Pouting Face',
      '👍': 'Thumbs Up',
      '👎': 'Thumbs Down',
      '❤️': 'Red Heart',
      '🔥': 'Fire',
      '🎉': 'Party Popper',
      '✨': 'Sparkles',
      '🙏': 'Folded Hands',
      '👏': 'Clapping Hands'
    };
  }

  // Process message content to add emoji animations
  processMessageContent(content) {
    return content.replace(this.emojiRegex, (match) => {
      const animationType = this.getRandomAnimationType();
      const description = this.emojiDescriptions[match] || 'Emoji';
      
      return `<span class="emoji emoji-${animationType} reactive-emoji" data-emoji="${match}">
                ${match}
                <span class="emoji-tooltip">${description}</span>
              </span>`;
    });
  }

  // Get a random animation type
  getRandomAnimationType() {
    const index = Math.floor(Math.random() * this.animationTypes.length);
    return this.animationTypes[index];
  }

  // Initialize emoji picker
  initEmojiPicker() {
    // Create emoji picker element
    const emojiPicker = document.createElement('div');
    emojiPicker.className = 'emoji-picker';
    emojiPicker.id = 'emojiPicker';
    
    // Add common emojis to the picker
    this.commonEmojis.forEach(emoji => {
      const emojiItem = document.createElement('div');
      emojiItem.className = 'emoji-picker-item';
      emojiItem.textContent = emoji;
      emojiItem.title = this.emojiDescriptions[emoji] || 'Emoji';
      
      emojiItem.addEventListener('click', () => {
        const messageInput = document.getElementById('messageInput');
        messageInput.value += emoji;
        messageInput.focus();
        this.toggleEmojiPicker();
      });
      
      emojiPicker.appendChild(emojiItem);
    });
    
    document.body.appendChild(emojiPicker);
    
    // Add emoji button to message input
    const messageForm = document.getElementById('messageForm');
    const emojiButton = document.createElement('button');
    emojiButton.type = 'button';
    emojiButton.className = 'emoji-button';
    emojiButton.innerHTML = '😊';
    emojiButton.title = 'Insert emoji';
    emojiButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleEmojiPicker();
    });
    
    // Insert emoji button before the send button
    const sendButton = messageForm.querySelector('button[type="submit"]');
    messageForm.insertBefore(emojiButton, sendButton);
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.emoji-button') && !e.target.closest('.emoji-picker')) {
        document.getElementById('emojiPicker').classList.remove('active');
      }
    });
  }
  
  // Toggle emoji picker visibility
  toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.classList.toggle('active');
    
    // Position the picker
    if (picker.classList.contains('active')) {
      const emojiButton = document.querySelector('.emoji-button');
      const rect = emojiButton.getBoundingClientRect();
      
      picker.style.bottom = 'auto';
      picker.style.top = `${rect.bottom + window.scrollY + 5}px`;
      picker.style.left = `${rect.left + window.scrollX}px`;
    }
  }
  
  // Add click event to emojis for animation change
  addEmojiClickEvents() {
    document.querySelectorAll('.emoji').forEach(emoji => {
      emoji.addEventListener('click', () => {
        // Change animation on click
        const currentClass = this.animationTypes.find(type => 
          emoji.classList.contains(`emoji-${type}`)
        );
        
        if (currentClass) {
          emoji.classList.remove(`emoji-${currentClass}`);
          
          // Get next animation type
          const currentIndex = this.animationTypes.indexOf(currentClass);
          const nextIndex = (currentIndex + 1) % this.animationTypes.length;
          const nextType = this.animationTypes[nextIndex];
          
          emoji.classList.add(`emoji-${nextType}`);
        }
      });
    });
  }
  
  // Initialize all emoji features
  init() {
    this.initEmojiPicker();
    
    // Process existing messages
    document.querySelectorAll('.message-content').forEach(content => {
      content.innerHTML = this.processMessageContent(content.innerHTML);
    });
    
    this.addEmojiClickEvents();
    
    // Add observer for new messages
    const chatMessages = document.getElementById('chatMessages');
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('message')) {
              const content = node.querySelector('.message-content');
              if (content) {
                content.innerHTML = this.processMessageContent(content.innerHTML);
              }
            }
          });
          this.addEmojiClickEvents();
        }
      });
    });
    
    observer.observe(chatMessages, { childList: true, subtree: true });
  }
}

// Initialize emoji handler when the page loads
window.addEventListener('DOMContentLoaded', () => {
  window.emojiHandler = new EmojiHandler();
  window.emojiHandler.init();
});