"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const AuthRouter = express_1.default.Router();
const authController = new auth_controller_1.default();
AuthRouter.get('/user/:username', authController.getUserByUsername);
AuthRouter.get('/user/id/:id', authController.getUserById);
AuthRouter.post('/register', authController.createUser);
AuthRouter.post('/login', authController.login);
AuthRouter.post('/logout/:id', authController.logout);
AuthRouter.delete('/user/:id', authController.destroyUser);
module.exports = AuthRouter;
