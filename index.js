const express = require("express");
const app = express();
const methodOverride = require('method-override');
require('dotenv').config(); // Nạp biến môi trường từ .env
const path = require("path"); // Thư viện xử lý đường dẫn ;
const http = require('http');
const { Server } = require("socket.io");


// Flash
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash())
// End Flash

// Kết nối database
const database = require("./config/database");
database.connect();
// End kết nối database

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End SocketIO

// Cấu hình Pug làm engine template
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// Middleware 
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// Middleware để phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(`${__dirname}/public`));

// Route
const clientRoutes =  require("./routes/client/index.route");
clientRoutes.index(app);

// Trang 404
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
      pageTitle: "404 Not Found"
  });
});

// Khởi động server
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
