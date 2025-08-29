/**
 * Force Group Name Change
 */
(function() {
  function forceGroupName() {
    // Set group name in app object
    if (window.app) {
      window.app.groupName = 'Incognito Chatting';
    }
    
    // Update all group name elements
    document.querySelectorAll('.group-name, .group-name-display, h1, h2, h3').forEach(el => {
      if (el.textContent.includes('Anonymous')) {
        el.textContent = 'Incognito Chatting';
      }
    });
    
    // Update page title
    document.title = 'Incognito Chatting';
    
    // Update any text content that shows group name
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.includes('Anonymous Chat') || node.textContent.includes('Anonymous Chatting')) {
        node.textContent = node.textContent.replace(/Anonymous Chat/g, 'Incognito Chatting').replace(/Anonymous Chatting/g, 'Incognito Chatting');
      }
    });
  }
  
  // Run immediately and repeatedly
  document.addEventListener('DOMContentLoaded', () => {
    forceGroupName();
    setInterval(forceGroupName, 1000);
  });
  
  // Run on any DOM changes
  const observer = new MutationObserver(forceGroupName);
  observer.observe(document.body, { childList: true, subtree: true });
})();