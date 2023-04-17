const express = require('express');
const {
    registerController,
    loginController,
    logoutController,
    getUserController,
    updateUserController,
    deleteUserController
} = require('../controller/user');
const { isAuthenticated } = require("../middleware/isAuthenticated")
const { isLoggedIn } = require("../middleware/isLoggedIn");

const router = express.Router();

router.post('/register', isLoggedIn, registerController);
router.post('/login', isLoggedIn, loginController);
router.get("/logout", logoutController);
router.get("/", isAuthenticated, getUserController);
router.put("/", isAuthenticated, updateUserController);
router.delete("/", isAuthenticated, deleteUserController);


module.exports.User = router;