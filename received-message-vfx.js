// Deep VFX for received messages
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Override the original message handler
    if (app && app.ws && app.ws.onmessage) {
      const originalOnMessage = app.ws.onmessage;
      
      app.ws.onmessage = function(event) {
        // Call the original handler first
        originalOnMessage.call(this, event);
        
        // Check if this was a message
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.userId !== app.userId) {
            // Wait for the message to be rendered
            setTimeout(() => {
              // Find the new message
              const messages = document.querySelectorAll('.message.received:not(.vfx)');
              messages.forEach(message => {
                // Add VFX class
                message.classList.add('vfx');
                
                // Create particles
                createParticles(message);
                
                // Apply 3D text effect to message content
                const textElement = message.querySelector('p');
                if (textElement) {
                  applyTextEffect(textElement);
                }
              });
            }, 100);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      };
    }
    
    // Function to create particle effects
    function createParticles(element) {
      const numParticles = 10;
      
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        element.appendChild(particle);
        
        // Random position around the message
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Set initial position
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        // Animate the particle
        const duration = 1 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        
        particle.style.animation = `
          fadeInOut ${duration}s ease-in-out ${delay}s forwards
        `;
      }
    }
    
    // Function to apply 3D text effect
    function applyTextEffect(textElement) {
      const text = textElement.textContent;
      
      // Split text into characters and wrap each in a span
      const characters = text.split('').map((char, index) => {
        const delay = index * 0.03;
        return `<span class="char-vfx" style="animation-delay: ${delay}s">${char === ' ' ? '&nbsp;' : char}</span>`;
      }).join('');
      
      // Replace the text with animated spans
      textElement.innerHTML = characters;
    }
    
    // Add keyframes for particle animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { transform: translate(0, 0) scale(0); opacity: 0; }
        20% { opacity: 0.8; }
        100% { transform: translate(
          ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 50}px, 
          ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 50}px
        ) scale(0); opacity: 0; }
      }
      
      .char-vfx {
        display: inline-block;
        animation: charVfx 0.5s forwards;
        opacity: 0;
        transform-origin: bottom center;
      }
      
      @keyframes charVfx {
        0% { opacity: 0; transform: translateY(10px) rotateX(-30deg); }
        100% { opacity: 1; transform: translateY(0) rotateX(0); }
      }
    `;
    document.head.appendChild(style);
    
    // Apply VFX to existing received messages
    setTimeout(() => {
      document.querySelectorAll('.message.received:not(.vfx)').forEach(message => {
        message.classList.add('vfx');
        createParticles(message);
        
        const textElement = message.querySelector('p');
        if (textElement) {
          applyTextEffect(textElement);
        }
      });
    }, 500);
  }, 1000);
});