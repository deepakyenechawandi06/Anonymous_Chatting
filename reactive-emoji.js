/**
 * Reactive Emoji - Makes emojis animate when sent in messages
 */
(function() {
  // Detect emojis in messages and make them reactive
  function makeEmojisReactive() {
    // Find all message content
    document.querySelectorAll('.message-content').forEach(content => {
      // Skip already processed messages
      if (content.getAttribute('data-emoji-reactive') === 'true') return;
      
      // Mark as processed
      content.setAttribute('data-emoji-reactive', 'true');
      
      // Find emojis in the message
      const emojiRegex = /([\p{Emoji}\u200d]+)/gu;
      content.innerHTML = content.innerHTML.replace(emojiRegex, (match) => {
        return `<span class="reactive-emoji">${match}</span>`;
      });
      
      // Add click event to each emoji
      content.querySelectorAll('.reactive-emoji').forEach(emoji => {
        emoji.addEventListener('click', () => {
          // Toggle animation class
          emoji.classList.add('emoji-animated');
          
          // Remove animation class after animation completes
          setTimeout(() => {
            emoji.classList.remove('emoji-animated');
          }, 1000);
        });
      });
    });
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Process existing messages
    makeEmojisReactive();
    
    // Set up observer for new messages
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          setTimeout(makeEmojisReactive, 100);
        }
      });
    });
    
    // Start observing chat area
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) {
      observer.observe(chatArea, { childList: true, subtree: true });
    }
  });
})();