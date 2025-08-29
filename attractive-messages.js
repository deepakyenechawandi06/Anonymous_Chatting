/**
 * Attractive Message Effects with Vibration
 */
(function() {
  // Vibrate device if supported
  function vibrateDevice(pattern) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
  
  // Add attractive effects to messages
  function addMessageEffects() {
    document.querySelectorAll('.message').forEach(message => {
      if (message.getAttribute('data-attractive') === 'true') return;
      message.setAttribute('data-attractive', 'true');
      
      // Add entrance animation
      message.classList.add('message-entrance');
      
      // Add effects for sent messages
      if (message.classList.contains('sent')) {
        addSentEffects(message);
        vibrateDevice([50, 30, 50]); // Short vibration for sent
      }
      
      // Add effects for received messages
      if (message.classList.contains('received')) {
        addReceivedEffects(message);
        vibrateDevice([100, 50, 100, 50, 100]); // Longer vibration for received
      }
    });
  }
  
  // Enhanced effects for sent messages
  function addSentEffects(message) {
    // Add multiple sparkles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.innerHTML = ['✨', '⭐', '💫'][i % 3];
        sparkle.style.right = (10 + i * 15) + 'px';
        sparkle.style.top = (-10 - i * 5) + 'px';
        message.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
      }, i * 200);
    }
    
    // Add vibration effect to message
    message.classList.add('vibrate-sent');
    setTimeout(() => message.classList.remove('vibrate-sent'), 600);
  }
  
  // Enhanced effects for received messages
  function addReceivedEffects(message) {
    // Add glow and pulse effects
    message.classList.add('glow-effect', 'pulse-effect');
    
    // Add floating hearts
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-effect';
        heart.innerHTML = ['💖', '💕'][i % 2];
        heart.style.left = (10 + i * 20) + 'px';
        heart.style.top = (-10 - i * 5) + 'px';
        message.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
      }, i * 300);
    }
    
    // Add vibration effect to message
    message.classList.add('vibrate-received');
    setTimeout(() => {
      message.classList.remove('glow-effect', 'pulse-effect', 'vibrate-received');
    }, 1000);
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    addMessageEffects();
    
    const observer = new MutationObserver(() => {
      setTimeout(addMessageEffects, 50);
    });
    
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) {
      observer.observe(chatArea, { childList: true });
    }
  });
})();