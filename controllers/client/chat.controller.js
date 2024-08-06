// [GET] /chat
module.exports.index = async (req, res) => {
  // SocketIo
  _io.on("connection", (socket) => {
    console.log("Có 1 người dùng kết nối", socket.id);
  });
  // End SocketIo
  
  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat"
  })
}