// Fix for message text visibility
document.addEventListener('DOMContentLoaded', () => {
  // Function to ensure text is visible in messages
  function fixMessageText() {
    // Get all messages
    const messages = document.querySelectorAll('.message');
    
    // Fix text visibility for each message
    messages.forEach(msg => {
      const paragraphs = msg.querySelectorAll('p');
      paragraphs.forEach(p => {
        // Ensure text is visible
        p.style.color = msg.classList.contains('sent') ? 'white' : '#1f2937';
        p.style.visibility = 'visible';
        p.style.opacity = '1';
      });
    });
  }

  // Watch for new messages
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        // Check if any new messages were added
        const newMessages = Array.from(mutation.addedNodes).filter(
          node => node.classList && node.classList.contains('message')
        );
        
        if (newMessages.length > 0) {
          // Fix text visibility for new messages
          newMessages.forEach(msg => {
            const paragraphs = msg.querySelectorAll('p');
            paragraphs.forEach(p => {
              p.style.color = msg.classList.contains('sent') ? 'white' : '#1f2937';
              p.style.visibility = 'visible';
              p.style.opacity = '1';
            });
          });
        }
      }
    });
  });

  // Start observing the chat area
  const chatArea = document.getElementById('chatMessages');
  if (chatArea) {
    observer.observe(chatArea, { childList: true, subtree: true });
    
    // Initial fix for existing messages
    setTimeout(fixMessageText, 100);
  }
});