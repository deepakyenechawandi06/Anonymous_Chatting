// Add functionality to share group ID in chat
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!app || !app.groupId) return;
    
    // Add a command to share group ID in chat
    app.shareGroupId = function() {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      
      // Send system message with group ID to all users
      this.ws.send(JSON.stringify({
        type: 'system',
        text: `Group ID: ${this.groupId}`,
        groupId: this.groupId,
        senderId: this.userId,
        timestamp: Date.now(),
        isGroupIdMessage: true
      }));
    };
    
    // Add click handler for group ID messages
    document.addEventListener('click', (e) => {
      const messageEl = e.target.closest('.message[data-type="system"]');
      if (messageEl && messageEl.textContent.includes('Group ID:')) {
        const groupIdText = messageEl.textContent;
        const groupId = groupIdText.split('Group ID:')[1].trim();
        navigator.clipboard.writeText(groupId)
          .then(() => {
            app.showToast('Group ID copied to clipboard');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      }
    });
    
    // Share group ID when joining
    setTimeout(() => {
      app.shareGroupId();
    }, 2000);
    
    console.log('Group ID sharing initialized');
  }, 1500);
});