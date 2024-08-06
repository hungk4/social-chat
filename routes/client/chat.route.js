const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/chat.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");

// Route cho trang chat
router.use(userMiddleware.requireAuth);

router.get("/", controller.index);

module.exports = router;