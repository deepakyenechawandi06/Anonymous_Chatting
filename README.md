# Anonymous Chatting Application

A simple incognito chatting application using WebSockets.

## Screenshots

### Main Chat Interface
![Main Chat Interface](Screenshot%202025-06-15%20154607.png)

### Group Management & Admin Features
![Admin Controls](screenshots/Screenshot%202025-08-29%20131441.png)


## Setup Instructions

### Option 1: Using Command Prompt (Recommended)
1. Open Command Prompt (not PowerShell)
2. Navigate to the project directory:
   ```
   cd C:\Users\Deepak Yenechawandi\Desktop\Anonymous Chatting
   ```
3. Install dependencies:
   ```
   npm install 
   ```
4. Start the server:
   ```
   npm start
   ```
5. The server will display a URL like `http://192.168.x.x:8080/` - open this in your browser

### Option 2: Using PowerShell with Bypass
```
powershell -ExecutionPolicy Bypass -Command "npm install"
powershell -ExecutionPolicy Bypass -Command "npm start"
```

## Sharing with Other Devices

1. Make sure all devices are on the same WiFi network
2. Start the server on your computer
3. Note the IP address shown in the console (e.g., 192.168.x.x)
4. On other devices, open a browser and navigate to `http://192.168.x.x:8080`
5. Use the "Share Link" button to copy a link that includes the group ID

## Features

- Incognito chatting with randomly generated user IDs
- Create or join chat groups
- Admin controls for group creators (kick, mute, and manage members)
- Share group links with others via QR code or direct link
- Real-time messaging
- Image sharing capability
- Profanity filter for abusive language
- Customizable user interface with different colors for each user
- Nickname support for personalization
- Chat background customization options (colors, patterns, and custom images)