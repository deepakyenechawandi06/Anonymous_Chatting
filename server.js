const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');

// Create Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set up file storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`);
  }
});

// File filter to validate images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Set up multer with file size limits
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Filter abusive words
const abusiveWords = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'cunt', 'dick'];
function filterAbusiveWords(text) {
  if (!text) return '';
  let filtered = text;
  abusiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  });
  return filtered;
}

// Serve static files
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(req.file.mimetype)) {
    // Remove invalid file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Return success response
  res.json({ 
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename
  });
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  next(err);
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat groups storage
const groups = new Map();

// WebSocket connection handling
wss.on('connection', (ws) => {
  let userGroupId = null;
  let userId = null;
  let userColor = null;
  let userNickname = null;
  let isMuted = false;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'join':
          handleJoin(ws, data);
          break;
        case 'message':
          if (!isMuted) handleMessage(ws, data);
          break;
        case 'image':
          if (!isMuted) handleImage(ws, data);
          break;
        case 'kick':
          handleKick(ws, data);
          break;
        case 'mute':
          handleMute(ws, data);
          break;
        case 'unmute':
          handleUnmute(ws, data);
          break;
        case 'nickname':
          handleNickname(ws, data);
          break;
        case 'background':
          handleBackground(ws, data);
          break;
        case 'requestBackground':
          handleRequestBackground(ws, data);
          break;
        case 'theme':
          handleTheme(ws, data);
          break;
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  function handleJoin(ws, data) {
    userId = data.userId;
    userGroupId = data.groupId;
    userColor = data.color || getRandomColor();
    userNickname = data.nickname || `User ${userId.substring(0, 6)}`;
    
    if (!groups.has(userGroupId)) {
      // Create new group with this user as admin
      groups.set(userGroupId, {
        admin: data.isAdmin ? userId : null,
        members: new Map([[userId, { ws, color: userColor, nickname: userNickname, muted: false }]]),
        settings: {} // Initialize settings object
      });
    } else {
      // Add user to existing group
      const group = groups.get(userGroupId);
      group.members.set(userId, { ws, color: userColor, nickname: userNickname, muted: false });
      
      // Initialize settings if not present
      if (!group.settings) {
        group.settings = {};
      }
    }
    
    // Notify client if they are admin
    if (groups.get(userGroupId).admin === userId) {
      ws.send(JSON.stringify({ type: 'admin', isAdmin: true }));
    }
    
    // Send welcome message
    broadcastToGroup(userGroupId, {
      type: 'message',
      userId: 'system',
      content: `${userNickname} has joined the chat`,
      timestamp: Date.now(),
      system: true
    });
    
    // Send updated member list to all members
    broadcastMembers(userGroupId);
    
    // Send background settings to the new user immediately after joining
    setTimeout(() => {
      const group = groups.get(userGroupId);
      if (group && group.settings && group.settings.background) {
        console.log(`Sending background settings to new user ${userId}`);
        ws.send(JSON.stringify({
          type: 'background',
          bgType: group.settings.background.type,
          customValue: group.settings.background.value,
          darkOverlay: group.settings.background.darkOverlay
        }));
      }
      
      // Also send theme settings if available
      if (group && group.settings && group.settings.theme) {
        ws.send(JSON.stringify({
          type: 'theme',
          theme: group.settings.theme
        }));
      }
      
      // Send another background update to all users to ensure synchronization
      if (group && group.settings && group.settings.background) {
        setTimeout(() => {
          broadcastToGroup(userGroupId, {
            type: 'background',
            bgType: group.settings.background.type,
            customValue: group.settings.background.value,
            darkOverlay: group.settings.background.darkOverlay
          });
        }, 1000);
      }
    }, 1000);
  }

  function handleMessage(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      // Filter abusive words
      const filteredContent = filterAbusiveWords(data.content);
      
      broadcastToGroup(userGroupId, {
        type: 'message',
        userId: userId,
        nickname: userNickname,
        content: filteredContent,
        color: userColor,
        timestamp: Date.now()
      });
    }
  }

  function handleImage(ws, data) {
    if (userGroupId && groups.has(userGroupId) && data.imageUrl) {
      broadcastToGroup(userGroupId, {
        type: 'image',
        userId: userId,
        nickname: userNickname,
        imageUrl: data.imageUrl,
        color: userColor,
        timestamp: Date.now()
      });
    }
  }

  function handleKick(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      if (group.admin === userId && group.members.has(data.targetId)) {
        const targetWs = group.members.get(data.targetId).ws;
        const targetNickname = group.members.get(data.targetId).nickname;
        
        targetWs.send(JSON.stringify({ 
          type: 'kicked', 
          message: 'You have been removed from the group' 
        }));
        
        group.members.delete(data.targetId);
        
        // Notify group
        broadcastToGroup(userGroupId, {
          type: 'message',
          userId: 'system',
          content: `${targetNickname} has been removed from the chat`,
          timestamp: Date.now(),
          system: true
        });
        
        broadcastMembers(userGroupId);
      }
    }
  }

  function handleMute(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      if (group.admin === userId && group.members.has(data.targetId)) {
        const memberInfo = group.members.get(data.targetId);
        memberInfo.muted = true;
        
        // Update the member's mute status
        if (data.targetId === userId) {
          isMuted = true;
        }
        
        // Notify the muted user
        memberInfo.ws.send(JSON.stringify({ 
          type: 'muted', 
          message: 'You have been muted by the admin' 
        }));
        
        // Notify group
        broadcastToGroup(userGroupId, {
          type: 'message',
          userId: 'system',
          content: `${memberInfo.nickname} has been muted`,
          timestamp: Date.now(),
          system: true
        });
        
        broadcastMembers(userGroupId);
      }
    }
  }

  function handleUnmute(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      if (group.admin === userId && group.members.has(data.targetId)) {
        const memberInfo = group.members.get(data.targetId);
        memberInfo.muted = false;
        
        // Update the member's mute status
        if (data.targetId === userId) {
          isMuted = false;
        }
        
        // Notify the unmuted user
        memberInfo.ws.send(JSON.stringify({ 
          type: 'unmuted', 
          message: 'You have been unmuted by the admin' 
        }));
        
        // Notify group
        broadcastToGroup(userGroupId, {
          type: 'message',
          userId: 'system',
          content: `${memberInfo.nickname} has been unmuted`,
          timestamp: Date.now(),
          system: true
        });
        
        broadcastMembers(userGroupId);
      }
    }
  }

  function handleNickname(ws, data) {
    if (userGroupId && groups.has(userGroupId) && data.nickname) {
      const group = groups.get(userGroupId);
      if (group.members.has(userId)) {
        const oldNickname = userNickname;
        userNickname = filterAbusiveWords(data.nickname);
        group.members.get(userId).nickname = userNickname;
        
        // Notify group of nickname change
        broadcastToGroup(userGroupId, {
          type: 'message',
          userId: 'system',
          content: `${oldNickname} is now known as ${userNickname}`,
          timestamp: Date.now(),
          system: true
        });
        
        broadcastMembers(userGroupId);
      }
    }
  }
  
  function handleBackground(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      
      // Check if this is a group-wide background change (admin only)
      if (data.shareWithGroup) {
        // Only allow admin to change background for everyone
        if (group.admin === userId) {
          // Store the background settings in the group
          if (!group.settings) group.settings = {};
          group.settings.background = {
            type: data.bgType,
            value: data.customValue,
            darkOverlay: data.darkOverlay
          };
          
          console.log(`Admin ${userId} shared background ${data.bgType} with group ${userGroupId}`);
          
          // For image backgrounds, make sure we're using server paths not data URLs
          if (data.bgType === 'image' && data.customValue) {
            // If it's already a server path, use it as is
            if (!data.customValue.startsWith('data:')) {
              console.log('Using server path for background image');
            } else {
              console.log('WARNING: Data URL detected for background image - this may cause issues');
            }
          }
          
          // Broadcast background change to all members with a small delay
          setTimeout(() => {
            broadcastToGroup(userGroupId, {
              type: 'background',
              bgType: data.bgType,
              customValue: data.customValue,
              darkOverlay: data.darkOverlay,
              fromAdmin: true
            });
          }, 500);
        }
      } else {
        // This is a personal background change, no need to broadcast or store in group settings
        console.log(`User ${userId} changed their personal background to ${data.bgType}`);
      }
    }
  }
  
  function handleTheme(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      // Only allow admin to change theme for everyone
      if (group.admin === userId) {
        // Broadcast theme change to all members
        broadcastToGroup(userGroupId, {
          type: 'theme',
          theme: data.theme
        });
        
        // Store the theme in the group settings
        if (!group.settings) group.settings = {};
        group.settings.theme = data.theme;
      }
    }
  }
  
  function handleRequestBackground(ws, data) {
    if (userGroupId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      
      console.log(`User ${userId} requested background settings for group ${userGroupId}`);
      
      // If group has stored background settings, send them to the requesting user
      if (group.settings && (group.settings.background || group.settings.theme)) {
        // Send background settings directly to the requesting user
        if (group.settings.background) {
          console.log(`Sending background settings to user ${userId}: ${JSON.stringify(group.settings.background)}`);
          
          ws.send(JSON.stringify({
            type: 'background',
            bgType: group.settings.background.type,
            customValue: group.settings.background.value,
            darkOverlay: group.settings.background.darkOverlay
          }));
        } else {
          console.log(`No background settings found for group ${userGroupId}`);
        }
        
        // Send theme settings if available
        if (group.settings.theme) {
          ws.send(JSON.stringify({
            type: 'theme',
            theme: group.settings.theme
          }));
        }
      } else {
        console.log(`No settings found for group ${userGroupId}`);
      }
    }
  }

  ws.on('close', () => {
    if (userGroupId && userId && groups.has(userGroupId)) {
      const group = groups.get(userGroupId);
      if (group.members.has(userId)) {
        const nickname = group.members.get(userId).nickname;
        group.members.delete(userId);
        
        // Notify group that user left
        broadcastToGroup(userGroupId, {
          type: 'message',
          userId: 'system',
          content: `${nickname} has left the chat`,
          timestamp: Date.now(),
          system: true
        });
        
        if (group.members.size === 0) {
          groups.delete(userGroupId);
        } else {
          // If admin left, assign new admin
          if (group.admin === userId) {
            const nextAdmin = Array.from(group.members.keys())[0];
            group.admin = nextAdmin;
            const adminWs = group.members.get(nextAdmin).ws;
            
            adminWs.send(JSON.stringify({ type: 'admin', isAdmin: true }));
            
            // Notify group of new admin
            broadcastToGroup(userGroupId, {
              type: 'message',
              userId: 'system',
              content: `${group.members.get(nextAdmin).nickname} is now the admin`,
              timestamp: Date.now(),
              system: true
            });
          }
          
          broadcastMembers(userGroupId);
        }
      }
    }
  });
});

function broadcastToGroup(groupId, data) {
  const group = groups.get(groupId);
  if (!group) return;
  
  const message = JSON.stringify(data);
  for (const member of group.members.values()) {
    member.ws.send(message);
  }
}

function broadcastMembers(groupId) {
  const group = groups.get(groupId);
  if (!group) return;
  
  const membersList = Array.from(group.members.entries()).map(([id, info]) => ({
    id,
    nickname: info.nickname,
    color: info.color,
    muted: info.muted,
    isAdmin: id === group.admin
  }));
  
  broadcastToGroup(groupId, {
    type: 'members',
    members: membersList
  });
}

function getRandomColor() {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33A8FF',
    '#A833FF', '#FF8C33', '#33FFC5', '#FF33C5', '#C533FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Start the server
const PORT = 8080;
const localIP = getLocalIP();
server.listen(PORT, () => {
  console.log(`Server running at http://${localIP}:${PORT}/`);
  console.log(`WebSocket server running at ws://${localIP}:${PORT}/`);
});