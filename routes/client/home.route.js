const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/users.controller");

router.get("/", controller.friends);

module.exports = router;