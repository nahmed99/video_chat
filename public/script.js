// Connect socket to the root path
const socket = io('/'); 

const videoGrid = document.getElementById('video-grid');

// This will allocate id for each new user itself
const myPeer = new Peer(undefined, {
   host: '/',
   port: '3001'
});

const myVideo = document.createElement('video');
myVideo.muted = true; // Mute our own video - don't want to listen to ourselves! Others will still hear us.

navigator.mediaDevices.getUserMedia({
   video: true,
   audio: true
}).then(stream => {
   addVideoStream(myVideo, stream);
});

// As soon as we connect with peer server and get back 
// an id, we want to run codebelow
myPeer.on('open', id => {
   // Send event to server (join room)
   socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-connected', userId => {
   console.log('User connected: ' + userId);
}); 


function addVideoStream(video, stream) {
   video.srcObject = stream;
   video.addEventListener('loadedmetadata', () => {
      video.play(); // play the video once it is loaded on our screen
   });
   videoGrid.append(video);
}