var server = require('http').createServer()
  , io = require('socket.io').listen(server)
  , fs = require('fs')
  , url = require("url");

server.on('request', function(req, res){
  var pathname = url.parse(req.url).pathname,
    tmp  = pathname.lastIndexOf("."),
    extension  = pathname.substring((tmp + 1));

  fs.readFile(__dirname + pathname, function(err, data){
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + pathname);
    }

    if (extension === 'html') res.writeHeader(200, {'Content-Type': 'text/html'});
    else if (extension === 'htm') res.writeHeader(200, {'Content-Type': 'text/html'});
    else if (extension === 'css') res.writeHeader(200, {'Content-Type': 'text/css'});
    else if (extension === 'js') res.writeHeader(200, {'Content-Type': 'text/javascript'});
    else if (extension === 'png') res.writeHeader(200, {'Content-Type': 'image/png'});
    else if (extension === 'jpg') res.writeHeader(200, {'Content-Type': 'image/jpg'});
    else if (extension === 'jpeg') res.writeHeader(200, {'Content-Type': 'image/jpeg'});

    res.end(data);
  });
});

var playerList = [];

// io.on('connection', function(socket){
//   socket.on('initializePlayer', function(newPlayerName, newPlayerPos){
//     socket.clientName = newPlayerName;
//     playerList.push({
//       name: newPlayerName,
//       lastPos: newPlayerPos
//     });
//     socket.emit('setIndex', playerList.length - 1);
//     io.sockets.emit('addPlayer', playerList);
//   });

//   socket.on('updatePlayer', function(playerIndex, playerName, direction, target){
//     playerList[playerIndex].lastPos = target;
//     socket.broadcast.emit('updateOtherPlayer', playerName, direction, target);
//   });

//   socket.on('disconnect', function(){
//     for (var i = 0; i < playerList.length; i++) {
//       if (playerList[i].name == socket.clientName) {
//         playerList.splice(i, 1);
//       }
//     }
//     socket.broadcast.emit('removePlayer', playerList);
//   });
// });

server.listen(3000);
