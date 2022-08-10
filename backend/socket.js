const { instrument } = require("@socket.io/admin-ui");
const { Server } = require("socket.io");
var http = require('http');
let gameController = require('./controllers/gameApi');
const game = require("./models/game");

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

  socket.on("room-msg",async (data)=>{
    console.log("room-msg:",data);
    let oldGameState = await gameController.getGame(data.code);
    
    if(oldGameState === data){
      console.log("nothing new")
    }else{  
      let currentTimestamp = Date.now();
      data.lastTimestamp = currentTimestamp;
      console.log(currentTimestamp);
      let updatedRoomState = await gameController.updateGameInfo(data); 
      socket.to(updatedRoomState.code).emit('room-msg',updatedRoomState);
       
      // if game paused game state must be updated  /// возможно это не надо делать, можно брать просто весь объект с фронта
      // if(oldGameState.isGameGoing == true  && data.isGameGoing == false){
      //   let totalTimeLeft = await gameController.calcTotalLeft(data);
      //   let newLeftTime = totalTimeLeft - Math.floor((currentTimestamp - data.lastTimestamp)/ 1000);
      //   console.log('was time and new',totalTimeLeft, newLeftTime) 
      //   let newLvl = await gameController.getCurrentLvlState(data,newLeftTime);
      //   console.log('newLvl',newLvl)
      //   data.level = newLvl.level;
      //   data.currentTime = newLvl .currentTime;
      // }
      // data.lastTimestamp = currentTimestamp;
      // console.log('obj before saving',data)
      // let updatedRoomState = await gameController.updateGameInfo(data);
      // socket.to(updatedRoomState.code).emit('room-msg',updatedRoomState);
      // console.log("old:",oldGameState,"new:",updatedRoomState);
    }
    
  })  

  socket.on('joinroom',async(room,userid)=>{
    console.log(room,userid);
    // let roomInfo = await gameController.getGame(room);
    let roomInfo = {"_id":"62d5c09314502fe3ae39cde0","code":"JEIYG","currentTime":10,"chipstack":7777,"levelStructure":[{"level":1,"time":600,"_id":"62d5c09314502fe3ae39cde1"},{"level":2,"time":600,"_id":"62d5c09314502fe3ae39cde2"}],"currentLevel":1,"isGameGoing":false,"blindsStructure":[{"level":1,"bigBlind":20,"smallBlind":10,"_id":"62d5c09314502fe3ae39cde3"},{"level":2,"bigBlind":40,"smallBlind":20,"_id":"62d5c09314502fe3ae39cde4"}],"__v":0,"lastTimestamp":1659102519002};
      
    console.log('gameinfo',JSON.stringify(roomInfo))
    //modify it later to object
    // let answer = roomInfo ? `room ${roomInfo.code} created` : 'game not found'; 
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