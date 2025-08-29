// Add screenshot sharing functionality
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Add screenshot button to chat controls
    const addScreenshotButton = () => {
      const chatControls = document.querySelector('.chat-controls');
      if (!chatControls) return;
      
      // Create screenshot button
      const screenshotBtn = document.createElement('button');
      screenshotBtn.id = 'screenshotBtn';
      screenshotBtn.className = 'control-button';
      screenshotBtn.innerHTML = '📷';
      screenshotBtn.title = 'Share Screenshot';
      screenshotBtn.style.fontSize = '18px';
      
      // Add click handler
      screenshotBtn.addEventListener('click', () => {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Trigger file selection
        fileInput.click();
        
        // Handle file selection
        fileInput.addEventListener('change', () => {
          if (fileInput.files && fileInput.files[0]) {
            // Upload the selected image
            app.uploadImage(fileInput.files[0]);
            
            // Remove the file input
            document.body.removeChild(fileInput);
          }
        });
      });
      
      // Add to chat controls
      chatControls.appendChild(screenshotBtn);
    };
    
    addScreenshotButton();
    console.log('Screenshot sharing button added');
  }, 1000);
});