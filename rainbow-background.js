// Rainbow background effect for the outer layer
document.addEventListener('DOMContentLoaded', () => {
  // Start the color animation
  let hue = 0;
  
  // Function to update the background color
  function updateBackgroundColor() {
    hue = (hue + 5) % 360; // Increment hue by 5 degrees each time
    document.body.style.background = `hsl(${hue}, 70%, 60%)`; // Use HSL for smooth transitions
  }
  
  // Update color every 500ms (0.5 seconds)
  setInterval(updateBackgroundColor, 500);
});