const express = require("express");
const app = express();
const path = require("path"); // Thư viện xử lý đường dẫn 

require('dotenv').config(); // Nạp biến môi trường từ .env

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
app.listen(port);