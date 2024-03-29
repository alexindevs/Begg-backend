import express from 'express';
import WaitlistController from './waitlist.controller';

const WaitlistRouter = express.Router();
const waitlistController = new WaitlistController();

WaitlistRouter.get('/', waitlistController.getWaitlist);
WaitlistRouter.get('/waiter', waitlistController.getWaiterByEmail);
WaitlistRouter.post('/wait', waitlistController.createWaiter);

module.exports = WaitlistRouter;