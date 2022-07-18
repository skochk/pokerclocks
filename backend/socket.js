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
    socket.onAny((event, ...args) => {
    // console.log('any:',event, args);
  });

  // must be writed like msg come globally with mark roommsg then choose rom and emit to specific room https://socket.io/get-started/private-messaging-part-3/ Persistent messages
  socket.on("room-msg",async (data)=>{
    console.log("room-msg:",data);
    let roomStateDB = await gameController.getGame(data.code);
    
    if(roomStateDB === data){
      console.log("nothing new")
    }else{
      //add logic for counting spended time while game .isGameGoing = true => currentTime must be changed
      let updatedRoomState = await gameController.updateGameInfo(data);
      socket.to(data.code).emit('room-msg',updatedRoomState);
      console.log("old:",roomStateDB,"new:",updatedRoomState)
      
    }
    
  })  

  socket.on('joinroom',async(room,userid)=>{
     
    let roomInfo = await gameController.getGame(room);
    
    //modify it later to object
    let answer = roomInfo ? `room ${roomInfo.code} created` : 'game not found'; 
    if(roomInfo){
        socket.join(roomInfo.code);
        io.to(roomInfo.code).emit('room-msg',JSON.stringify(roomInfo));
        socket.emit(userid,'room created');

    }
  });


  socket.on('disconnect', function(){
      console.log('socket: user disconnected')
  })
});

module.exports = io;