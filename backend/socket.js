const { instrument } = require("@socket.io/admin-ui");
const { Server } = require("socket.io");
var http = require('http');
let gameController = require('./controllers/gameApi');
const game = require("./models/game");
const { update } = require("./models/game");

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

io.on("connection", function( socket ) {
  console.log("socket1: A user connected" );
  socket.onAny((event, ...args) => {
    // console.log('any:',event, args);
  });
  socket.roomList = [];

  socket.on("room-msg",async (data)=>{
    console.log("room-msg:",JSON.stringify(data));
    let oldGameState = await gameController.getGame(data.payload.code);
    
    if(oldGameState === data.payload){
      console.log("nothing new")
    }else{  
      let currentTimestamp = Date.now(); 
      data.payload.lastTimestamp = currentTimestamp;
      let updatedRoomState = await gameController.updateGameInfo(data.payload); 
      socket.to(updatedRoomState.code).emit('room-msg',JSON.stringify({status:"msg",payload:updatedRoomState}));
    }
    
  })  

  socket.on('joinroom',async(room,userid)=>{
    console.log(room,userid);
    let roomInfo = await gameController.getGame(room);
    // console.log('gameinfo',JSON.stringify(roomInfo))
    // let roomInfo = {"_id":"62d5c09314502fe3ae39cde0","code":"JEIYG","currentTime":10,"chipstack":7777,"levelStructure":[{"level":1,"time":600,"_id":"62d5c09314502fe3ae39cde1"},{"level":2,"time":600,"_id":"62d5c09314502fe3ae39cde2"}],"currentLevel":1,"isGameGoing":true,"blindsStructure":[{"level":1,"bigBlind":20,"smallBlind":10,"_id":"62d5c09314502fe3ae39cde3"},{"level":2,"bigBlind":40,"smallBlind":20,"_id":"62d5c09314502fe3ae39cde4"}],"__v":0,"lastTimestamp":1659102519002};
      
    //modify it later to object
    // let answer = roomInfo ? `room ${roomInfo.code} created` : 'game not found'; 
    if(roomInfo){
      if(io.sockets.adapter.rooms.has(roomInfo.code)){
        console.log('room exist', roomInfo.isGameGoing,JSON.stringify(roomInfo));
        
        socket.join(roomInfo.code);  
        socket.roomList.push(roomInfo.code);

        if(roomInfo.isGameGoing){
          io.to(roomInfo.code).emit('room-msg',JSON.stringify({status:"sync"}));
        }else{
          io.to(roomInfo.code).emit('room-msg',JSON.stringify({status:"msg",payload:roomInfo}));
        }
      }else{
        console.log('room isnt exist, creating room ',roomInfo.code);
        socket.join(roomInfo.code);
        socket.roomList.push(roomInfo.code);
        io.to(roomInfo.code).emit('room-msg',JSON.stringify({status:"msg",payload:roomInfo}));
        socket.emit(userid,'room created');
      }
    }
  });


  socket.on('disconnect', function(){
    console.log('socket: user disconnected',socket.roomList);
    socket.roomList.map(async(room)=>{
      let game = await gameController.getGame(room);
      
      if(game.isGameGoing && !io.sockets.adapter.rooms.has(room)){
        let updated = await gameController.updateGameByTimestamp(game);
        updated.isGameGoing = false;
        updated.lastTimestamp = Date.now();
        gameController.updateGameInfo(updated);
        console.log(`all users from ${room} left so pausing game`);
      }
    })
  })
});

module.exports = io;