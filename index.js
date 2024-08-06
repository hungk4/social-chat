const express = require("express");
const app = express();
require('dotenv').config(); // Nạp biến môi trường từ .env
const path = require("path"); // Thư viện xử lý đường dẫn ;
const http = require('http');
const { Server } = require("socket.io");


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

// Middleware để phục vụ các file tĩnh từ thư mục 'public'
app.use(express.static(`${__dirname}/public`));

// Route
const clientRoutes =  require("./routes/client/index.route");
clientRoutes.index(app);


// Khởi động server
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});