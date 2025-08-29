/**
 * Emoji Effects - Adds special visual effects for specific emojis
 */
class EmojiEffects {
  constructor() {
    // Map of emojis to their special effects
    this.specialEffects = {
      '🎉': this.confettiEffect,
      '✨': this.sparkleEffect,
      '❤️': this.heartEffect,
      '🔥': this.fireEffect,
      '💧': this.waterDropEffect,
      '🌈': this.rainbowEffect
    };
  }

  // Initialize emoji effects
  init() {
    // Process messages for special effects
    document.querySelectorAll('.message-content').forEach(content => {
      this.processForSpecialEffects(content);
    });
    
    // Observer for new messages
    const chatMessages = document.getElementById('chatMessages');
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.classList && node.classList.contains('message')) {
              const content = node.querySelector('.message-content');
              if (content) {
                this.processForSpecialEffects(content);
              }
            }
          });
        }
      });
    });
    
    observer.observe(chatMessages, { childList: true, subtree: true });
  }
  
  // Process message content for special effects
  processForSpecialEffects(contentEl) {
    const text = contentEl.textContent;
    
    // Check for special emojis
    Object.keys(this.specialEffects).forEach(emoji => {
      if (text.includes(emoji)) {
        // Find the emoji element
        contentEl.querySelectorAll('.emoji').forEach(emojiEl => {
          if (emojiEl.getAttribute('data-emoji') === emoji) {
            // Apply special effect
            this.specialEffects[emoji](emojiEl);
            
            // Add special class
            emojiEl.classList.add('emoji-special');
          }
        });
      }
    });
  }
  
  // Confetti effect for 🎉
  confettiEffect(element) {
    element.addEventListener('click', () => {
      // Create confetti container
      const confettiContainer = document.createElement('div');
      confettiContainer.className = 'confetti-container';
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.top = '0';
      confettiContainer.style.left = '0';
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '9999';
      
      document.body.appendChild(confettiContainer);
      
      // Create confetti pieces
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                     '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50'];
      
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = '-10px';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.opacity = Math.random() + 0.5;
        
        // Animation
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        confettiContainer.appendChild(confetti);
      }
      
      // Remove confetti after animation
      setTimeout(() => {
        document.body.removeChild(confettiContainer);
      }, 5000);
    });
    
    // Add fall animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Sparkle effect for ✨
  sparkleEffect(element) {
    element.addEventListener('click', () => {
      // Create sparkles around the element
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.position = 'fixed';
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.backgroundColor = 'gold';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        
        // Random position around the emoji
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 20;
        sparkle.style.left = `${centerX + Math.cos(angle) * distance}px`;
        sparkle.style.top = `${centerY + Math.sin(angle) * distance}px`;
        
        // Animation
        sparkle.style.animation = 'sparkle 1s forwards';
        
        document.body.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => {
          document.body.removeChild(sparkle);
        }, 1000);
      }
    });
    
    // Add sparkle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sparkle {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Heart effect for ❤️
  heartEffect(element) {
    element.addEventListener('click', () => {
      // Create floating heart
      const heart = document.createElement('div');
      heart.textContent = '❤️';
      heart.style.position = 'fixed';
      heart.style.fontSize = '24px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      
      // Position at the emoji
      const rect = element.getBoundingClientRect();
      heart.style.left = `${rect.left}px`;
      heart.style.top = `${rect.top}px`;
      
      // Animation
      heart.style.animation = 'float-heart 2s forwards';
      
      document.body.appendChild(heart);
      
      // Remove heart after animation
      setTimeout(() => {
        document.body.removeChild(heart);
      }, 2000);
    });
    
    // Add heart animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-heart {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) scale(1.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Fire effect for 🔥
  fireEffect(element) {
    element.addEventListener('click', () => {
      // Create fire particles
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        particle.style.position = 'fixed';
        particle.style.width = `${Math.random() * 8 + 4}px`;
        particle.style.height = `${Math.random() * 8 + 4}px`;
        particle.style.backgroundColor = i % 2 === 0 ? '#ff4500' : '#ffcc00';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        // Position at the emoji
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        // Animation
        const angle = Math.random() * Math.PI;
        const distance = Math.random() * 50 + 30;
        const duration = Math.random() * 1 + 1;
        
        particle.style.animation = `fire-particle ${duration}s forwards`;
        particle.style.setProperty('--angle', angle);
        particle.style.setProperty('--distance', `${distance}px`);
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          document.body.removeChild(particle);
        }, duration * 1000);
      }
    });
    
    // Add fire particle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fire-particle {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(
            calc(cos(var(--angle)) * var(--distance)), 
            calc(sin(var(--angle)) * var(--distance) * -1)
          ) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Water drop effect for 💧
  waterDropEffect(element) {
    element.addEventListener('click', () => {
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'water-ripple';
      ripple.style.position = 'fixed';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.borderRadius = '50%';
      ripple.style.border = '2px solid #00bcd4';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';
      
      // Position at the emoji
      const rect = element.getBoundingClientRect();
      ripple.style.left = `${rect.left + rect.width / 2 - 5}px`;
      ripple.style.top = `${rect.top + rect.height / 2 - 5}px`;
      
      // Animation
      ripple.style.animation = 'water-ripple 1s forwards';
      
      document.body.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        document.body.removeChild(ripple);
      }, 1000);
    });
    
    // Add water ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes water-ripple {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(10);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Rainbow effect for 🌈
  rainbowEffect(element) {
    element.addEventListener('click', () => {
      // Create rainbow arc
      const rainbow = document.createElement('div');
      rainbow.className = 'rainbow-arc';
      rainbow.style.position = 'fixed';
      rainbow.style.width = '200px';
      rainbow.style.height = '100px';
      rainbow.style.borderTopLeftRadius = '100px';
      rainbow.style.borderTopRightRadius = '100px';
      rainbow.style.border = 'none';
      rainbow.style.background = 'linear-gradient(to bottom, red, orange, yellow, green, blue, indigo, violet)';
      rainbow.style.pointerEvents = 'none';
      rainbow.style.zIndex = '9999';
      rainbow.style.opacity = '0';
      
      // Position below the emoji
      const rect = element.getBoundingClientRect();
      rainbow.style.left = `${rect.left + rect.width / 2 - 100}px`;
      rainbow.style.top = `${rect.bottom}px`;
      
      // Animation
      rainbow.style.animation = 'rainbow-appear 2s forwards';
      
      document.body.appendChild(rainbow);
      
      // Remove rainbow after animation
      setTimeout(() => {
        document.body.removeChild(rainbow);
      }, 2000);
    });
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow-appear {
        0% {
          transform: scaleX(0.1) scaleY(0.1);
          opacity: 0;
        }
        50% {
          opacity: 0.8;
        }
        100% {
          transform: scaleX(1) scaleY(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize emoji effects when the page loads
window.addEventListener('DOMContentLoaded', () => {
  window.emojiEffects = new EmojiEffects();
  window.emojiEffects.init();
});