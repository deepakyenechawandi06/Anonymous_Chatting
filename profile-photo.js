/**
 * Profile Photo functionality
 */
class ProfilePhoto {
  constructor() {
    this.colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33A8FF',
      '#A833FF', '#FF8C33', '#33FFC5', '#FF33C5', '#C533FF',
      '#FF5733', '#33FF57', '#3357FF'
    ];
    this.init();
  }

  init() {
    // Create profile photo modal
    this.createModal();
    
    // Add event listeners
    document.addEventListener('click', (e) => {
      if (e.target.closest('.profile-photo') && e.target.closest('.profile-photo').id === 'groupAvatar') {
        if (app.isAdmin) {
          this.openModal();
        }
      }
      
      if (e.target.closest('.profile-photo-edit')) {
        e.stopPropagation();
        this.openModal();
      }
    });
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'profile-photo-modal';
    modal.id = 'profilePhotoModal';
    
    let colorOptions = '';
    this.colors.forEach((color, index) => {
      const initials = app.groupName ? app.groupName.substring(0, 2).toUpperCase() : 'GC';
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
    
    cancelBtn.addEventListener('click', () => this.closeModal());
    
    saveBtn.addEventListener('click', () => {
      const selectedOption = modal.querySelector('.profile-photo-option.selected');
      if (selectedOption) {
        const color = selectedOption.getAttribute('data-color');
        this.updateProfilePhoto(color);
      }
      this.closeModal();
    });
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
  }

  openModal() {
    const modal = document.getElementById('profilePhotoModal');
    if (modal) {
      // Update initials in options
      const options = modal.querySelectorAll('.profile-photo-option');
      const initials = app.groupName ? app.groupName.substring(0, 2).toUpperCase() : 'GC';
      
      options.forEach(option => {
        option.textContent = initials;
        option.classList.remove('selected');
        
        // Select current color
        if (option.getAttribute('data-color') === app.groupAvatarColor) {
          option.classList.add('selected');
        }
      });
      
      modal.style.display = 'flex';
    }
  }

  closeModal() {
    const modal = document.getElementById('profilePhotoModal');
    if (modal) {
      modal.style.display = 'none';
    }
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
}

// Initialize profile photo when the page loads
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.profilePhoto = new ProfilePhoto();
  }, 1000); // Wait for app to initialize
});