"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const authService = new auth_service_1.default();
class AuthController {
    async getUserByUsername(req, res) {
        try {
            const { username } = req.params;
            const user = await authService.getUserByUsername(username);
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await authService.getUserById(Number(id));
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createUser(req, res) {
        try {
            const { username, email, password, account_type } = req.body;
            const newUser = await authService.createUser(username, email, password, account_type);
            res.status(201).json(newUser);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const { identifier, password } = req.body;
            const loggedInUser = await authService.login(identifier, password);
            res.status(200).json(loggedInUser);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async logout(req, res) {
        try {
            const { id } = req.params;
            const token = await authService.logout(Number(id));
            res.status(200).json({ message: 'User logged out successfully', token });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async destroyUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await authService.destroyUser(Number(id));
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = AuthController;
