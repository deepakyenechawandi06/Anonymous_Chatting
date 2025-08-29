/**
 * Super simple sound implementation
 */
(function() {
  // Play sound when send button is clicked
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'sendBtn' || 
                     (e.target.parentElement && e.target.parentElement.id === 'sendBtn'))) {
      // Play a simple beep sound
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.5;
      
      oscillator.start(0);
      setTimeout(function() {
        oscillator.stop();
      }, 200);
    }
  });
  
  // Play sound when a message is received
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.classList && node.classList.contains('message') && 
              node.classList.contains('received')) {
            // Play a simple beep sound
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 600;
            gainNode.gain.value = 0.5;
            
            oscillator.start(0);
            setTimeout(function() {
              oscillator.stop();
            }, 200);
            
            break;
          }
        }
      }
    });
  });
  
  // Start observing the chat area
  document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      observer.observe(chatMessages, { childList: true, subtree: true });
    }
  });
})();