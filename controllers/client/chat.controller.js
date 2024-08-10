const Chat = require("../../models/chat.model");
const User = require('../../models/user.model');
const streamUpload = require("../../helpers/streamUpload.helper");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIo
  chatSocket(req, res);
  // End SocketIo
  const chats = await Chat.find({});

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    });

    chat.fullName = infoUser.fullName;
  }
  
  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
    chats: chats
  })
}