// Connect socket to the root path
const socket = io('/'); 

// Send event to server (join room)
socket.emit('join-room', ROOM_ID, 10);

socket.on('user-connected', userId => {
   console.log('User connected' + userId);
}); 
