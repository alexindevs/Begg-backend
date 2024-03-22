import { Request, Response } from 'express';
import AuthService from './auth.service';

const authService = new AuthService();

export default class AuthController {
    async getUserByUsername(req: Request, res: Response) {
        try {
            const { username } = req.params;
            const user = await authService.getUserByUsername(username);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await authService.getUserById(Number(id));
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const { username, email, password, account_type } = req.body;
            const newUser = await authService.createUser(username, email, password, account_type);
            res.status(201).json({data: newUser});
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { identifier, password } = req.body;
            const loggedInUser = await authService.login(identifier, password);
            res.status(200).json(loggedInUser);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const token = await authService.logout(Number(id));
            res.status(200).json({ message: 'User logged out successfully', token });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async destroyUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedUser = await authService.destroyUser(Number(id));
            res.status(200).json({ message: 'User deleted successfully', deletedUser });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
