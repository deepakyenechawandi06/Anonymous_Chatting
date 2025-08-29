// Add animations to chat interface
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Add animation to messages when they appear
    const addMessageAnimations = () => {
      // Observer for new messages
      const chatArea = document.getElementById('chatMessages');
      if (!chatArea) return;
      
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              if (node.classList && node.classList.contains('message')) {
                animateMessage(node);
              }
            });
          }
        });
      });
      
      observer.observe(chatArea, { childList: true, subtree: true });
      
      // Animate existing messages with delay
      document.querySelectorAll('.message').forEach((msg, index) => {
        setTimeout(() => {
          animateMessage(msg);
        }, index * 100);
      });
    };
    
    // Animate a single message
    const animateMessage = (messageEl) => {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        messageEl.style.transition = 'all 0.3s ease-out';
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
      }, 10);
    };
    
    // Add hover effects to buttons
    const addButtonEffects = () => {
      document.querySelectorAll('.button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'translateY(-2px)';
          btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
        
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
          btn.style.boxShadow = '';
        });
      });
    };
    
    // Add pulse effect to the send button
    const addSendButtonEffect = () => {
      const sendBtn = document.getElementById('sendBtn');
      if (sendBtn) {
        sendBtn.classList.add('pulse-button');
      }
    };
    
    // Initialize animations
    addMessageAnimations();
    addButtonEffects();
    addSendButtonEffect();
    
    console.log('Chat animations initialized');
  }, 1000);
});