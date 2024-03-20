"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const waitlist_controller_1 = __importDefault(require("./waitlist.controller"));
const WaitlistRouter = express_1.default.Router();
const waitlistController = new waitlist_controller_1.default();
WaitlistRouter.get('/waiter', waitlistController.getWaiterByEmail);
WaitlistRouter.post('/wait', waitlistController.createWaiter);
module.exports = WaitlistRouter;
