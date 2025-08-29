/**
 * Script to stop any blinking animations and remove sky blue boxes
 */
(function() {
  // Run immediately and then periodically
  stopBlinking();
  setInterval(stopBlinking, 300);
  
  function stopBlinking() {
    // Find all elements in the document
    document.querySelectorAll('*').forEach(function(element) {
      // Stop all animations
      element.style.animationPlayState = 'paused';
      
      // Check for sky blue color
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      
      // If element has sky blue background, change it
      if (bgColor === 'rgb(135, 206, 235)' || 
          bgColor === 'skyblue' || 
          bgColor.includes('rgba(135, 206, 235') ||
          bgColor.includes('rgba(0, 191, 255')) {
        
        element.style.backgroundColor = 'transparent';
        element.style.animation = 'none';
        element.style.transition = 'none';
      }
      
      // Remove any blinking animations
      if (style.animation && style.animation !== 'none') {
        if (style.animation.includes('blink') || 
            style.animation.includes('flash') || 
            style.animation.includes('pulse')) {
          element.style.animation = 'none';
        }
      }
      
      // Remove any border that might be blinking
      if (style.border && (style.borderColor === 'rgb(135, 206, 235)' || 
                          style.borderColor === 'skyblue')) {
        element.style.border = 'none';
      }
    });
    
    // Also try to remove any CSS animations from stylesheets
    try {
      for (let i = 0; i < document.styleSheets.length; i++) {
        const styleSheet = document.styleSheets[i];
        try {
          for (let j = 0; j < styleSheet.cssRules.length; j++) {
            const rule = styleSheet.cssRules[j];
            if (rule.type === CSSRule.KEYFRAMES_RULE && 
                (rule.name.includes('blink') || 
                 rule.name.includes('flash') || 
                 rule.name.includes('pulse'))) {
              styleSheet.deleteRule(j);
              j--;
            }
          }
        } catch (e) {
          // Security error, probably a cross-origin stylesheet
          console.log('Could not access rules in stylesheet', e);
        }
      }
    } catch (e) {
      console.log('Error removing animations from stylesheets', e);
    }
  }
})();