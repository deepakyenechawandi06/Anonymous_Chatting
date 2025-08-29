/**
 * Enhanced WebSocket server with sound notification support
 */
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Serve static files
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.mp3':
      contentType = 'audio/mpeg';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections and groups
const connections = new Map();
const groups = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  const clientId = uuidv4();
  connections.set(clientId, ws);
  
  let clientGroup = null;
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    content: 'Connected to chat server',
    clientId: clientId
  }));
  
  // Handle messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle different message types
      switch (data.type) {
        case 'join':
          handleJoin(clientId, data.groupId, ws);
          clientGroup = data.groupId;
          break;
          
        case 'message':
          handleMessage(clientId, data.content, data.groupId || clientGroup, ws);
          break;
          
        case 'typing':
          handleTyping(clientId, data.groupId || clientGroup);
          break;
      }
    } catch (e) {
      console.error('Error processing message:', e);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    if (clientGroup && groups.has(clientGroup)) {
      const group = groups.get(clientGroup);
      group.delete(clientId);
      
      // Notify others in the group
      broadcastToGroup(clientGroup, {
        type: 'system',
        content: 'A user has left the chat',
        users: group.size
      });
    }
    
    connections.delete(clientId);
  });
});

// Handle join group
function handleJoin(clientId, groupId, ws) {
  // Create group if it doesn't exist
  if (!groups.has(groupId)) {
    groups.set(groupId, new Set());
  }
  
  const group = groups.get(groupId);
  group.add(clientId);
  
  // Send group info
  ws.send(JSON.stringify({
    type: 'group-joined',
    groupId: groupId,
    users: group.size
  }));
  
  // Notify others in the group
  broadcastToGroup(groupId, {
    type: 'system',
    content: 'A new user has joined the chat',
    users: group.size
  }, clientId);
}

// Handle chat message
function handleMessage(clientId, content, groupId, ws) {
  if (!groupId || !groups.has(groupId)) {
    ws.send(JSON.stringify({
      type: 'error',
      content: 'You are not in a group'
    }));
    return;
  }
  
  // Add sound notification flag to message
  const messageWithSound = {
    type: 'message',
    content: content,
    sender: clientId,
    timestamp: Date.now(),
    playSound: true
  };
  
  // Broadcast to group
  broadcastToGroup(groupId, messageWithSound, clientId);
  
  // Send confirmation to sender
  ws.send(JSON.stringify({
    type: 'message-sent',
    content: content,
    timestamp: messageWithSound.timestamp
  }));
}

// Handle typing indicator
function handleTyping(clientId, groupId) {
  if (!groupId || !groups.has(groupId)) {
    return;
  }
  
  broadcastToGroup(groupId, {
    type: 'typing',
    sender: clientId
  }, clientId);
}

// Broadcast message to all clients in a group
function broadcastToGroup(groupId, message, excludeClientId = null) {
  if (!groups.has(groupId)) return;
  
  const group = groups.get(groupId);
  group.forEach(clientId => {
    if (clientId !== excludeClientId && connections.has(clientId)) {
      const client = connections.get(clientId);
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    }
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});