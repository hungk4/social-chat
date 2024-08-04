const chatRoute = require("./chat.route");

module.exports.index = (app) => {
  app.use("/chat", chatRoute);
}