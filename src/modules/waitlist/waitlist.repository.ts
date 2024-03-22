import { Waiter, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class WaitlistRepository {
    async addWaiter(waiter:any): Promise<Waiter> {
        return await prisma.waiter.create({
            data: {
                email: waiter.email,
                name: waiter.name
            }
        })
    }

    async getWaiterByEmail(email: string): Promise<Waiter | null> {
        return await prisma.waiter.findUnique({
            where: {
                email: email
            }
        })
    }

    async getWaiterById(id: number): Promise<Waiter | null> {
        return await prisma.waiter.findUnique({
            where: {
                id: id
            }
        })
    }

    async getWaitlist(): Promise<Waiter[] | null> {
        return await prisma.waiter.findMany();
    }
}