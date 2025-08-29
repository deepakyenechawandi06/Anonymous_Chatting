// Chat background customization
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Add background selector to the dropdown menu when in chat mode
    const addBackgroundSelector = () => {
      if (app && app.currentPage === 'chat') {
        // Check if the background selector already exists
        if (document.getElementById('backgroundBtn')) return;
        
        // Add background button to header
        const headerButtons = document.querySelector('.header-buttons');
        if (headerButtons) {
          const backgroundDropdown = document.createElement('div');
          backgroundDropdown.className = 'dropdown';
          backgroundDropdown.innerHTML = `
            <button class="button" id="backgroundBtn" style="margin: 0; width: auto; background-color: #6366f1;">🖼️</button>
            <div class="dropdown-content" id="backgroundOptions">
              <a href="#" data-bg="default">Default</a>
              <a href="#" data-bg="light-pattern">Light Pattern</a>
              <a href="#" data-bg="dark-pattern">Dark Pattern</a>
              <a href="#" data-bg="gradient">Gradient</a>
              <a href="#" data-bg="solid-light">Solid Light</a>
              <a href="#" data-bg="solid-dark">Solid Dark</a>
              <a href="#" data-bg="custom">Custom Color...</a>
              <a href="#" data-bg="image">Custom Image...</a>
            </div>
          `;
          headerButtons.prepend(backgroundDropdown);
          
          // Add event listeners to background options
          const options = document.querySelectorAll('#backgroundOptions a');
          options.forEach(option => {
            option.addEventListener('click', (e) => {
              e.preventDefault();
              const bgType = e.target.getAttribute('data-bg');
              
              if (bgType === 'custom') {
                const color = prompt('Enter a color (hex, rgb, or name):', '#f5f5f5');
                if (color) {
                  changeBackground('custom', color);
                }
              } else if (bgType === 'image') {
                selectBackgroundImage();
              } else {
                changeBackground(bgType);
              }
              
              // Hide dropdown after selection
              document.querySelector('#backgroundOptions').style.display = 'none';
            });
          });
        }
      }
    };
    
    // Function to select a background image
    const selectBackgroundImage = () => {
      // Create a file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      
      // Trigger click on the file input
      fileInput.click();
      
      // Handle file selection
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          
          // Ask if user wants dark overlay for better readability
          const useDarkOverlay = confirm('Would you like to add a dark overlay for better text readability?');
          
          // Upload the image to the server first
          uploadBackgroundImage(file, useDarkOverlay);
          
          document.body.removeChild(fileInput);
        }
      });
      
      // Handle cancel
      fileInput.addEventListener('cancel', () => {
        document.body.removeChild(fileInput);
      });
      
      // Clean up if file dialog is closed without selection
      setTimeout(() => {
        if (document.body.contains(fileInput)) {
          document.body.removeChild(fileInput);
        }
      }, 60000); // Remove after 1 minute if not removed already
    };
    
    // Function to upload background image to server
    const uploadBackgroundImage = (file, useDarkOverlay) => {
      // Show loading toast
      app.showToast('Uploading background image...');
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Use the existing image upload endpoint
      fetch('/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      })
      .then(data => {
        // We now have the image URL from the server
        const imageUrl = data.url;
        
        // Apply the background locally
        changeBackground('image', imageUrl, useDarkOverlay);
        app.showToast('Background image applied');
      })
      .catch(error => {
        console.error('Error uploading background image:', error);
        app.showToast('Failed to upload background image');
      });
    };
    
    // Function to change chat background
    window.changeBackground = (type, customValue = null, useDarkOverlay = false) => {
      const chatArea = document.querySelector('.chat-area');
      if (!chatArea) return;
      
      console.log(`Applying background: ${type}, value: ${customValue}, overlay: ${useDarkOverlay}`);
      
      // Remove all existing background classes
      chatArea.classList.remove(
        'bg-default', 
        'bg-light-pattern', 
        'bg-dark-pattern', 
        'bg-gradient', 
        'bg-solid-light', 
        'bg-solid-dark',
        'bg-image',
        'dark-overlay'
      );
      
      // Reset custom styles
      chatArea.style.backgroundColor = '';
      chatArea.style.backgroundImage = '';
      
      // Apply selected background
      if (type === 'custom' && customValue) {
        chatArea.style.backgroundColor = customValue;
        // Save preference
        localStorage.setItem('chatBackground', 'custom');
        localStorage.setItem('chatBackgroundColor', customValue);
      } else if (type === 'image' && customValue) {
        chatArea.classList.add('bg-image');
        
        // For server-hosted images, make sure we have the full URL
        let imageUrl = customValue;
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = '/' + imageUrl;
        }
        
        chatArea.style.backgroundImage = `url(${imageUrl})`;
        
        // Apply overlay if requested
        if (useDarkOverlay) {
          chatArea.classList.add('dark-overlay');
          localStorage.setItem('chatBackgroundOverlay', 'dark');
        } else {
          localStorage.setItem('chatBackgroundOverlay', 'light');
        }
        
        // Save preference
        localStorage.setItem('chatBackground', 'image');
        localStorage.setItem('chatBackgroundImage', imageUrl);
        
        // Force a reflow to ensure the background is applied
        void chatArea.offsetWidth;
      } else {
        chatArea.classList.add(`bg-${type}`);
        // Save preference
        localStorage.setItem('chatBackground', type);
        localStorage.removeItem('chatBackgroundColor');
        localStorage.removeItem('chatBackgroundImage');
      }
      
      console.log(`Background changed to ${type}`);
    };
    
    // Check for saved background preference
    const applySavedBackground = () => {
      const savedBg = localStorage.getItem('chatBackground');
      if (savedBg) {
        if (savedBg === 'custom') {
          const color = localStorage.getItem('chatBackgroundColor');
          if (color) {
            changeBackground('custom', color);
          }
        } else if (savedBg === 'image') {
          const imageUrl = localStorage.getItem('chatBackgroundImage');
          if (imageUrl) {
            const overlay = localStorage.getItem('chatBackgroundOverlay') === 'dark';
            changeBackground('image', imageUrl, overlay);
          }
        } else {
          changeBackground(savedBg);
        }
      }
    };
    
    // Monitor for page changes to add the background selector
    const checkForChatPage = setInterval(() => {
      if (app && app.currentPage === 'chat') {
        addBackgroundSelector();
        applySavedBackground();
        clearInterval(checkForChatPage);
        
        // Set up a mutation observer to detect when the chat area is re-rendered
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList' && 
                document.querySelector('.chat-area') && 
                !document.getElementById('backgroundBtn')) {
              addBackgroundSelector();
              applySavedBackground();
            }
          }
        });
        
        observer.observe(document.getElementById('app'), { 
          childList: true, 
          subtree: true 
        });
      }
    }, 500);
  }, 1000);
});