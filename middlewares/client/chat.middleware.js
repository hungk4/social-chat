const RoomChat = require("../../models/rooms-chat.model");
module.exports.isAccess = async (req, res, next) => {
  try{
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;
  
    const room = await RoomChat.findOne({
      _id: roomChatId,
      "users.userId": userId
    });
    if(room){
      next();
    } else{
      res.redirect("/");
    }
  } catch(e){
    console.log(e);
    res.redirect("/");
  }

}