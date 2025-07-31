import express from 'express';
import {
  registerController,
  loginController,
  logoutController,
  getUserController,
  updateUserController,
  deleteUserController,
} from '../controller/user';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { isLoggedIn } from '../middleware/isLoggedIn';
import { validate } from '../middleware/validate';
import { UserValidators } from '../validators/user';

const router = express.Router();

router.post(
  '/register',
  isLoggedIn,
  validate(UserValidators.createUserBody, 'body'),
  registerController
);
router.post(
  '/login',
  isLoggedIn,
  validate(UserValidators.loginBody, 'body'),
  loginController
);
router.get('/logout', logoutController);
router.get('/', isAuthenticated, getUserController);
router.put(
  '/',
  isAuthenticated,
  validate(UserValidators.updateUserBody, 'body'),
  updateUserController
);
router.delete('/', isAuthenticated, deleteUserController);

export const User = router;
