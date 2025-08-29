/**
 * Message sound effects with pleasant notification sounds
 */
(function() {
  // Create audio elements with notification sounds
  const sendSound = new Audio("https://cdn.freesound.org/previews/320/320181_5260872-lq.mp3");
  const receiveSound = new Audio("https://cdn.freesound.org/previews/264/264594_5052308-lq.mp3");
  
  // Set volume
  sendSound.volume = 0.5;
  receiveSound.volume = 0.5;
  
  // Override the original sendMessage function
  const originalSendMessage = app.sendMessage;
  app.sendMessage = function(text) {
    const result = originalSendMessage.call(this, text);
    if (result) {
      sendSound.play().catch(e => {});
    }
    return result;
  };
  
  // Listen for new messages
  document.addEventListener('DOMNodeInserted', function(e) {
    if (e.target.classList && 
        e.target.classList.contains('message') && 
        e.target.classList.contains('received')) {
      receiveSound.play().catch(e => {});
    }
  });
})();