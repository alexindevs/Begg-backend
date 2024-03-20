"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = __importDefault(require("./auth.repository"));
const prisma = new client_1.PrismaClient();
class AccessTokenGenerator {
    constructor() {
        this.secret = process.env.JWT_SECRET || 'coommma';
        this.expiresIn = '1h';
        this.expiresInVerif = '15m';
        this.userModel = new auth_repository_1.default();
    }
    async generate(userId) {
        try {
            const user = await this.userModel.getUserById(userId);
            if (user) {
                const { password, ...userWithoutPassword } = user;
                const accessToken = jsonwebtoken_1.default.sign({ user: userWithoutPassword }, this.secret, {
                    expiresIn: this.expiresIn,
                });
                return { accessToken, user: userWithoutPassword };
            }
            return null;
        }
        catch (error) {
            console.log('error:', error);
            return null;
        }
    }
    async generateForVerification(userId) {
        try {
            const user = await this.userModel.getUserById(userId);
            console.log('user:', user);
            if (user) {
                const { password, ...userWithoutPassword } = user;
                const accessToken = jsonwebtoken_1.default.sign({ user: userWithoutPassword }, this.secret, {
                    expiresIn: this.expiresInVerif,
                });
                console.log('accessToken:', accessToken);
                return accessToken;
            }
            return null;
        }
        catch (error) {
            console.log('error:', error);
            return null;
        }
    }
    async checkTokenValidity(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch (error) {
            console.error('Error checking token expiry:', error);
            return false;
        }
    }
}
exports.default = AccessTokenGenerator;
