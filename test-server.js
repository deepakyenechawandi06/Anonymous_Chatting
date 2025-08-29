const http = require('http');
const WebSocket = require('ws');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send a welcome message
  ws.send(JSON.stringify({
    type: 'message',
    userId: 'system',
    content: 'Connected to test server!'
  }));
  
  // Handle messages
  ws.on('message', (message) => {
    console.log('Received:', message);
    
    // Echo the message back
    ws.send(message);
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});