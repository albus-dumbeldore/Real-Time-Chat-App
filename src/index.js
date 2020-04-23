const path                  = require('path')
const http                  = require('http')
const express               = require('express')
const socketio              = require('socket.io')
const Filter                = require('bad-words')
const {generateMessage}     = require('./utils/messages')
const {generateLocation}    = require('./utils/locations')

const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')


const app     = express()
const server  = http.createServer(app)
const io      = socketio(server)

const port                  = process.env.PORT || 3000
const publicDirectoryPath   = path.join(__dirname,'../public')
// console.log(path.join(__dirname))

app.use(express.static(publicDirectoryPath))

 


io.on('connection',(socket)=>{
    // console.log('New Websocket Connection')
     
    // socket.emit('newUser','Welcome')
    // socket.emit('message',generateMessage('Welcome'))
    // socket.broadcast.emit('message',generateMessage('A new user has joined!')) 
    
    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})


        if(error){
            return callback(error)
        }
        // Filter room bad-words
        const filter = new Filter()
        filter.addWords('loda','bosdi','gandu','chut','lodi','bosdike','bhenkaloda','madarchod','bhosdike','terimakichut')
        filter.clean("some bad word")
        if(filter.isProfane(user.room)){
            return callback('Room name me to gali mat likh suar :)')
        }


        
        socket.join(user.room)

        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`)) 
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        filter.addWords('loda','bosdi','gandu','chut','lodi','bosdike','bhenkaloda','madarchod','bhosdike','terimakichut','bhenkaloda','chutiya','kutta','kuttiya')
        filter.clean("some bad word")
        const user = getUser(socket.id)


        if(filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()

    })

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        // io.emit('locationShared',coords)
        // io.emit('message',`Location:${coords.latitude},${coords.longitude}`)
        io.to(user.room).emit('LocationEmitServer',generateLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){ 
            io.to(user.room).emit('message',generateMessage('Admin ',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
            // io.to(user.room).emit('message',generateMessage(user.username + ' has left!'))
        }
    })
})

server.listen(port,()=>{
    console.log('Server is on port ' + 3000) 
})