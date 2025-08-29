/**
 * Shared sound effects for both sender and receiver
 */
(function() {
  // Create audio context
  let audioContext;
  
  // Initialize audio context on first user interaction
  document.addEventListener('click', function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    document.removeEventListener('click', initAudio);
  }, {once: true});
  
  // Play notification sound - same for both send and receive
  function playNotificationSound() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound - pleasant notification tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1); // E6
    oscillator.frequency.exponentialRampToValueAtTime(1100, audioContext.currentTime + 0.2); // D6-ish
    
    // Configure envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Play sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
  
  // Listen for send button clicks
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'sendBtn' || 
                    (e.target.parentElement && e.target.parentElement.id === 'sendBtn'))) {
      playNotificationSound();
    }
  });
  
  // Listen for Enter key in message input
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'messageInput') {
      playNotificationSound();
    }
  });
  
  // Listen for new messages
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.classList && node.classList.contains('message') && 
              node.classList.contains('received')) {
            playNotificationSound();
            break;
          }
        }
      }
    });
  });
  
  // Start observing when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      observer.observe(chatMessages, { childList: true, subtree: true });
    }
  });
})();