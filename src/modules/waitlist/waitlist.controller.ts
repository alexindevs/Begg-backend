import { Request, Response } from 'express';
import WaitlistService from './waitlist.service';

const waitlistService = new WaitlistService();

export default class WaitlistController {
    async getWaiterByEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const waiter = await waitlistService.getWaiterByEmail(email);
            res.status(200).json(waiter);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getWaiterById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const waiter = await waitlistService.getWaiterById(Number(id));
            res.status(200).json(waiter);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createWaiter(req: Request, res: Response) {
        try {
            const { email, name } = req.body;
            const newWaiter = await waitlistService.createWaiter(email, name);
            res.status(201).json(newWaiter);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getWaitlist(req: Request, res: Response) {
        try {
            const waitlist = await waitlistService.getWaitlist();
            res.status(201).json(waitlist);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}