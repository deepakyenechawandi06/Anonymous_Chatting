/**
 * Admin Mute System
 */
(function() {
  // Add admin mute panel
  function createAdminMutePanel() {
    if (document.getElementById('adminMutePanel')) return;
    
    const panel = document.createElement('div');
    panel.id = 'adminMutePanel';
    panel.className = 'admin-mute-panel';
    panel.innerHTML = `
      <div class="admin-mute-header">
        <h3>🔇 Mute Users</h3>
        <button id="closeAdminMute">×</button>
      </div>
      <div class="admin-mute-list" id="adminMuteList">
        <p>Loading users...</p>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    document.getElementById('closeAdminMute').addEventListener('click', toggleAdminMutePanel);
    
    // Load users
    loadUsersForMuting();
  }
  
  // Toggle admin mute panel
  function toggleAdminMutePanel() {
    const panel = document.getElementById('adminMutePanel');
    if (!panel) {
      createAdminMutePanel();
      return;
    }
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display !== 'none') {
      loadUsersForMuting();
    }
  }
  
  // Load users for muting
  function loadUsersForMuting() {
    const userList = document.getElementById('adminMuteList');
    if (!userList) return;
    
    // Get unique users from messages
    const users = new Set();
    document.querySelectorAll('.message').forEach(message => {
      const userId = message.getAttribute('data-user-id');
      if (userId && userId !== window.app?.userId) {
        users.add(userId);
      }
    });
    
    if (users.size === 0) {
      userList.innerHTML = '<p>No users to mute</p>';
      return;
    }
    
    userList.innerHTML = '';
    users.forEach(userId => {
      const userItem = document.createElement('div');
      userItem.className = 'admin-mute-item';
      
      const isMuted = window.muteSystem?.isUserMuted(userId) || false;
      
      userItem.innerHTML = `
        <span class="user-info">User ${userId.slice(0, 8)}</span>
        <button class="admin-mute-btn ${isMuted ? 'unmute' : 'mute'}" data-user-id="${userId}">
          ${isMuted ? '🔊 Unmute' : '🔇 Mute'}
        </button>
      `;
      
      // Add click event
      const btn = userItem.querySelector('.admin-mute-btn');
      btn.addEventListener('click', () => {
        if (isMuted) {
          window.muteSystem?.unmuteUser(userId);
          btn.textContent = '🔇 Mute';
          btn.className = 'admin-mute-btn mute';
        } else {
          window.muteSystem?.muteUser(userId);
          btn.textContent = '🔊 Unmute';
          btn.className = 'admin-mute-btn unmute';
        }
      });
      
      userList.appendChild(userItem);
    });
  }
  
  // Add admin mute button to header
  function addAdminMuteButton() {
    if (document.getElementById('adminMuteBtn')) return;
    
    // Try multiple locations for the button
    let container = document.querySelector('.header-buttons') || 
                   document.querySelector('.chat-header') ||
                   document.querySelector('#messageForm');
    
    if (!container) {
      // Create a floating button if no container found
      const floatingBtn = document.createElement('div');
      floatingBtn.style.cssText = 'position:fixed;top:20px;right:20px;z-index:1000;';
      document.body.appendChild(floatingBtn);
      container = floatingBtn;
    }
    
    const muteBtn = document.createElement('button');
    muteBtn.id = 'adminMuteBtn';
    muteBtn.className = 'button admin-mute-toggle';
    muteBtn.innerHTML = '🔇';
    muteBtn.title = 'Mute Users';
    muteBtn.style.cssText = 'background:#ff4757;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;margin:5px;';
    
    muteBtn.addEventListener('click', toggleAdminMutePanel);
    container.appendChild(muteBtn);
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addAdminMuteButton, 1000);
    setTimeout(addAdminMuteButton, 3000); // Try again in case elements load later
  });
})();