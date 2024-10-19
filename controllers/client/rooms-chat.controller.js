const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  try{
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
            }).select("fullName avatar");
            if(infoB){
              room.title = infoB.fullName;
              room.avatar = infoB.avatar;
            };
          }
        }
      }
    }
  
    res.render("client/pages/rooms-chat/index", {
      pageTitle: "Danh sách phòng",
      listRoomChat: listRoomChat
    });
  } catch(e){
    console.log(e);
    res.redirect("back");
  }
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  try{
    const friendsList = res.locals.user.friendsList;

    for(friend of friendsList) {
      const infoFriend = await User.findOne({
        _id: friend.userId
      }).select("fullName");
      
      if(infoFriend){
        friend.fullName = infoFriend.fullName;
      }
    }
  
    res.render("client/pages/rooms-chat/create", {
      pageTitle: "Tạo phòng",
      friendsList: friendsList
    });
  } catch(e){
    res.redirect("back");
  }

};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  try{
    const title = req.body.title;
    const usersId = req.body.usersId;
    const avatar = req.body.avatar;
  
    const dataRoomChat = {
      title: title,
      avatar: avatar,
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
  } catch(e){
    console.log(e);
    req.flash("error", "Lỗi tạo phòng chat!")
    res.redirect("back");
  }
};

// [GET] /rooms-chat/edit/:id
module.exports.edit = async (req, res) => {
  try{
    const userId = res.locals.user.id;
    const roomChat = await RoomChat.findOne({
      _id: req.params.id
    })

    if(roomChat.typeRoom === "friend"){
      for(const user of roomChat.users){
        if(user.userId !== userId){
          const  infoB = await User.findOne({
            _id: user.userId
          }).select("fullName avatar");
          if(infoB){
            roomChat.title = infoB.fullName;
            roomChat.avatar = infoB.avatar;
          };
        }
      }
    }


    const friendsList = res.locals.user.friendsList;

    for(friend of friendsList) {
      const infoFriend = await User.findOne({
        _id: friend.userId
      }).select("fullName");
  
      friend.fullName = infoFriend.fullName;
    }
  
    res.render("client/pages/rooms-chat/edit", {
      pageTitle: "Chỉnh sửa phòng chat",
      friendsList: friendsList,
      roomChat: roomChat
    });
  } catch(e){
    console.log(e);
    res.redirect("back");
  }
}

// [PATCH] /rooms-chat/edit/:id
module.exports.editPatch = async (req, res) => {
  try{
    const userId = res.locals.user.id;
    const roomChat = await RoomChat.findOne({
      _id: req.params.id,
      "users.userId": userId
    });
    if(roomChat){
      const user = roomChat.users.find(user => user.userId === userId);
      if(user && user.role === "superAdmin"){
        await RoomChat.updateOne({
          _id: req.params.id
        }, req.body);
      } else{
        req.flash("error", "Bạn không có quyền để chỉnh sửa phòng chat");
      }
      res.redirect("back");
    } else{
      res.redirect("back");
    }
  } catch(e){
    console.log(e);
    res.redirect("back");
  }
}
