// Direct fix for message text visibility
document.addEventListener('DOMContentLoaded', function() {
  // Apply fix immediately
  fixMessageText();
  
  // Set up observer to fix new messages
  const chatArea = document.getElementById('chatMessages');
  if (chatArea) {
    const observer = new MutationObserver(function(mutations) {
      fixMessageText();
    });
    
    observer.observe(chatArea, {
      childList: true,
      subtree: true
    });
  }
  
  // Function to fix message text
  function fixMessageText() {
    // Fix all message paragraphs
    document.querySelectorAll('.message p').forEach(function(p) {
      p.style.color = '#000000';
      p.style.backgroundColor = 'transparent';
      p.style.visibility = 'visible';
      p.style.opacity = '1';
      p.style.display = 'block';
      p.style.textShadow = '0 0 0 #000';
    });
    
    // Fix received messages specifically
    document.querySelectorAll('.message.received p').forEach(function(p) {
      p.style.color = '#000000';
      p.style.fontWeight = 'normal';
    });
    
    // Fix sent messages specifically
    document.querySelectorAll('.message.sent p').forEach(function(p) {
      p.style.color = '#ffffff';
      p.style.fontWeight = 'normal';
    });
  }
});