const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // SocketIO
  usersSocket(req, res);
  // End SocketIO

  const userId = res.locals.user.id;

  // $ne: not equal
  // $ni: not in

  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;
  // const friendsList = res.locals.user.friendsList;
  // const friendsListId = friendsList.map(item => item.userId);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      // { _id: { $nin: friendsListId } },
    ],
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend.pug",{
    pageTitle: "Danh sách người dùng",
    users: users
  });
}

// [GET] /users/request
module.exports.request = async (req, res) => {
  // SocketIo
  usersSocket(req, res);
  // EndSocketIo
  
  const requestFriend = res.locals.user.requestFriends;
  const users = await User.find({
    _id:  { $in: requestFriend },
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users
  })
}