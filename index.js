
const { Socket } = require('dgram');
const express = require('express');
const app = express(); 
const path = require('path');
const http =require('http').Server(app);
var io =require('socket.io')(http);
app.set('view engine','ejs');
app.set('views','./')
const port=process.env.port || 3000;
http.listen(port,()=>{
    console.log('server is running');
});
var users=[];
var roomno=0;
io.on('connection',function(socket){
    socket.on('set-user-name',function(data){
        // socket.on('disconnect',function(){
        //     socket.broadcast.emit('user-disconnect',{username:data});
        //     delete users[data];
        // })
        console.log(data+' user connected');
    if(users.indexOf(data)>-1){
        socket.emit('userexist',data +' username is already in use');
    }
    else{
        users.push(data);
        socket.emit('set-user',{username:data});
    }
    // socket.on('disconnect',function(data){
    //      io.sockets.emit('user-disconnect',{username:data});
    //      delete data;
    // })
     socket.on('message',function(data){
      socket.broadcast.emit('new-msg',{username:data.user,message:data.message});
       socket.emit('new-msg',{username:"you",message:data.message});
    })
     io.sockets.emit('user-connect',{username:data});//broadcast properly work nahi ker rha tha
    });
});
app.get('/',function(req,res){
    res.render('hello');
})
