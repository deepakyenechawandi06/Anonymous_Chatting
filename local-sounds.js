/**
 * Message sound effects with local audio
 */
(function() {
  // Create audio elements
  const sendSound = new Audio();
  const receiveSound = new Audio();
  
  // Set audio sources
  sendSound.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  receiveSound.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  
  // Set volume
  sendSound.volume = 1.0;
  receiveSound.volume = 1.0;
  
  // Preload sounds
  sendSound.load();
  receiveSound.load();
  
  // Add direct sound to send button
  document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', function() {
        sendSound.currentTime = 0;
        sendSound.play();
      });
    }
  });
  
  // Override the original sendMessage function
  const originalSendMessage = app.sendMessage;
  app.sendMessage = function(text) {
    const result = originalSendMessage.call(this, text);
    if (result) {
      // Play sound directly
      sendSound.currentTime = 0;
      const playPromise = sendSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log("Sound play failed:", e);
        });
      }
    }
    return result;
  };
  
  // Listen for new messages
  document.addEventListener('DOMNodeInserted', function(e) {
    if (e.target.classList && 
        e.target.classList.contains('message') && 
        e.target.classList.contains('received')) {
      receiveSound.currentTime = 0;
      receiveSound.play().catch(e => {});
    }
  });
  
  // Play a test sound to unlock audio
  document.addEventListener('click', function() {
    sendSound.volume = 0.01;
    sendSound.play().catch(e => {});
    sendSound.volume = 1.0;
  }, {once: true});
})();