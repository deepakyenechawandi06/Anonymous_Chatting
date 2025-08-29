// Group name synchronization
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    if (!app) return;
    
    // Set fixed group name
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
    
    // Override the group name change function to prevent changes
    if (app.changeGroupName) {
      app.changeGroupName = function() {
        this.showToast('Group name cannot be changed');
        return false;
      };
    }
    
    console.log('Group name fixed to "Anonymous Chat"');
  }, 1000);
});