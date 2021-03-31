import express from "express"
import cors from "cors"
import router from "./routes";
import mongoose from "mongoose";
import config from "./config";
import http from "http";
import {users, blockedUsers, addUser, addBlockedUser, removeUser, unBlockUser, addAllUser, allUsers} from "./users"
import {IUser, IMessage, IRoom,IBlockerUser} from "./interface";
import { Server,Socket } from "socket.io";
import MessageModel from "./models/message";
import UserModel from "./models/user";
import RoomModel from "./models/room";
import BlockedUserModel from "./models/blockUser";

const app = express()
app.use(cors())
app.use(router);

const port = process.env.PORT || 5000

app.set('port',port)
const server = http.createServer(app);

const io = new Server(server,{
  cors: {
    origin: "*:*",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}).then(()=>{
  console.log("MongoDB connected...")
  io.on('connection',(socket:Socket)=>{
    socket.on('join', (iUser:IUser) => {
      const res = addUser({...iUser,id: socket.id});
      if (res){
        const model = new UserModel(iUser);
        model.save().then(() => {
          console.log('User saved')
        }).catch(e=>{
          console.log(e.message)
          console.log('User exist')
        })
      }
      RoomModel.find({ "name": { "$regex": iUser.email, "$options": "i" } }, function (err, docs:IUser[]) {
        io.emit('allRooms',{docs,email:iUser.email})
      })
      MessageModel.find({ "room": { "$regex": iUser.email, "$options": "i" } }, function (err, docs:IUser[]) {
        io.emit('allMessages',{docs,email:iUser.email})
      })
      BlockedUserModel.find({}, function(err, users:IBlockerUser[]) {
        users.forEach(function(user) {
          // addBlockedUser({email: user.email, by:user.by} as IBlockerUser)
          const index = blockedUsers.findIndex((block) => user.email === block.email)
          if(index === -1){
            addBlockedUser(user)
          }
        });
        io.emit('blockedUsers',blockedUsers)
      });
      UserModel.find({}, function(err, users:IUser[]) {
        users.forEach(function(user) {
          const index = allUsers.findIndex((value) => user.email === value.email)
          if(index === -1){
            addAllUser(user)
          }
        });
        io.emit('allUsers',allUsers)
      });
      io.emit('onlineUsers', users);
      console.log(`${iUser.email} joined`)
    });

    socket.on('saveRoom', (room:IRoom) => {
      const model = new RoomModel(room);
      model.save().then(() => {
        io.emit('addRoom', room)
        console.log('Room saved')
      }).catch(e=>{
        console.log(e.message)
        console.log('Room exist')
      })
    });

    socket.on('sendMessage', (message:IMessage, callback) => {
      const model = new MessageModel(message);
      model.save().then(() => {
        io.emit('message', message)
        console.log(socket.id+" in message")
        console.log('Message saved')
      }).catch(e=>{
        console.log(e.message)
        console.log('Message exist')
      })
      callback();
    });

    socket.on('blockUser', (block:IBlockerUser, callback) => {
      const model = new BlockedUserModel(block);
      model.save().then(() => {
        addBlockedUser(block)
        io.emit('blockedUsers',blockedUsers)
        console.log('blockUser saved')
      }).catch(e=>{
        console.log(e.message)
        console.log('blockUser not save')
      })
      callback();
    });

    socket.on('unBlockUser', (user:IBlockerUser) => {
      BlockedUserModel.findOneAndDelete({ email: user.email,by:user.by }, null , (err) =>{
        if(err) {
          console.log(err);
        }
        else {
          unBlockUser(user)
          io.emit('blockedUsers',blockedUsers)
        }

      });
    });

    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
      if(user) {
        io.emit('onlineUsers', users);
      }
    })

    socket.on('logout', (email,callback) => {
      const user = removeUser(email);

      if(user) {
        io.emit('onlineUsers', users);
      }
      callback()
    })
  })
  server.listen(port, ()=>console.log('Server running!'))
}).catch (e => {
  console.log(e.message)
  process.exit(1)
})