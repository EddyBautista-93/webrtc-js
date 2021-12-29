var os = require("os");
var express = require("express");
var app = express();
var http = require("http");
//For signalling in WebRTC
var socketIO = require("socket.io");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index.ejs");
});

var server = http.createServer(app);

server.listen(process.env.PORT || 3000);

var io = socketIO(server);

// socket logic

io.socket.on("connection", function (socket){
    function log(){
        var array = ["Message from server:"];
        array.push.apply(array, arguments);
        socket.emit("log", array);
    }

    //Defining Socket Connections 
    socket.on("message", function (message, room){
        log("Client said: ", message);
        // for a real app, would be room-only (not broadcast)
        socket.in(room).emit("message", message, room);
    });
    socket.on("create or join", function (room, clientName){
        log("Received request to create or join room " + room);

        var clientsInRoom = io.sockets.adapter.rooms.get(room);

        var numClient = clientsInRoom ? clientsInRoom.size: 0;
        log("Room " + room + " now has " + numClient + " client(s)");
        
    })
})