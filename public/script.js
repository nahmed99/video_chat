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

// object of users
const peers = {};

navigator.mediaDevices.getUserMedia({
   video: true,
   audio: true
}).then(stream => {
   addVideoStream(myVideo, stream);

   myPeer.on('call', call => {
      // When another user connects/calls, we send them our stream
      call.answer(stream);

      const video = document.createElement('video');
      // Send our stream to other user?
      call.on('stream', userVideoStream => {
         addVideoStream(video, userVideoStream);
      });
   });

   // Allow other users to connect to our computer.   
   socket.on('user-connected', userId => {
      connectToNewUser(userId, stream);
   }); 
});


// close the connection of the user that disconnected (left the video call)
socket.on('user-disconnected', userId => {
   if (peers[userId]) 
      peers[userId].close()
})

// As soon as we connect with peer server and get back 
// an id, we want to run codebelow
myPeer.on('open', id => {
   // Send event to server (join room)
   socket.emit('join-room', ROOM_ID, id);
});


function addVideoStream(video, stream) {
   video.srcObject = stream;
   video.addEventListener('loadedmetadata', () => {
      video.play(); // play the video once it is loaded on our screen
   });
   videoGrid.append(video);
}


function connectToNewUser(userId, stream) {

   // Sending our stream to the user (specified in the user id)
   const call = myPeer.call(userId, stream);

   const video = document.createElement('video');

   // Receive the other user's video stream
   call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream); // add other user's video on to our page.
   });

   // Close video when other user(s) leave.
   call.on('close', () => {
      video.remove();
   });

    peers[userId] = call
}