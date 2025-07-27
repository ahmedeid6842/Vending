import express from 'express';
import {
    registerController,
    loginController,
    logoutController,
    getUserController,
    updateUserController,
    deleteUserController
} from '../controller/user';
import { isAuthenticated } from "../middleware/isAuthenticated";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

router.post('/register', isLoggedIn, registerController);
router.post('/login', isLoggedIn, loginController);
router.get("/logout", logoutController);
router.get("/", isAuthenticated, getUserController);
router.put("/", isAuthenticated, updateUserController);
router.delete("/", isAuthenticated, deleteUserController);


export const User = router;