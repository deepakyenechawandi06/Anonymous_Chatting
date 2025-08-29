// Content moderation using TensorFlow.js Toxicity model
document.addEventListener('DOMContentLoaded', () => {
  // Wait for app to initialize
  setTimeout(() => {
    // Threshold for toxicity detection (0.0 to 1.0)
    const threshold = 0.85;
    let toxicityModel = null;
    let isModelLoading = false;
    
    // Add status indicator to the UI
    const addStatusIndicator = () => {
      const headerButtons = document.querySelector('.header-buttons');
      if (headerButtons) {
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'moderationStatus';
        statusIndicator.style.display = 'inline-block';
        statusIndicator.style.marginRight = '10px';
        statusIndicator.style.fontSize = '12px';
        statusIndicator.style.color = '#888';
        statusIndicator.textContent = 'Loading moderation...';
        headerButtons.prepend(statusIndicator);
      }
    };
    
    // Load the toxicity model
    const loadToxicityModel = async () => {
      if (toxicityModel || isModelLoading) return;
      
      try {
        isModelLoading = true;
        updateStatus('Loading moderation model...');
        
        // Load the model with specific toxicity categories
        toxicityModel = await toxicity.load(threshold, [
          'identity_attack',
          'insult',
          'obscene',
          'severe_toxicity',
          'sexual_explicit',
          'threat',
          'toxicity'
        ]);
        
        // Make the model globally available for auto-moderation
        window.toxicityModel = toxicityModel;
        
        updateStatus('Moderation active');
        console.log('Toxicity model loaded successfully');
      } catch (error) {
        console.error('Failed to load toxicity model:', error);
        updateStatus('Moderation unavailable');
      } finally {
        isModelLoading = false;
      }
    };
    
    // Update the status indicator
    const updateStatus = (text) => {
      const statusIndicator = document.getElementById('moderationStatus');
      if (statusIndicator) {
        statusIndicator.textContent = text;
      }
    };
    
    // Add the status indicator and load the model
    addStatusIndicator();
    loadToxicityModel();
  }, 1000);
});