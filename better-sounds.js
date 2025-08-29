/**
 * Better message sound effects
 */
(function() {
  // Create audio elements with nicer notification sounds
  const sendSound = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
  const receiveSound = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1153-quite-impressed.mp3");
  
  // Set volume
  sendSound.volume = 0.4;
  receiveSound.volume = 0.4;
  
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