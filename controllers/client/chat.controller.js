const Chat = require("../../models/chat.model");
const User = require('../../models/user.model');
const RoomChat = require("../../models/rooms-chat.model");
const streamUpload = require("../../helpers/streamUpload.helper");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  try{
    const roomChatId = req.params.roomChatId;
    const userIdA = res.locals.user.id
    // SocketIo
    chatSocket(req, res);
    // End SocketIo
    const roomChat = await RoomChat.findOne({
      _id: roomChatId
    });
    if(roomChat.typeRoom === "friend"){
      for(const user of roomChat.users){
        if(user.userId !== res.locals.user.id){
          const infoB  = await User.findOne({
            _id: user.userId
          }).select("fullName avatar");
          roomChat.title = infoB.fullName
        }
      }
    }

    const chats = await Chat.find({
      roomChatId: roomChatId
    });
  
    for (const chat of chats) {
      const infoUser = await User.findOne({
        _id: chat.userId
      });
  
      chat.fullName = infoUser.fullName;
    }
    
    res.render("client/pages/chat/index.pug", {
      pageTitle: "Chat",
      chats: chats,
      roomChat: roomChat
    })
  } catch(e){
    res.redirect("back");
  }
}