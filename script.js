const generateUUID = () => {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
       const r = Math.random() * 16 | 0;
       const v = c === 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
     });
   };

   const userId = localStorage.getItem('userId') || generateUUID();
   localStorage.setSetItem('userId', userId);
   let groupId = '';
   let isAdmin = false;
   const ws = new WebSocket('ws://localhost:8080');

   const landingPage = document.getElementById('landing-page');
   const chatPage = document.getElementById('chat-page');
   const startChatting = document.getElementById('start-chatting');
   const joinGroupBtn = document.getElementById('join-group');
   const groupIdInput = document.getElementById('group-id-input');
   const groupIdDisplay = document.getElementById('group-id');
   const messagesDiv = document.getElementById('messages');
   const messageInput = document.getElementById('message-input');
   const sendMessageBtn = document.getElementById('send-message');
   const shareGroupBtn = document.getElementById('share-group');
   const qrCodeImg = document.getElementById('qr-code');
   const adminPanel = document.getElementById('admin-panel');
   const addMemberInput = document.getElementById('add-member-input');
   const addMemberBtn = document.getElementById('add-member');
   const memberList = document.getElementById('member-list');

   ws.onopen = () => {
     console.log('Connected to WebSocket server');
   };

   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     if (data.type === 'message') {
       const messageDiv = document.createElement('div');
       messageDiv.className = `mb-2 p-2 rounded-lg ${data.userId === userId ? 'bg-blue-200 ml-auto' : 'bg-gray-200'} max-w-xs`;
       messageDiv.innerHTML = `<p class="text-sm font-semibold">User ${data.userId.slice(0, 8)}</p><p>${data.content}</p>`;
       messagesDiv.appendChild(messageDiv);
       messagesDiv.scrollTop = messagesDiv.scrollHeight;
     } else if (data.type === 'members') {
       memberList.innerHTML = '';
       data.members.forEach((member) => {
         const li = document.createElement('li');
         li.className = 'flex justify-between items-center';
         li.innerHTML = `<span>User ${member.slice(0, 8)}</span>`;
         if (isAdmin && member !== userId) {
           const kickBtn = document.createElement('button');
           kickBtn.className = 'text-red-500 hover:text-red-700';
           kickBtn.textContent = 'Kick';
           kickBtn.onclick = () => {
             ws.send(JSON.stringify({ type: 'kick', groupId, userId: member }));
           };
           li.appendChild(kickBtn);
         }
         memberList.appendChild(li);
       });
     } else if (data.type === 'admin') {
       isAdmin = data.isAdmin;
       adminPanel.classList.toggle('hidden', !isAdmin);
     }
   };

   ws.onclose = () => {
     alert('Disconnected from server. Please refresh to reconnect.');
   };

   startChatting.onclick = () => {
     groupId = generateUUID();
     isAdmin = true;
     ws.send(JSON.stringify({ type: 'join', groupId, userId, isAdmin: true }));
     groupIdDisplay.textContent = `Group: ${groupId}`;
     landingPage.classList.add('hidden');
     chatPage.classList.remove('hidden');
     generateQRCode(groupId);
   };

   joinGroupBtn.onclick = () => {
     groupId = groupIdInput.value.trim();
     if (groupId) {
       ws.send(JSON.stringify({ type: 'join', groupId, userId, isAdmin: false }));
       groupIdDisplay.textContent = `Group: ${groupId}`;
       landingPage.classList.add('hidden');
       chatPage.classList.remove('hidden');
     } else {
       alert('Please enter a valid Group ID');
     }
   };

   sendMessageBtn.onclick = () => {
     const content = messageInput.value.trim();
     if (content && ws.readyState === WebSocket.OPEN) {
       ws.send(JSON.stringify({ type: 'message', groupId, userId, content }));
       messageInput.value = '';
     }
   };

   messageInput.onkeypress = (e) => {
     if (e.key === 'Enter') sendMessageBtn.click();
   };

   addMemberBtn.onclick = () => {
     const newMemberId = addMemberInput.value.trim();
     if (newMemberId && isAdmin) {
       ws.send(JSON.stringify({ type: 'add', groupId, userId: newMemberId }));
       addMemberInput.value = '';
     } else {
       alert('Please enter a valid User ID');
     }
   };

   shareGroupBtn.onclick = () => {
     const url = `${window.location.origin}?group=${groupId}`;
     const text = 'Join my anonymous chat group!';
     if (navigator.share) {
       navigator.share({ title: 'Anonymous Chat', text, url })
         .catch(() => alert(`Share this link: ${url}`));
     } else {
       alert(`Share this link: ${url}`);
     }
   };

   function generateQRCode(groupId) {
     const url = `${window.location.origin}?group=${groupId}`;
     QRCode.toDataURL(url, (err, qrUrl) => {
       if (!err && isAdmin) {
         qrCodeImg.src = qrUrl;
         qrCodeImg.classList.remove('hidden');
       }
     });
   }

   // Auto-join group from URL query parameter
   const urlParams = new URLSearchParams(window.location.search);
   const groupFromUrl = urlParams.get('group');
   if (groupFromUrl) {
     groupIdInput.value = groupFromUrl;
     joinGroupBtn.click();
   }