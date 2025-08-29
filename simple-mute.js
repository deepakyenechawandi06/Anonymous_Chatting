/**
 * Simple Mute System - Always visible
 */
(function() {
  let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
  
  // Create mute button
  function createMuteButton() {
    if (document.getElementById('simpleMuteBtn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'simpleMuteBtn';
    btn.innerHTML = '🔇 Mute';
    btn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ff4757;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 9999;
      font-size: 14px;
    `;
    
    btn.addEventListener('click', showMutePanel);
    document.body.appendChild(btn);
  }
  
  // Show mute panel
  function showMutePanel() {
    let panel = document.getElementById('simpleMutePanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'simpleMutePanel';
      panel.style.cssText = `
        position: fixed;
        top: 60px;
        right: 10px;
        width: 250px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        max-height: 300px;
        overflow-y: auto;
      `;
      
      panel.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">
          Mute Users
          <button onclick="this.parentElement.parentElement.style.display='none'" style="float: right; background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
        </div>
        <div id="muteUserList" style="padding: 10px;"></div>
      `;
      
      document.body.appendChild(panel);
    }
    
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display !== 'none') {
      loadUsers();
    }
  }
  
  // Load users
  function loadUsers() {
    const userList = document.getElementById('muteUserList');
    if (!userList) return;
    
    const users = new Set();
    document.querySelectorAll('.message').forEach(msg => {
      const sender = msg.querySelector('strong');
      if (sender) {
        const userId = sender.textContent.replace('User ', '').trim();
        if (userId) users.add(userId);
      }
    });
    
    if (users.size === 0) {
      userList.innerHTML = '<p style="margin: 0; color: #666;">No users found</p>';
      return;
    }
    
    userList.innerHTML = '';
    users.forEach(userId => {
      const isMuted = mutedUsers.includes(userId);
      const item = document.createElement('div');
      item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #f5f5f5;';
      
      item.innerHTML = `
        <span style="font-size: 12px;">User ${userId.slice(0, 8)}</span>
        <button onclick="toggleMute('${userId}')" style="
          background: ${isMuted ? '#2ed573' : '#ff4757'};
          color: white;
          border: none;
          padding: 3px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">${isMuted ? 'Unmute' : 'Mute'}</button>
      `;
      
      userList.appendChild(item);
    });
  }
  
  // Toggle mute
  window.toggleMute = function(userId) {
    if (mutedUsers.includes(userId)) {
      mutedUsers = mutedUsers.filter(id => id !== userId);
      showMessages(userId);
    } else {
      mutedUsers.push(userId);
      hideMessages(userId);
    }
    localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
    loadUsers();
  };
  
  // Hide messages
  function hideMessages(userId) {
    document.querySelectorAll('.message').forEach(msg => {
      const sender = msg.querySelector('strong');
      if (sender && sender.textContent.includes(userId)) {
        msg.style.display = 'none';
      }
    });
  }
  
  // Show messages
  function showMessages(userId) {
    document.querySelectorAll('.message').forEach(msg => {
      const sender = msg.querySelector('strong');
      if (sender && sender.textContent.includes(userId)) {
        msg.style.display = '';
      }
    });
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createMuteButton, 1000);
    
    // Hide messages from already muted users
    mutedUsers.forEach(hideMessages);
  });
})();