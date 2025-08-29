/**
 * Enhanced Group Features
 * - Animated profile photos
 * - Group name visibility for all members
 * - Chat background theme options
 */
class GroupFeatures {
  constructor() {
    this.init();
  }

  init() {
    // Initialize after app is ready
    this.setupProfilePhoto();
    this.setupChatBackground();
    this.setFixedGroupName();
  }

  setupProfilePhoto() {
    // Add animation to profile photo
    const profilePhoto = document.getElementById('groupAvatar');
    if (profilePhoto) {
      profilePhoto.classList.add('animated-profile');
    }
    
    // Add click handler for profile photo
    document.addEventListener('click', (e) => {
      const avatar = e.target.closest('#groupAvatar');
      if (avatar && app.isAdmin) {
        this.openProfilePhotoEditor();
      }
    });
  }
  
  openProfilePhotoEditor() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('profilePhotoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'profilePhotoModal';
      modal.className = 'profile-photo-modal';
      
      const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33A8FF',
        '#A833FF', '#FF8C33', '#33FFC5', '#FF33C5', '#C533FF'
      ];
      
      let colorOptions = '';
      colors.forEach(color => {
        const initials = 'AC';
        colorOptions += `
          <div class="profile-photo-option" style="background-color: ${color};" data-color="${color}">
            ${initials}
          </div>
        `;
      });
      
      modal.innerHTML = `
        <div class="profile-photo-modal-content">
          <div class="profile-photo-modal-title">Choose Profile Photo</div>
          <div class="profile-photo-options">
            ${colorOptions}
          </div>
          <div class="profile-photo-modal-buttons">
            <button class="profile-photo-modal-button profile-photo-modal-cancel">Cancel</button>
            <button class="profile-photo-modal-button profile-photo-modal-save">Save</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add event listeners
      const cancelBtn = modal.querySelector('.profile-photo-modal-cancel');
      const saveBtn = modal.querySelector('.profile-photo-modal-save');
      const options = modal.querySelectorAll('.profile-photo-option');
      
      cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      
      saveBtn.addEventListener('click', () => {
        const selectedOption = modal.querySelector('.profile-photo-option.selected');
        if (selectedOption) {
          const color = selectedOption.getAttribute('data-color');
          this.updateProfilePhoto(color);
        }
        modal.style.display = 'none';
      });
      
      options.forEach(option => {
        option.addEventListener('click', () => {
          options.forEach(o => o.classList.remove('selected'));
          option.classList.add('selected');
        });
      });
    }
    
    // Update initials in options
    const options = modal.querySelectorAll('.profile-photo-option');
    
    options.forEach(option => {
      option.textContent = 'AC';
      option.classList.remove('selected');
      
      // Select current color
      if (option.getAttribute('data-color') === app.groupAvatarColor) {
        option.classList.add('selected');
      }
    });
    
    modal.style.display = 'flex';
  }
  
  updateProfilePhoto(color) {
    if (!app.isAdmin) return;
    
    app.groupAvatarColor = color;
    
    // Update UI
    const avatar = document.getElementById('groupAvatar');
    if (avatar) {
      avatar.style.backgroundColor = color;
    }
    
    // Send to server
    if (app.ws && app.ws.readyState === WebSocket.OPEN) {
      app.ws.send(JSON.stringify({
        type: 'groupAvatar',
        groupId: app.groupId,
        color: color,
        avatar: app.groupAvatar
      }));
    }
  }
  
  setupChatBackground() {
    // Add background selector to theme dropdown
    const checkInterval = setInterval(() => {
      const themeDropdown = document.querySelector('.dropdown-content');
      if (themeDropdown) {
        clearInterval(checkInterval);
        
        // Add separator
        const separator = document.createElement('div');
        separator.style.borderTop = '1px solid #e5e7eb';
        separator.style.margin = '5px 0';
        themeDropdown.appendChild(separator);
        
        // Add background header
        const header = document.createElement('div');
        header.textContent = 'Chat Background';
        header.style.padding = '5px 16px';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '14px';
        header.style.color = '#666';
        themeDropdown.appendChild(header);
        
        // Add background options
        const backgrounds = [
          { name: 'default', label: 'Default' },
          { name: 'gradient-blue', label: 'Blue Gradient' },
          { name: 'gradient-green', label: 'Green Gradient' },
          { name: 'pattern-dots', label: 'Dots Pattern' },
          { name: 'pattern-lines', label: 'Lines Pattern' }
        ];
        
        const backgroundContainer = document.createElement('div');
        backgroundContainer.className = 'background-selector';
        backgroundContainer.style.padding = '0 16px 10px';
        
        backgrounds.forEach(bg => {
          const option = document.createElement('div');
          option.className = `background-option chat-bg-${bg.name}`;
          option.title = bg.label;
          
          option.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setChatBackground(bg.name);
            
            // Close dropdown
            document.querySelector('.dropdown-content').style.display = 'none';
          });
          
          backgroundContainer.appendChild(option);
        });
        
        themeDropdown.appendChild(backgroundContainer);
      }
    }, 100);
  }
  
  setChatBackground(name) {
    const chatArea = document.getElementById('chatMessages');
    if (!chatArea) return;
    
    // Remove all background classes
    chatArea.className = 'chat-area';
    chatArea.classList.add(`chat-bg-${name}`);
    
    // Save preference
    localStorage.setItem('chatBackground', name);
    
    // Send to server if admin
    if (app.isAdmin && app.ws && app.ws.readyState === WebSocket.OPEN) {
      app.ws.send(JSON.stringify({
        type: 'chatBackground',
        groupId: app.groupId,
        background: name
      }));
    }
  }
  
  setFixedGroupName() {
    // Set fixed group name to Anonymous Chat
    setTimeout(() => {
      // Always set the group name to Incognito Chatting
      app.groupName = 'Incognito Chatting';
      
      // Update UI elements with fixed name
      const groupNameElement = document.querySelector('.group-name');
      if (groupNameElement) {
        groupNameElement.textContent = app.groupName;
      }
      
      // Update the group name in the title
      document.title = `${app.groupName} - Chat`;
      
      // Update any other UI elements that display the group name
      const groupNameElements = document.querySelectorAll('.group-name-display');
      groupNameElements.forEach(el => {
        el.textContent = app.groupName;
      });
      
      // Store the name in local storage
      localStorage.setItem(`groupName_${app.groupId}`, app.groupName);
      
      // Remove the group name change functionality
      if (app.changeGroupName) {
        app.changeGroupName = function() {
          this.showToast('Group name cannot be changed');
        };
      }
      
      // Hide any group name change UI elements
      const groupNameChangeElements = document.querySelectorAll('.change-group-name');
      groupNameChangeElements.forEach(el => {
        el.style.display = 'none';
      });
    }, 500);
    
    // Add handler for group avatar color updates
    const originalOnMessage = app.ws.onmessage;
    app.ws.onmessage = function(event) {
      // Call original handler first
      originalOnMessage.call(this, event);
      
      try {
        const data = JSON.parse(event.data);
        
        // Handle chat background change
        if (data.type === 'chatBackground') {
          const chatArea = document.getElementById('chatMessages');
          if (chatArea) {
            // Remove all background classes
            chatArea.className = 'chat-area';
            chatArea.classList.add(`chat-bg-${data.background}`);
            
            // Save preference
            localStorage.setItem('chatBackground', data.background);
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }
    };
  }
}

// Initialize group features when the page loads
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.groupFeatures = new GroupFeatures();
    
    // Apply saved background if any
    const savedBackground = localStorage.getItem('chatBackground');
    if (savedBackground) {
      const chatArea = document.getElementById('chatMessages');
      if (chatArea) {
        chatArea.classList.add(`chat-bg-${savedBackground}`);
      }
    }
    
    // Force Incognito Chatting name
    app.groupName = 'Incognito Chatting';
    
    // Update UI
    const groupNameElement = document.querySelector('.group-name');
    if (groupNameElement) {
      groupNameElement.textContent = app.groupName;
    }
    
    document.title = `${app.groupName} - Chat`;
  }, 1000); // Wait for app to initialize
});