const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//user db
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/follow/:id", userController.follow);
router.put("/unfollow/:id", userController.unfollow);


//upload
router.post('/upload', upload.single('file'), uploadController.handleSingleUploadFile)

// router.patch("/unfolow/:id", userController.unfollow);
module.exports = router;
