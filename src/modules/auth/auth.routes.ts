import express from 'express';
import AuthController from './auth.controller';

const AuthRouter = express.Router();
const authController = new AuthController();

AuthRouter.get('/user/:username', authController.getUserByUsername);
AuthRouter.get('/user/id/:id', authController.getUserById);
AuthRouter.post('/register', authController.createUser);
AuthRouter.post('/login', authController.login);
AuthRouter.post('/logout/:id', authController.logout);
AuthRouter.delete('/user/:id', authController.destroyUser);

export default AuthRouter;