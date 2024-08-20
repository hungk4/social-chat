const User = require("../../models/user.model");

module.exports = (req, res) => {
  const userIdA = res.locals.user.id;

  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
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

    })
    // End Khi A gửi yêu cầu cho B


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
    // Hết Chức năng chấp nhận kết bạn
  });
}