import express from 'express';
import WaitlistController from './waitlist.controller';

const waitlistRouter = express.Router();
const waitlistController = new WaitlistController();

waitlistRouter.get('/waiter', waitlistController.getWaiterByEmail);
waitlistRouter.post('/wait', waitlistController.createWaiter);