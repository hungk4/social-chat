const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.userId": userId
  });

  for(const room of listRoomChat){
    if(room.typeRoom === "friend"){
      for(const user of room.users){
        if(user.userId !== userId){
          const  infoB = await User.findOne({
            _id: user.userId
          }).select("fullName");
          console.log(infoB);
          if(infoB){
            room.title = infoB.fullName;
          };
        }
      }
    }
  }

  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendsList;

  for(friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.userId
    }).select("fullName");

    friend.fullName = infoFriend.fullName;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng",
    friendsList: friendsList
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataRoomChat = {
    title: title,
    typeRoom: "group",
    users: []
  };

  dataRoomChat.users.push({
    userId: res.locals.user.id,
    role: "superAdmin"
  });

  usersId.forEach(userId => {
    dataRoomChat.users.push({
      userId: userId,
      role: "user"
    });
  })

  const roomChat = new RoomChat(dataRoomChat);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};