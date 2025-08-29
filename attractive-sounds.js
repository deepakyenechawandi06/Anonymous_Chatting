/**
 * Attractive sound effects using Web Audio API
 */
(function() {
  // Create audio context
  let audioContext;
  
  // Initialize audio context on first user interaction
  document.addEventListener('click', function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    document.removeEventListener('click', initAudio);
  }, {once: true});
  
  // Play attractive send sound
  function playSendSound() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1); // E6
    
    // Configure envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Play sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
  
  // Play attractive receive sound
  function playReceiveSound() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1320, audioContext.currentTime); // E6
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // A5
    
    // Configure envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Play sound
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
  
  // Listen for send button clicks
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'sendBtn' || 
                    (e.target.parentElement && e.target.parentElement.id === 'sendBtn'))) {
      playSendSound();
    }
  });
  
  // Listen for Enter key in message input
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'messageInput') {
      playSendSound();
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
            playReceiveSound();
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