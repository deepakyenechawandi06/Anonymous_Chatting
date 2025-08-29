/**
 * Emoji Reactions - Adds reaction functionality to chat messages
 */
class EmojiReactions {
  constructor() {
    this.commonReactions = ['👍', '❤️', '😂', '😮', '😢', '👏'];
  }

  // Initialize reaction functionality
  init() {
    // Add reaction button to messages
    document.querySelectorAll('.message').forEach(message => {
      this.addReactionButton(message);
    });
    
    // Observer for new messages
    const chatMessages = document.getElementById('chatMessages');
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('message')) {
              this.addReactionButton(node);
            }
          });
        }
      });
    });
    
    observer.observe(chatMessages, { childList: true });
  }
  
  // Add reaction button to a message
  addReactionButton(messageEl) {
    // Check if reaction button already exists
    if (messageEl.querySelector('.reaction-button')) return;
    
    const messageActions = messageEl.querySelector('.message-actions');
    if (!messageActions) return;
    
    // Create reaction button
    const reactionButton = document.createElement('button');
    reactionButton.className = 'reaction-button';
    reactionButton.innerHTML = '😀';
    reactionButton.title = 'Add reaction';
    
    // Create reaction picker
    const reactionPicker = document.createElement('div');
    reactionPicker.className = 'emoji-picker reaction-picker';
    
    // Add common reactions
    this.commonReactions.forEach(emoji => {
      const emojiItem = document.createElement('div');
      emojiItem.className = 'emoji-picker-item';
      emojiItem.textContent = emoji;
      
      emojiItem.addEventListener('click', (e) => {
        e.stopPropagation();
        this.addReaction(messageEl, emoji);
        reactionPicker.classList.remove('active');
      });
      
      reactionPicker.appendChild(emojiItem);
    });
    
    // Add reaction picker to message
    messageEl.appendChild(reactionPicker);
    
    // Toggle reaction picker on button click
    reactionButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      reactionPicker.classList.toggle('active');
      
      if (reactionPicker.classList.contains('active')) {
        const rect = reactionButton.getBoundingClientRect();
        
        reactionPicker.style.bottom = 'auto';
        reactionPicker.style.top = `${rect.bottom + window.scrollY + 5}px`;
        reactionPicker.style.left = `${rect.left + window.scrollX}px`;
      }
    });
    
    // Close reaction picker when clicking outside
    document.addEventListener('click', () => {
      reactionPicker.classList.remove('active');
    });
    
    // Add reaction container
    const reactionsContainer = document.createElement('div');
    reactionsContainer.className = 'emoji-reactions';
    messageEl.appendChild(reactionsContainer);
    
    // Add button to message actions
    messageActions.appendChild(reactionButton);
  }
  
  // Add a reaction to a message
  addReaction(messageEl, emoji) {
    const messageId = messageEl.getAttribute('data-message-id');
    const reactionsContainer = messageEl.querySelector('.emoji-reactions');
    
    // Check if reaction already exists
    let reactionEl = Array.from(reactionsContainer.children).find(
      el => el.getAttribute('data-emoji') === emoji
    );
    
    if (reactionEl) {
      // Increment count
      const countEl = reactionEl.querySelector('.emoji-reaction-count');
      let count = parseInt(countEl.textContent);
      countEl.textContent = count + 1;
      
      // Add animation effect
      reactionEl.classList.add('emoji-pulse');
      setTimeout(() => {
        reactionEl.classList.remove('emoji-pulse');
      }, 1000);
    } else {
      // Create new reaction
      reactionEl = document.createElement('div');
      reactionEl.className = 'emoji-reaction emoji-pulse';
      reactionEl.setAttribute('data-emoji', emoji);
      reactionEl.innerHTML = `
        <span class="emoji">${emoji}</span>
        <span class="emoji-reaction-count">1</span>
      `;
      
      // Remove animation after a delay
      setTimeout(() => {
        reactionEl.classList.remove('emoji-pulse');
      }, 1000);
      
      reactionsContainer.appendChild(reactionEl);
    }
    
    // In a real app, you would send this reaction to the server
    console.log(`Added reaction ${emoji} to message ${messageId}`);
  }
}

// Initialize emoji reactions when the page loads
window.addEventListener('DOMContentLoaded', () => {
  window.emojiReactions = new EmojiReactions();
  window.emojiReactions.init();
});