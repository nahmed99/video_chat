const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid'); //require uuid and name it 'uuidV4'

// set up express server
app.set('view engine', 'ejs'); // how we are going to render our views

// set up static folder (called 'public')
app.use(express.static('public')); // will hold js and css

// Create a brand new room when requested (req) - we don't
// have a home page for this application.
app.get('/', (req, res) => {
   res.redirect(`/${uuidV4()}`);
});

// Actually create the new room, according to the dynamic
// parm (room) passed in.
app.get('/:room', (req, res) => {
   res.render('room', { roomId: req.params.room }); // render a view called 'room'
});

io.on('connection', socket => {

   // Join a room, passing in roomId and userId
   socket.on('join-room', (roomId, userId) => {

      // join the room as specified in roomId
      socket.join(roomId);

      // Send a message to the room that user has joined
      // socket.to(roomId).broadcast.emit('user-connected', userId)  - This one does NOT work!!! Using the line below:
      socket.broadcast.to(roomId).emit("user-connected", userId)


      // When user disconnects from the 'call'
      socket.on('disconnect', () => {
         socket.broadcast.to(roomId).emit("user-disconnected", userId)
      });

   });

});

// The video chat does not communicate throught the
// server, it communicates directly with the users' 
// computer. The server is only used to set up the 
// rooms... i.e., we are NOT sending (video) traffic
// to the server.
server.listen(3000) // listen on port 3000