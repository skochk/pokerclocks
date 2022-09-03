const io = require( "socket.io" )();
const socketapi = {
    io: io,
};
socketapi.opts = {
    cors:{
      origin:"*"
    }
  }
  
// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log("socket: A user connected" );

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });

    socket.on('disconnect', function(){
        console.log('socket: user disconnected')
    })
});
// end of socket.io logic

module.exports = socketapi;