const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
module.exports = (req, res) => {
  const userIdA = res.locals.user.id;

  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu kết bạn cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      // Thêm id của A vào acceptFriends của B
      const existUserAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      });

      if(!existUserAInB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $push: {
            acceptFriends: userIdA
          }
        });
      }

      // Thêm id của B vào requestFriends của A 
      const existUserBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      });

      if(!existUserBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $push: {
            requestFriends: userIdB
          }
        });
      }

      // Trả về cho B độ dài của acceptFriends
      const infoB = await User.findOne({
        _id: userIdB
      });

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        length: infoB.acceptFriends.length,
        userId: userIdB
      });

      // Láy thông tin của A để trả về cho B
      const infoA = await User.findOne({
        _id: userIdA
      }).select("id fullName avatar");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userIdB: userIdB,
        infoA: infoA
      })

      // Lấy id của A để trả về cho B
      socket.broadcast.emit("SERVER_RETURN_ID_ACCEPT_FRIEND", {
        userIdA: userIdA,
        userIdB: userIdB
      })
    })
    // End Khi A gửi yêu cầu kết bạn cho B


    // Chức năng hủy gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
      // Xóa id của A khỏi acceptFriends của B;
      const existUserAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      })

      if(existUserAInB){
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: {
            acceptFriends: userIdA
          }
        });
      }

      // Xóa id của B khỏi requestFriends của A 
      const existUserBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      });

      if(existUserBInA){
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: {
            requestFriends: userIdB
          }
        });
      }

      // Trả về cho B độ dài của acceptFriends
      const infoB = await User.findOne({
        _id: userIdB
      });
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        length: infoB.acceptFriends.length,
        userId: userIdB
      });

      // Trả về cho B id của A
      socket.broadcast.emit("SERVER_RETURN_ID_CANCEL_FRIEND", {
        userIdA: userIdA,
        userIdB: userIdB
      });
      
    })
    // Hết Chức năng hủy gửi yêu cầu

    // Chức năng từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
      // Xóa id của B khỏi acceptFriends của A;
      const existUserBInA = await User.find({
        _id: userIdA,
        acceptFriends: userIdB
      });
      if(existUserBInA){
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: {
            acceptFriends: userIdB
          }
        })
      }

      // Xóa id của A khỏi requestFriends của B
      const existUserAInB = await User.find({
        _id: userIdB,
        requestFriends: userIdA
      });
      if(existUserAInB){
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: {
            requestFriends: userIdA
          }
        })
      }

    
    })
    // Hết Chức năng từ chối kết bạn

    // Chức năng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
      try{ 
        // Tạo phòng chat chung
        const roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              userId: userIdA,
              role: "superAdmin"
            },
            {
              userId: userIdB,
              role: "superAdmin"
            }
          ],
        });
        await roomChat.save();

        // Thêm {userId, roomChatId} của B vào friendsList của A
        // Xóa id của B trong acceptFriends của A
        const existUserBInA = await User.findOne({
          _id: userIdA,
          acceptFriends: userIdB
        });

        if(existUserBInA) {
          await User.updateOne({
            _id: userIdA
          }, {
            $push: {
              friendsList: {
                userId: userIdB,
                roomChatId: roomChat.id
              }
            },
            $pull: {
              acceptFriends: userIdB
            }
          });
        }

        
        // Thêm {userId, roomChatId} của A vào friendsList của B
        // Xóa id của A trong requestFriends của B
        const existUserAInB = await User.findOne({
          _id: userIdB,
          requestFriends: userIdA
        });

        if(existUserAInB) {
          await User.updateOne({
            _id: userIdB
          }, {
            $push: {
              friendsList: {
                userId: userIdA,
                roomChatId: roomChat.id
              }
            },
            $pull: {
              requestFriends: userIdA
            }
          });
        }
      } catch(e){
        console.log(e);
      }
    })
      
    // Hết Chức năng chấp nhận kết bạn

    // Chức năng hủy kết bạn
    socket.on("CLIENT_UN_FRIEND", async (userIdB) => {
      // Xóa B ra khỏi friendList của A
      const existUserBInA = await User.findOne({
        _id: userIdA,
        "friendsList.userId": userIdB
      });

      if(existUserBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: {
            friendsList: {
              userId: userIdB
            }
          }
        });
      }

      // Xóa A ra khỏi friendList của B
      const existUserAInB = await User.findOne({
        _id: userIdB,
        "friendsList.userId": userIdA
      });

      if(existUserAInB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: {
            friendsList: {
              userId: userIdA
            }
          }
        });
      }

      // Xóa roomChat
      await RoomChat.deleteOne({
        "users.userId": { $all: [userIdA, userIdB]},
        typeRoom: "friend"
      })


    })
    // Hết Chức năng hủy kết bạn
  
  });
}