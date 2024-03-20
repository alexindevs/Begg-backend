"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logging/logger"));
const auth_repository_1 = __importDefault(require("./auth.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_service_1 = __importDefault(require("./token.service"));
const authRepo = new auth_repository_1.default();
const ATG = new token_service_1.default();
class AuthService {
    async getUserByUsername(username) {
        try {
            const user = await authRepo.getUserByUsername(username);
            return user;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "getUserByUsername", error: error });
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const user = await authRepo.getUserById(id);
            return user;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "getUserById", error: error });
            throw error;
        }
    }
    async updatePassword(id, password) {
        try {
            const user = await authRepo.updatePassword(id, password);
            return user;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "updatePassword", error: error });
            throw error;
        }
    }
    async updateEmail(id, email) {
        try {
            const user = await authRepo.updateEmail(id, email);
            return user;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "updateEmail", error: error });
            throw error;
        }
    }
    async createUser(username, email, password, account_type = "Individual") {
        try {
            const userExists = await authRepo.getUserByIdentifier(username) || await authRepo.getUserByIdentifier(email);
            if (userExists) {
                throw new Error("User already exists");
            }
            password = await bcrypt_1.default.hash(password, 10);
            const user = await authRepo.createNewUser({ username, email, password, account_type });
            const accessToken = ATG.generate(user.id);
            await authRepo.createNewToken(user.id);
            logger_1.default.info("User created successfully", { module: "AuthService", function: "createUser", data: user.id });
            return { user, token: accessToken };
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "createUser", error: error });
            throw error;
        }
    }
    async login(identifier, password) {
        try {
            const user = await authRepo.getUserByIdentifier(identifier);
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Incorrect password");
            }
            const accessToken = ATG.generate(user.id);
            await authRepo.updateToken(user.id);
            logger_1.default.info("User logged in successfully", { module: "AuthService", function: "login", data: user.id });
            return { user, token: accessToken };
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "login", error: error });
            throw error;
        }
    }
    async logout(id) {
        try {
            const token = await authRepo.destroyToken(id);
            return token;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "logout", error: error });
            throw error;
        }
    }
    async destroyUser(id) {
        try {
            const user = await authRepo.deleteUser(id);
            return user;
        }
        catch (error) {
            logger_1.default.error(error.message, { module: "AuthService", function: "destroyUser", error: error });
            throw error;
        }
    }
}
exports.default = AuthService;
