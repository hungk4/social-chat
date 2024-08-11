const chatRoute = require("./chat.route");
const userRoute = require("./user.route");
const usersRoute = require("./users.route");

const userMiddleware = require("../../middlewares/client/user.middleware");


module.exports.index = (app) => {
  app.use(userMiddleware.infoUser);

  app.use("/chat", chatRoute);
  app.use("/user", userRoute);
  app.use("/users", userMiddleware.requireAuth,usersRoute);
}
