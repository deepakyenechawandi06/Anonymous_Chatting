/**
 * Emoji Motion - Makes emojis move when sent in messages
 */
(function() {
  // Map of emoji types to their motion animations
  const emojiMotions = {
    // Face emojis
    '😀': 'bounce',
    '😃': 'bounce',
    '😄': 'bounce',
    '😁': 'bounce',
    '😆': 'bounce',
    '😅': 'bounce',
    '😂': 'laugh',
    '🤣': 'laugh',
    '😊': 'pulse',
    '😇': 'float',
    '🙂': 'nod',
    '🙃': 'flip',
    '😉': 'wink',
    '😌': 'sway',
    '😍': 'heartbeat',
    '🥰': 'heartbeat',
    '😘': 'kiss',
    '😗': 'kiss',
    '😙': 'kiss',
    '😚': 'kiss',
    '😋': 'bounce',
    '😛': 'wiggle',
    '😝': 'wiggle',
    '😜': 'wiggle',
    '🤪': 'crazy',
    '🤨': 'raise',
    '🧐': 'inspect',
    '🤓': 'nerd',
    '😎': 'cool',
    '🤩': 'star',
    '🥳': 'party',
    '😏': 'smirk',
    '😒': 'side',
    '😞': 'sad',
    '😔': 'sad',
    '😟': 'worry',
    '😕': 'confused',
    '🙁': 'frown',
    '☹️': 'frown',
    '😣': 'struggle',
    '😖': 'struggle',
    '😫': 'tired',
    '😩': 'tired',
    '🥺': 'plead',
    '😢': 'cry',
    '😭': 'sob',
    '😤': 'steam',
    '😠': 'angry',
    '😡': 'rage',
    '🤬': 'explode',
    '🤯': 'explode',
    '😳': 'blush',
    '🥵': 'hot',
    '🥶': 'cold',
    '😱': 'scream',
    '😨': 'fear',
    '😰': 'sweat',
    '😥': 'sweat',
    '😓': 'sweat',
    '🤗': 'hug',
    '🤔': 'think',
    '🤭': 'giggle',
    '🤫': 'shush',
    '🤥': 'lie',
    '😶': 'blank',
    '😐': 'neutral',
    '😑': 'neutral',
    '😬': 'grimace',
    '🙄': 'eyeroll',
    '😯': 'surprise',
    '😦': 'surprise',
    '😧': 'anguish',
    '😮': 'surprise',
    '😲': 'astonish',
    '🥱': 'yawn',
    '😴': 'sleep',
    '🤤': 'drool',
    '😪': 'sleepy',
    '😵': 'dizzy',
    '🤐': 'zip',
    '🥴': 'woozy',
    '🤢': 'sick',
    '🤮': 'vomit',
    '🤧': 'sneeze',
    '😷': 'mask',
    '🤒': 'sick',
    '🤕': 'hurt',
    '🤑': 'money',
    '🤠': 'cowboy',
    '😈': 'devil',
    '👿': 'devil',
    '👹': 'monster',
    '👺': 'monster',
    '🤡': 'clown',
    '💩': 'poop',
    '👻': 'ghost',
    '💀': 'skull',
    '☠️': 'skull',
    '👽': 'alien',
    '👾': 'alien',
    '🤖': 'robot',
    
    // Hand gestures
    '👋': 'wave',
    '🤚': 'hand',
    '🖐️': 'hand',
    '✋': 'hand',
    '🖖': 'vulcan',
    '👌': 'ok',
    '🤌': 'pinch',
    '🤏': 'pinch',
    '✌️': 'peace',
    '🤞': 'fingers-crossed',
    '🤟': 'love',
    '🤘': 'rock',
    '🤙': 'call',
    '👈': 'point-left',
    '👉': 'point-right',
    '👆': 'point-up',
    '🖕': 'middle',
    '👇': 'point-down',
    '☝️': 'point-up',
    '👍': 'thumbs-up',
    '👎': 'thumbs-down',
    '✊': 'fist',
    '👊': 'punch',
    '🤛': 'fist-left',
    '🤜': 'fist-right',
    '👏': 'clap',
    '🙌': 'raise',
    '👐': 'open',
    '🤲': 'palms',
    '🤝': 'handshake',
    '🙏': 'pray',
    '✍️': 'write',
    
    // Hearts and emotions
    '❤️': 'beat',
    '🧡': 'beat',
    '💛': 'beat',
    '💚': 'beat',
    '💙': 'beat',
    '💜': 'beat',
    '🖤': 'beat',
    '🤍': 'beat',
    '🤎': 'beat',
    '💔': 'break',
    '❣️': 'exclaim',
    '💕': 'double-beat',
    '💞': 'revolve',
    '💓': 'heartbeat',
    '💗': 'growing',
    '💖': 'sparkle',
    '💘': 'arrow',
    '💝': 'gift',
    '💟': 'heart-box',
    '💯': 'hundred',
    '💢': 'anger',
    '💥': 'collision',
    '💫': 'dizzy',
    '💦': 'sweat',
    '💨': 'dash',
    '🕳️': 'hole',
    '💣': 'bomb',
    '💬': 'speech',
    '👁️‍🗨️': 'eye-speech',
    '🗨️': 'left-speech',
    '🗯️': 'anger-bubble',
    '💭': 'thought',
    '💤': 'zzz',
    
    // Other common emojis
    '🔥': 'fire',
    '✨': 'sparkle',
    '🎉': 'party',
    '🎊': 'confetti',
    '🎈': 'balloon',
    '🎂': 'cake',
    '🎁': 'gift',
    '🎵': 'music',
    '🎶': 'music',
    '👑': 'crown',
    '🏆': 'trophy',
    '🥇': 'gold',
    '🥈': 'silver',
    '🥉': 'bronze'
  };
  
  // Process all messages to add motion to emojis
  function addEmojiMotion() {
    // Find all emojis in messages
    document.querySelectorAll('.message-content').forEach(content => {
      // Skip already processed messages
      if (content.getAttribute('data-emoji-motion') === 'true') return;
      
      // Mark as processed
      content.setAttribute('data-emoji-motion', 'true');
      
      // Find all text nodes
      const textNodes = [];
      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      // Process each text node
      textNodes.forEach(textNode => {
        // Skip if parent is already a motion emoji
        if (textNode.parentNode.classList && textNode.parentNode.classList.contains('motion-emoji')) return;
        
        // Find emojis in text
        const emojiRegex = /([\p{Emoji}\u200d]+)/gu;
        const parts = textNode.textContent.split(emojiRegex);
        
        if (parts.length > 1) {
          // Create a document fragment to hold the new nodes
          const fragment = document.createDocumentFragment();
          
          parts.forEach(part => {
            if (part.match(emojiRegex)) {
              // This is an emoji
              const motion = getEmojiMotion(part);
              const span = document.createElement('span');
              span.className = `motion-emoji motion-${motion}`;
              span.textContent = part;
              span.addEventListener('click', () => {
                // Add active class to trigger animation
                span.classList.add('motion-active');
                // Remove after animation completes
                setTimeout(() => {
                  span.classList.remove('motion-active');
                }, 1000);
              });
              fragment.appendChild(span);
            } else if (part) {
              // This is regular text
              fragment.appendChild(document.createTextNode(part));
            }
          });
          
          // Replace the text node with the fragment
          textNode.parentNode.replaceChild(fragment, textNode);
        }
      });
    });
  }
  
  // Get motion type for an emoji
  function getEmojiMotion(emoji) {
    // Check if we have a specific motion for this emoji
    if (emojiMotions[emoji]) {
      return emojiMotions[emoji];
    }
    
    // Default motions based on emoji categories
    if (emoji.match(/[\p{Emoji_Presentation}]/u)) {
      // Get a consistent but random-seeming motion based on the emoji
      const motionTypes = ['bounce', 'pulse', 'shake', 'spin', 'tada', 'wobble', 'jello'];
      let hash = 0;
      for (let i = 0; i < emoji.length; i++) {
        hash = ((hash << 5) - hash) + emoji.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      const index = Math.abs(hash) % motionTypes.length;
      return motionTypes[index];
    }
    
    return 'bounce'; // Default motion
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Process existing messages
    addEmojiMotion();
    
    // Set up observer for new messages
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          setTimeout(addEmojiMotion, 100);
        }
      });
    });
    
    // Start observing chat area
    const chatArea = document.getElementById('chatMessages');
    if (chatArea) {
      observer.observe(chatArea, { childList: true, subtree: true });
    }
  });
})();