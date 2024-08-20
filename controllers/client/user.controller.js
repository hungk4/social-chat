const md5 = require("md5");
const User = require("../../models/user.model");
const generateHelper = require("../../helpers/generate.helper");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const exitstUser = await User.findOne({
    email: req.body.email,
    deleted: false
  });
  
  if(exitstUser){
    req.flash("error", "Email đã tồn tại");
    res.redirect("back");
    return
  }

  const userData = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    tokenUser: generateHelper.generateRandomString(30)
  };

  const user = new User(userData);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng kí tài khoản thành công");
  res.redirect("/chat");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const tokenUser = md5(password);

  const exitstUser = await User.findOne({
    email: email,
    deleted: false
  });
  
  if(!exitstUser){
    req.flash("error", "Không tồn tại email!");
    res.redirect("back");
    return;
  }

  if(exitstUser.password != md5(password)) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if(exitstUser.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }

  const expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // / Cookie expires in 30 days;
  res.cookie("tokenUser", exitstUser.tokenUser, {expires: expiresIn});

  req.flash("success", "Đăng nhập thành công!");
  res.redirect("/chat");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
};

// [GET] /user/profile
module.exports.profile = async (req, res) => {
  res.render("client/pages/user/profile.pug", {
    pageTitle: "Thông tin cá nhân"
  })
}

// [PATCH] /user/profile/edit/:id
module.exports.profileEdit = async (req, res) => {
  const id = req.params.id;

  await User.updateOne({
    _id: id,
    deleted: false
  }, req.body);

  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
}
