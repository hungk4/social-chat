const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/chat.controller");

// Route cho trang chat
router.get("/", controller.index)
module.exports = router;