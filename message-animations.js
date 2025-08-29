// Add animation classes to new messages
document.addEventListener('DOMContentLoaded', () => {
  // Function to add animation class to new messages
  const addAnimationToNewMessages = () => {
    // Watch for new messages being added to the chat
    const chatObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('message')) {
              if (node.classList.contains('received')) {
                node.classList.add('new-message');
                // Remove the class after animation completes
                setTimeout(() => {
                  node.classList.remove('new-message');
                }, 2000);
              }
            }
          });
        }
      });
    });

    // Start observing the chat area
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) {
      chatObserver.observe(chatArea, { childList: true, subtree: true });
    }
  };

  // Initialize animations
  addAnimationToNewMessages();
});