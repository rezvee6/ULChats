
const express = require('express');

const app = express();

const server = app.listen(3001, _ => {
    console.log('server running on port 3001');
});

const io = require('socket.io')(server);

let clients = []
let onlineUsers = []

// Debug variables
let connectionCount = 0

io.on('connection', (socket) => {
    connectionCount++
    console.log("Recieved new connection!")
    console.log("Connection count: ", connectionCount)
    
    //send a message to socket ID .. who are you 
    io.to(socket.id).emit('CLIENT_QUERY', {
        type: 'clientQuery',
        message: 'who are you?'
    });

    clients.push(socket.id)
    
    console.log("Socket Id: ", socket.id)
    console.log("\n")
    console.log("Clients: " , clients)
    console.log("\n")

    socket.on('SEND_MESSAGE', function(data) {
        userSocketID = getSocketID(data.user)
        io.to(userSocketID).emit('MESSAGE', data)
    });

    socket.on('CLIENT_INFO', function(data) {
        if(onlineUsers.length != 0){
            for(var i = 0; i < onlineUsers.length; i++){
                if(data.user == onlineUsers[i].user){
                    onlineUsers.splice(i, 1)
                    for(var j = 0; j < clients.length; j++){
                        if(data.socketID == clients[j]){
                            clients.splice(j, 1)
                        }
                    }
                }
            }
        }
        onlineUsers.push(data)
        
        console.log("onlineUsers: ", onlineUsers)
        console.log("\n")

        socket.broadcast.emit('ONLINE_USERS', onlineUsers);
    });

});

function getSocketID(user){
    for(userIndex in onlineUsers){
        if(onlineUsers[userIndex].user == user){
            return onlineUsers[userIndex].socketID
        }
    }
    return null
}