/**
 * Script to fix input text visibility issues
 */
(function() {
  // Run immediately and then periodically
  fixInputVisibility();
  setInterval(fixInputVisibility, 300);
  
  function fixInputVisibility() {
    // Fix message input specifically
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.style.color = '#000000';
      messageInput.style.backgroundColor = '#ffffff';
      messageInput.style.visibility = 'visible';
      messageInput.style.opacity = '1';
      messageInput.style.caretColor = '#000000';
      messageInput.style.textShadow = 'none';
      
      // Add event listener to ensure text remains visible while typing
      if (!messageInput.dataset.listenerAdded) {
        messageInput.addEventListener('input', function() {
          this.style.color = '#000000';
          this.style.visibility = 'visible';
          this.style.opacity = '1';
        });
        messageInput.dataset.listenerAdded = 'true';
      }
    }
    
    // Fix all input elements
    document.querySelectorAll('input, textarea').forEach(function(input) {
      input.style.color = '#000000';
      input.style.backgroundColor = '#ffffff';
      input.style.visibility = 'visible';
      input.style.opacity = '1';
      input.style.caretColor = '#000000';
      input.style.textShadow = 'none';
      
      // Add event listener to ensure text remains visible while typing
      if (!input.dataset.listenerAdded) {
        input.addEventListener('input', function() {
          this.style.color = '#000000';
          this.style.visibility = 'visible';
          this.style.opacity = '1';
        });
        input.dataset.listenerAdded = 'true';
      }
    });
    
    // Fix message input container
    const messageInputContainer = document.querySelector('.message-input');
    if (messageInputContainer) {
      const inputElements = messageInputContainer.querySelectorAll('input');
      inputElements.forEach(function(input) {
        input.style.color = '#000000';
        input.style.backgroundColor = '#ffffff';
        input.style.visibility = 'visible';
        input.style.opacity = '1';
        input.style.caretColor = '#000000';
      });
    }
    
    // Fix any potential parent elements that might be affecting visibility
    const inputParents = document.querySelectorAll('.message-input, .input-container, .chat-input');
    inputParents.forEach(function(parent) {
      parent.style.color = 'inherit';
      parent.style.visibility = 'visible';
      parent.style.opacity = '1';
    });
  }
})();