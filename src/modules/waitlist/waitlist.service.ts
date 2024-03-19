import logger from "../../utils/logging/logger";
import WaitlistRepository from "./waitlist.repository";

const waitlistRepo = new WaitlistRepository();

export default class WaitlistService {
    async getWaiterByEmail(email: string): Promise<any> {
        try {
            const waiter = await waitlistRepo.getWaiterByEmail(email);
            return waiter
        } catch (error:any) {
            logger.error(error.message, {module: "WaitlistService", function: "getWaiterByEmail", error: error});
            throw error
        }
    }

    async getWaiterById(id: number): Promise<any> {
        try {
            const waiter = await waitlistRepo.getWaiterById(id);
            return waiter
        } catch (error:any) {
            logger.error(error.message, {module: "waitlistService", function: "getWaiterById", error: error});
            throw error
        }
    }

    async createWaiter(email: string, name: string): Promise<any> {
        try {
            const alreadyWaiting = await waitlistRepo.getWaiterByEmail(email);
            if (alreadyWaiting) {
                throw new Error("User already waiting to Begg");
            }
            const waiter = await waitlistRepo.addWaiter({ email, name });
            logger.info("Waiter added successfully", {module: "WaitlistService", function: "createWaiter", data: waiter.id});
            return { waiter };
        } catch (error:any) {
            logger.error(error.message, {module: "WaitlistService", function: "createWaiter", error: error});
            throw error
        }
    }
}