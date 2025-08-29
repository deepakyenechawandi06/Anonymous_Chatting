// Reply screen functionality
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Add context menu for messages
    const addContextMenu = () => {
      document.querySelectorAll('.message').forEach(message => {
        // Add context menu event (right click or long press)
        message.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          showReplyScreen(message);
        });
        
        // Add long press event for mobile
        let pressTimer;
        message.addEventListener('touchstart', () => {
          pressTimer = setTimeout(() => {
            showReplyScreen(message);
          }, 600);
        });
        
        message.addEventListener('touchend', () => {
          clearTimeout(pressTimer);
        });
      });
    };
    
    // Function to show reply screen
    const showReplyScreen = (messageEl) => {
      const messageId = messageEl.getAttribute('data-message-id');
      const message = app.messages.find(m => m.id === messageId);
      
      if (!message) return;
      
      // Create reply screen if it doesn't exist
      if (!document.getElementById('replyScreen')) {
        const replyScreen = document.createElement('div');
        replyScreen.id = 'replyScreen';
        replyScreen.className = 'reply-screen';
        
        replyScreen.innerHTML = `
          <div class="reply-screen-header">
            <button id="closeReplyScreen">✕</button>
            <h3>Reply</h3>
          </div>
          <div class="reply-screen-content">
            <div class="reply-original-message"></div>
            <div class="reply-input-container">
              <input type="text" id="replyInput" placeholder="Type your reply...">
              <button id="sendReplyBtn">Send</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(replyScreen);
        
        // Add event listeners
        document.getElementById('closeReplyScreen').addEventListener('click', () => {
          hideReplyScreen();
        });
        
        document.getElementById('sendReplyBtn').addEventListener('click', () => {
          sendReply();
        });
        
        document.getElementById('replyInput').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendReply();
          }
        });
      }
      
      // Update reply screen content
      const originalMessage = document.querySelector('.reply-original-message');
      const sender = message.nickname || `User ${message.userId.substring(0, 6)}`;
      
      if (message.type === 'image') {
        originalMessage.innerHTML = `
          <div class="reply-author">${sender}</div>
          <div class="reply-content">
            <img src="${message.imageUrl}" class="reply-image">
          </div>
        `;
      } else {
        originalMessage.innerHTML = `
          <div class="reply-author">${sender}</div>
          <div class="reply-content">${message.content}</div>
        `;
      }
      
      // Store the message ID for reply
      document.getElementById('replyScreen').setAttribute('data-message-id', messageId);
      
      // Show the reply screen
      document.getElementById('replyScreen').classList.add('active');
      document.getElementById('replyInput').focus();
    };
    
    // Function to hide reply screen
    const hideReplyScreen = () => {
      const replyScreen = document.getElementById('replyScreen');
      if (replyScreen) {
        replyScreen.classList.remove('active');
        document.getElementById('replyInput').value = '';
      }
    };
    
    // Function to send reply
    const sendReply = () => {
      const replyScreen = document.getElementById('replyScreen');
      const messageId = replyScreen.getAttribute('data-message-id');
      const replyText = document.getElementById('replyInput').value.trim();
      
      if (replyText && messageId) {
        // Set the reply in the app
        app.setReplyTo(messageId);
        
        // Send the message
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
          messageInput.value = replyText;
          app.sendMessage();
        }
        
        // Hide the reply screen
        hideReplyScreen();
      }
    };
    
    // Monitor for page changes to add context menu
    const checkForChatPage = setInterval(() => {
      if (app && app.currentPage === 'chat') {
        addContextMenu();
        clearInterval(checkForChatPage);
        
        // Set up a mutation observer to detect when new messages are added
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList' && 
                document.querySelector('.message-container')) {
              addContextMenu();
            }
          }
        });
        
        observer.observe(document.querySelector('.chat-area'), { 
          childList: true, 
          subtree: true 
        });
      }
    }, 500);
  }, 1000);
});