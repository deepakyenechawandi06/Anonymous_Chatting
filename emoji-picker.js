/**
 * Simple emoji picker for chat
 */
(function() {
  // Common emojis
  const commonEmojis = [
    '😀', '😂', '🥰', '😍', '😎', '😊', 
    '👍', '👎', '❤️', '🔥', '🎉', '👏',
    '🤔', '😢', '😭', '😡', '🙏', '👋'
  ];
  
  // Create emoji picker
  function createEmojiPicker() {
    const emojiPicker = document.createElement('div');
    emojiPicker.id = 'emojiPicker';
    emojiPicker.style.display = 'none';
    emojiPicker.style.position = 'absolute';
    emojiPicker.style.bottom = '60px';
    emojiPicker.style.left = '10px';
    emojiPicker.style.backgroundColor = 'white';
    emojiPicker.style.border = '1px solid #ddd';
    emojiPicker.style.borderRadius = '8px';
    emojiPicker.style.padding = '8px';
    emojiPicker.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    emojiPicker.style.zIndex = '1000';
    emojiPicker.style.display = 'grid';
    emojiPicker.style.gridTemplateColumns = 'repeat(6, 1fr)';
    emojiPicker.style.gap = '8px';
    
    // Add emojis
    commonEmojis.forEach(emoji => {
      const emojiBtn = document.createElement('div');
      emojiBtn.textContent = emoji;
      emojiBtn.style.fontSize = '24px';
      emojiBtn.style.cursor = 'pointer';
      emojiBtn.style.textAlign = 'center';
      emojiBtn.style.width = '36px';
      emojiBtn.style.height = '36px';
      emojiBtn.style.borderRadius = '4px';
      emojiBtn.style.transition = 'background-color 0.2s';
      
      emojiBtn.addEventListener('mouseover', () => {
        emojiBtn.style.backgroundColor = '#f0f0f0';
      });
      
      emojiBtn.addEventListener('mouseout', () => {
        emojiBtn.style.backgroundColor = 'transparent';
      });
      
      emojiBtn.addEventListener('click', () => {
        insertEmoji(emoji);
        toggleEmojiPicker();
      });
      
      emojiPicker.appendChild(emojiBtn);
    });
    
    document.body.appendChild(emojiPicker);
    return emojiPicker;
  }
  
  // Toggle emoji picker visibility
  function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker') || createEmojiPicker();
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'grid' : 'none';
    
    // Position the picker
    if (emojiPicker.style.display !== 'none') {
      const messageInput = document.getElementById('messageInput');
      const inputRect = messageInput.getBoundingClientRect();
      emojiPicker.style.bottom = (window.innerHeight - inputRect.top + 10) + 'px';
      emojiPicker.style.left = inputRect.left + 'px';
    }
  }
  
  // Insert emoji into input
  function insertEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      const start = messageInput.selectionStart;
      const end = messageInput.selectionEnd;
      const text = messageInput.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      messageInput.value = before + emoji + after;
      messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
      messageInput.focus();
    }
  }
  
  // Add emoji button to message input
  document.addEventListener('DOMContentLoaded', function() {
    // Find the message input container
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    // Create emoji button
    const emojiButton = document.createElement('button');
    emojiButton.id = 'emojiButton';
    emojiButton.innerHTML = '😊';
    emojiButton.className = 'button';
    emojiButton.style.marginBottom = '0';
    emojiButton.style.padding = '8px 12px';
    emojiButton.style.fontSize = '16px';
    emojiButton.title = 'Insert emoji';
    
    // Add click event
    emojiButton.addEventListener('click', function(e) {
      e.preventDefault();
      toggleEmojiPicker();
    });
    
    // Add button to message buttons container
    const messageButtons = document.querySelector('.message-buttons');
    if (messageButtons) {
      // Insert before the image button
      const imageBtn = document.getElementById('imageBtn');
      if (imageBtn) {
        messageButtons.insertBefore(emojiButton, imageBtn);
      } else {
        messageButtons.appendChild(emojiButton);
      }
    }
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', function(e) {
      if (e.target.id !== 'emojiButton' && e.target.id !== 'emojiPicker' && 
          !e.target.closest('#emojiPicker')) {
        const emojiPicker = document.getElementById('emojiPicker');
        if (emojiPicker && emojiPicker.style.display !== 'none') {
          emojiPicker.style.display = 'none';
        }
      }
    });
  });
})();