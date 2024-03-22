import logger from "../../utils/logging/logger";
import AuthRepository from "./auth.repository";
import bcrypt from "bcrypt"
import AccessTokenGenerator from "./token.service";
import jwt from "jsonwebtoken";

const authRepo = new AuthRepository();
const ATG = new AccessTokenGenerator();

export default class AuthService {

    async getUserByUsername(username: string): Promise<any> {
        try {
            const user = await authRepo.getUserByUsername(username);
            return user
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "getUserByUsername", error: error});
            throw error
        }
    }

    async getUserById(id: number): Promise<any> {
        try {
            const user = await authRepo.getUserById(id);
            return user
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "getUserById", error: error});
            throw error
        }
    }

    async updatePassword(id: number, password: string): Promise<any> {
        try {
            const user = await authRepo.updatePassword(id, password);
            return user
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "updatePassword", error: error});
            throw error
        }
    }

    async updateEmail(id: number, email: string): Promise<any> {
        try {
            const user = await authRepo.updateEmail(id, email);
            return user
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "updateEmail", error: error});
            throw error
        }
    }

    async createUser(username: string, email: string, password: string, account_type: string = "Individual"): Promise<any> {
        try {

            const userExists = await authRepo.getUserByIdentifier(username) || await authRepo.getUserByIdentifier(email);
            if (userExists) {
                throw new Error("User already exists");
            }
            password = await bcrypt.hash(password, 10)
            const user = await authRepo.createNewUser({username, email, password, account_type});
            const accessToken = await ATG.generate(user.id);
            await authRepo.createNewToken(user.id)
            logger.info("User created successfully", {module: "AuthService", function: "createUser", data: user.id});
            console.trace(accessToken)
            return {user, token: accessToken};
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "createUser", error: error});
            throw error
        }
    }

    async login(identifier: string, password: string): Promise<any> {
        try {
            const user = await authRepo.getUserByIdentifier(identifier);
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Incorrect password");
            }
            const accessToken = await ATG.generate(user.id);
            await authRepo.updateToken(user.id)
            logger.info("User logged in successfully", {module: "AuthService", function: "login", data: user.id});
            return {user, token: accessToken};
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "login", error: error});
            throw error
        }
    }

    async logout(id: number): Promise<any> {
        try {
            const token = await authRepo.destroyToken(id);
            return token
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "logout", error: error});
            throw error
        }
    }

    async destroyUser(id: number): Promise<any> {
        try {
            const user = await authRepo.deleteUser(id);
            return user
        } catch (error:any) {
            logger.error(error.message, {module: "AuthService", function: "destroyUser", error: error});
            throw error
        }
    }
}