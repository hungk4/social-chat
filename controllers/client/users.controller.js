const User = require("../../models/user.model");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.userId;

  // $ne: not equal

  const users = await User.find({
    _id: { $ne: userId},
    status: "active",
    deleted: false
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend.pug",{
    pageTitle: "Danh sách người dùng",
    users: users
  });
}