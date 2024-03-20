"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waitlist_service_1 = __importDefault(require("./waitlist.service"));
const waitlistService = new waitlist_service_1.default();
class WaitlistController {
    async getWaiterByEmail(req, res) {
        try {
            const { email } = req.body;
            const waiter = await waitlistService.getWaiterByEmail(email);
            res.status(200).json(waiter);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getWaiterById(req, res) {
        try {
            const { id } = req.params;
            const waiter = await waitlistService.getWaiterById(Number(id));
            res.status(200).json(waiter);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createWaiter(req, res) {
        try {
            const { email, name } = req.body;
            const newWaiter = await waitlistService.createWaiter(email, name);
            res.status(201).json(newWaiter);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = WaitlistController;
