"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class WaitlistRepository {
    async addWaiter(waiter) {
        return await prisma.waiter.create({
            data: {
                email: waiter.email,
                name: waiter.name
            }
        });
    }
    async getWaiterByEmail(email) {
        return await prisma.waiter.findUnique({
            where: {
                email: email
            }
        });
    }
    async getWaiterById(id) {
        return await prisma.waiter.findUnique({
            where: {
                id: id
            }
        });
    }
}
exports.default = WaitlistRepository;
