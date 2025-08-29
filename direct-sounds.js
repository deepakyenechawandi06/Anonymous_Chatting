/**
 * Direct sound implementation with inline audio
 */
(function() {
  // Create audio elements
  const sendAudio = document.createElement('audio');
  sendAudio.id = 'sendSound';
  sendAudio.src = 'https://www.soundjay.com/buttons/sounds/button-09.mp3';
  
  const receiveAudio = document.createElement('audio');
  receiveAudio.id = 'receiveSound';
  receiveAudio.src = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
  
  // Add to document
  document.body.appendChild(sendAudio);
  document.body.appendChild(receiveAudio);
  
  // Direct implementation in app.sendMessage
  window.addEventListener('DOMContentLoaded', function() {
    // Add click handler to send button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', function() {
        document.getElementById('sendSound').play();
      });
    }
    
    // Add keypress handler to input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
      messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('sendSound').play();
        }
      });
    }
    
    // Add observer for received messages
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              if (node.classList && node.classList.contains('received')) {
                document.getElementById('receiveSound').play();
                break;
              }
            }
          }
        });
      });
      
      observer.observe(chatMessages, { childList: true, subtree: true });
    }
  });
})();