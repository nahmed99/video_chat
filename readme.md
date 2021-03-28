Created the project folder (using command line), and ran the following commands in cmd:

- nom init -y
- npm i express ejs socket.io
- npm i uuid
- npm i --save-dev nodemon

Also installed the following, to install a peer library to run a peer server:

- npm i -g peer


To Run:

As the following script has been added in package.json:

"scripts": { "devStart": "nodemon server.js" }

Type the following in terminal/cmd:

- npm run devStart


To run the peer server (use a separate cmd terminal):

- peerjs --port 3001
