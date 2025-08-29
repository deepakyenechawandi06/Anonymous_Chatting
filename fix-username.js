// Fix for username visibility in chat messages
document.addEventListener('DOMContentLoaded', function() {
  // Apply fix immediately
  fixUsernames();
  
  // Set interval to keep checking for new messages
  setInterval(fixUsernames, 500);
  
  function fixUsernames() {
    // Fix all usernames in messages
    document.querySelectorAll('.message strong').forEach(function(strong) {
      strong.style.color = '#000000';
      strong.style.visibility = 'visible';
      strong.style.opacity = '1';
      strong.style.display = 'block';
      strong.style.fontWeight = 'bold';
      strong.style.fontSize = '0.9em';
      strong.style.marginBottom = '5px';
    });
    
    // Fix usernames in sent messages
    document.querySelectorAll('.message.sent strong').forEach(function(strong) {
      strong.style.color = '#ffffff';
    });
    
    // Fix usernames in received messages
    document.querySelectorAll('.message.received strong').forEach(function(strong) {
      strong.style.color = '#000000';
    });
    
    // Fix usernames in dark theme
    if (document.body.classList.contains('theme-dark')) {
      document.querySelectorAll('.message.received strong').forEach(function(strong) {
        strong.style.color = '#ffffff';
      });
    }
  }
});