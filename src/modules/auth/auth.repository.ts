import { User, RefreshToken, PrismaClient, AccountType } from "@prisma/client";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || 'checkEnv';

const prisma = new PrismaClient();


export default class AuthRepository {

    async createNewUser(user:any): Promise<User> {
        return await prisma.user.create({
            data: {
                account_type: user.account_type,
                username: user.username,
                email: user.email,
                password: user.password
            }
        })
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                username: username
            }
        })
    }

    async getUserById(id: number): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }

    async deleteUser (id: number): Promise<User | null> {
        return await prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    async updatePassword(id: number, password: string): Promise<User | null> {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                password: password
            }
        })
    }

    async updateEmail(id: number, email: string): Promise<User | null> {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                email: email
            }
        })
     }

    async updateEmailConfirmation(id: number): Promise<User | null> {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                email_conf: true
            }
        })
    }

    async updateUser(id: number, user: Partial<User>): Promise<User | null> {
        if (!user.password) {
            return await prisma.user.update({
                where: {
                    id: id
                },
                data: user
            })
        } else {
            throw new Error("Password cannot be updated through this function.");
        }
    }

    async changeAccountType(id: number, accountType: AccountType): Promise<User | null> {
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
    async getUserByIdentifier(identifier: string): Promise<User | null> {
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



    async createNewToken(user_id: number): Promise<RefreshToken | null> {
        try {
          const token = jwt.sign({ user_id }, jwtSecret, { expiresIn: '14d' });
    
          const newToken = await prisma.refreshToken.create({
            data: {
              user_id,
              token,
            },
          });
    
          return newToken;
        } catch (error) {
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
      async checkTokenValidity(token: string): Promise<boolean> {
        try {
          const decoded = jwt.verify(token, jwtSecret);
          return true;
        } catch (error) {
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
      async getTokenByUserId(user_id: number): Promise<RefreshToken | null> {
        try {
          const token = await prisma.refreshToken.findUnique({
            where: {
                user_id,
            },
          });
    
          return token;
        } catch (error) {
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
      async destroyToken(userId: number): Promise<void> {
        try {
          await prisma.refreshToken.delete({
            where: {
              user_id: userId,
            },
          });
        } catch (error) {
          console.error('Error deleting token:', error);
        }
      }
    
      async updateToken(user_id: number): Promise<RefreshToken | null> {
        try {
          const oldToken = await prisma.refreshToken.findUnique({
            where: {
              user_id,
            },
          });
          if (oldToken) {
            this.destroyToken(user_id);
          }
          const newToken = jwt.sign({ user_id }, jwtSecret, { expiresIn: '7d' });
          const token = await prisma.refreshToken.update({
            where: {
              user_id,
            },
            data: {
              token: newToken,
            },
          });
          return token;
        } catch (error) {
          console.error('Error updating token:', error);
          return null;
        }
      }
    
    }