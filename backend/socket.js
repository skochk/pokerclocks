const { instrument } = require("@socket.io/admin-ui");
const { Server } = require("socket.io");
var http = require('http');
let gameController = require('./controllers/gameApi');

var server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io","http://localhost:3005"],
    credentials: true
  }
});


instrument(io, {
  auth: false
});


io.on( "connection", function( socket ) {
  console.log("socket1: A user connected" );

  socket.on('joinroom',async(room)=>{
    console.log(room)
    let roomInfo = await gameController.getGame(room);
    console.log(roomInfo);
    if(roomInfo){
        socket.join(roomInfo.code);
    }
  })
  socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });

  socket.on('disconnect', function(){
      console.log('socket: user disconnected')
  })
});

module.exports = io;