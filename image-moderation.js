// Image moderation using NSFW.js
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    let nsfwModel = null;
    let isModelLoading = false;
    
    // Threshold for NSFW detection (0.0 to 1.0)
    const threshold = 0.7;
    
    // Update the status indicator
    const updateStatus = (text) => {
      const statusIndicator = document.getElementById('moderationStatus');
      if (statusIndicator) {
        statusIndicator.textContent = text;
      }
    };
    
    // Load the NSFW model
    const loadNSFWModel = async () => {
      if (nsfwModel || isModelLoading) return;
      
      try {
        isModelLoading = true;
        updateStatus('Loading image moderation...');
        
        // Load the model
        nsfwModel = await nsfwjs.load();
        
        console.log('NSFW model loaded successfully');
        updateStatus('Image moderation active');
        
        // Override the image upload method
        overrideImageUpload();
      } catch (error) {
        console.error('Failed to load NSFW model:', error);
        updateStatus('Image moderation unavailable');
      } finally {
        isModelLoading = false;
      }
    };
    
    // Check if an image contains inappropriate content
    const checkImage = async (imageElement) => {
      if (!nsfwModel || !imageElement) {
        return { isInappropriate: false, predictions: [] };
      }
      
      try {
        // Classify the image
        const predictions = await nsfwModel.classify(imageElement);
        
        // Check for inappropriate content
        let isInappropriate = false;
        let highestScore = 0;
        let worstCategory = '';
        
        predictions.forEach(prediction => {
          // Check categories that are considered inappropriate
          if (['Porn', 'Hentai', 'Sexy'].includes(prediction.className)) {
            if (prediction.probability > threshold) {
              isInappropriate = true;
              
              // Track the worst category for reporting
              if (prediction.probability > highestScore) {
                highestScore = prediction.probability;
                worstCategory = prediction.className;
              }
            }
          }
        });
        
        return { 
          isInappropriate, 
          predictions,
          worstCategory,
          highestScore
        };
      } catch (error) {
        console.error('Error checking image:', error);
        return { isInappropriate: false, predictions: [] };
      }
    };
    
    // Apply blur effect to inappropriate images
    const blurImage = (imageElement, severity) => {
      // Add blur class to the image
      imageElement.classList.add('nsfw-blur');
      
      // Set blur amount based on severity
      const blurAmount = Math.min(20, Math.max(10, severity * 20));
      imageElement.style.filter = `blur(${blurAmount}px)`;
      
      // Add warning overlay
      const parent = imageElement.parentElement;
      
      // Create warning element if it doesn't exist
      if (!parent.querySelector('.nsfw-warning')) {
        const warning = document.createElement('div');
        warning.className = 'nsfw-warning';
        warning.innerHTML = '<span>⚠️ Potentially inappropriate content</span>';
        
        // Add reveal button
        const revealBtn = document.createElement('button');
        revealBtn.className = 'nsfw-reveal-btn';
        revealBtn.textContent = 'Reveal Image';
        revealBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          imageElement.classList.remove('nsfw-blur');
          imageElement.style.filter = '';
          warning.style.display = 'none';
        });
        
        warning.appendChild(revealBtn);
        parent.appendChild(warning);
      }
    };
    
    // Override the image upload method
    const overrideImageUpload = () => {
      if (app && app.uploadImage) {
        const originalUploadImage = app.uploadImage;
        
        app.uploadImage = async function(file) {
          // First check if the file is an image
          if (!file || !file.type.startsWith('image/')) {
            return originalUploadImage.call(this, file);
          }
          
          try {
            updateStatus('Checking image...');
            
            // Create an image element to check
            const img = document.createElement('img');
            const imgUrl = URL.createObjectURL(file);
            
            // Wait for the image to load
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imgUrl;
            });
            
            // Check the image
            const result = await checkImage(img);
            
            // Clean up the object URL
            URL.revokeObjectURL(imgUrl);
            
            if (result.isInappropriate) {
              // Image contains inappropriate content
              updateStatus('Image moderation active');
              
              // Show warning to user
              app.showToast(`Image blocked: ${result.worstCategory} content detected`);
              
              console.log('Inappropriate image detected:', result.worstCategory, 
                          'Score:', result.highestScore.toFixed(2));
              
              return false;
            }
            
            updateStatus('Image moderation active');
            
            // If not inappropriate, proceed with upload
            return originalUploadImage.call(this, file);
          } catch (error) {
            console.error('Error during image moderation:', error);
            
            // If there's an error, allow the upload but log the issue
            return originalUploadImage.call(this, file);
          }
        };
      }
      
      // Also monitor for images added to the DOM
      const observeImages = () => {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(node => {
                // Check if the added node is an image or contains images
                if (node.nodeName === 'IMG') {
                  checkAndBlurIfNeeded(node);
                } else if (node.querySelectorAll) {
                  node.querySelectorAll('img').forEach(img => {
                    checkAndBlurIfNeeded(img);
                  });
                }
              });
            }
          });
        });
        
        // Start observing the chat area
        const chatArea = document.getElementById('chatMessages');
        if (chatArea) {
          observer.observe(chatArea, { 
            childList: true, 
            subtree: true 
          });
        }
      };
      
      // Check and blur an image if it's inappropriate
      const checkAndBlurIfNeeded = async (img) => {
        // Skip if already processed
        if (img.dataset.nsfwChecked === 'true') return;
        
        // Mark as checked to avoid duplicate processing
        img.dataset.nsfwChecked = 'true';
        
        // Wait for the image to load if it hasn't already
        if (!img.complete) {
          await new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
        
        try {
          // Check the image
          const result = await checkImage(img);
          
          if (result.isInappropriate) {
            console.log('Blurring inappropriate image:', result.worstCategory, 
                        'Score:', result.highestScore.toFixed(2));
            
            // Blur the image
            blurImage(img, result.highestScore);
          }
        } catch (error) {
          console.error('Error checking image for blurring:', error);
        }
      };
      
      // Start observing images
      observeImages();
    };
    
    // Load the NSFW model
    loadNSFWModel();
  }, 1500);
});