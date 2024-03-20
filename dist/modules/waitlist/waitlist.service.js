"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logging/logger"));
const waitlist_repository_1 = __importDefault(require("./waitlist.repository"));
const waitlistRepo = new waitlist_repository_1.default();
class WaitlistService {
    async getWaiterByEmail(email) {
        try {
            const waiter = await waitlistRepo.getWaiterByEmail(email);
            return waiter;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "WaitlistService", function: "getWaiterByEmail", error: error });
            throw error;
        }
    }
    async getWaiterById(id) {
        try {
            const waiter = await waitlistRepo.getWaiterById(id);
            return waiter;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "waitlistService", function: "getWaiterById", error: error });
            throw error;
        }
    }
    async createWaiter(email, name) {
        try {
            const alreadyWaiting = await waitlistRepo.getWaiterByEmail(email);
            if (alreadyWaiting) {
                throw new Error("User already waiting to Begg");
            }
            const waiter = await waitlistRepo.addWaiter({ email, name });
            logger_1.default.info("Waiter added successfully", { module: "WaitlistService", function: "createWaiter", data: waiter.id });
            return { waiter };
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "WaitlistService", function: "createWaiter", error: error });
            throw error;
        }
    }
}
exports.default = WaitlistService;
