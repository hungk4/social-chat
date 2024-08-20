const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/client/user.controller");

const userMiddleware = require("../../middlewares/client/user.middleware");

const upload = multer();
const uploadCloud = require("../../middlewares/client/uploadCloud.middleware");

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/profile", userMiddleware.requireAuth, controller.profile);

router.patch(
  "/profile/edit/:id", 
  userMiddleware.requireAuth,
  upload.single('avatar'),
  uploadCloud.uploadSingle, 
  controller.profileEdit
);

module.exports = router;