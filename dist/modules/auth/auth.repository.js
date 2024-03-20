"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET || 'checkEnv';
const prisma = new client_1.PrismaClient();
class AuthRepository {
    async createNewUser(user) {
        return await prisma.user.create({
            data: {
                account_type: user.account_type,
                username: user.username,
                email: user.email,
                password: user.password
            }
        });
    }
    async getUserByUsername(username) {
        return await prisma.user.findUnique({
            where: {
                username: username
            }
        });
    }
    async getUserById(id) {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }
    async deleteUser(id) {
        return await prisma.user.delete({
            where: {
                id: id
            }
        });
    }
    async updatePassword(id, password) {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                password: password
            }
        });
    }
    async updateEmail(id, email) {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                email: email
            }
        });
    }
    async updateEmailConfirmation(id) {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                email_conf: true
            }
        });
    }
    async updateUser(id, user) {
        if (!user.password) {
            return await prisma.user.update({
                where: {
                    id: id
                },
                data: user
            });
        }
        else {
            throw new Error("Password cannot be updated through this function.");
        }
    }
    async changeAccountType(id, accountType) {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                account_type: accountType
            }
        });
    }
    /**
     * Retrieves a user by email or username identifier.
     *
     * @param {string} identifier - the email or username identifier
     * @return {Promise<User | null>} the user object if found, otherwise null
     */
    async getUserByIdentifier(identifier) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });
        return user || null;
    }
    async createNewToken(user_id) {
        try {
            const token = jsonwebtoken_1.default.sign({ user_id }, jwtSecret, { expiresIn: '14d' });
            const newToken = await prisma.refreshToken.create({
                data: {
                    user_id,
                    token,
                },
            });
            return newToken;
        }
        catch (error) {
            console.error('Error creating token:', error);
            return null;
        }
    }
    /**
     * Checks the validity of the refresh token.
     *
     * @param {string} token - The refresh token.
     * @return {Promise<boolean>} - True if the token is valid, false otherwise.
     */
    async checkTokenValidity(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            return true;
        }
        catch (error) {
            console.error('Error checking token expiry:', error);
            return false;
        }
    }
    /**
     * Gets the refresh token for a user.
     *
     * @param {number} user_id - The ID of the user.
     * @return {Promise<Prisma.RefreshToken | null>} - The refresh token or null if not found.
     */
    async getTokenByUserId(user_id) {
        try {
            const token = await prisma.refreshToken.findUnique({
                where: {
                    user_id,
                },
            });
            return token;
        }
        catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    }
    /**
     * Destroys (deletes) a refresh token.
     *
     * @param {number} tokenId - The ID of the refresh token to destroy.
     * @return {Promise<void>} - A Promise that resolves when the token is destroyed.
     */
    async destroyToken(userId) {
        try {
            await prisma.refreshToken.delete({
                where: {
                    user_id: userId,
                },
            });
        }
        catch (error) {
            console.error('Error deleting token:', error);
        }
    }
    async updateToken(user_id) {
        try {
            const oldToken = await prisma.refreshToken.findUnique({
                where: {
                    user_id,
                },
            });
            if (oldToken) {
                this.destroyToken(user_id);
            }
            const newToken = jsonwebtoken_1.default.sign({ user_id }, jwtSecret, { expiresIn: '7d' });
            const token = await prisma.refreshToken.update({
                where: {
                    user_id,
                },
                data: {
                    token: newToken,
                },
            });
            return token;
        }
        catch (error) {
            console.error('Error updating token:', error);
            return null;
        }
    }
}
exports.default = AuthRepository;
