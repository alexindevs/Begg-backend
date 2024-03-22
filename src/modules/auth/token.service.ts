import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AuthRepository from './auth.repository';
import { IUser, IPublicUser } from './auth.interface';

const prisma = new PrismaClient();

class AccessTokenGenerator {
  private readonly secret: string = process.env.JWT_SECRET || 'coommma';
  private readonly expiresIn: string = '1h';
  private readonly expiresInVerif: string = '15m';
  private userModel: AuthRepository;

  constructor() {
    this.userModel = new AuthRepository();
  }

  public async generate(userId: number): Promise< string | null> {
    try {
      const user = await this.userModel.getUserById(userId);

      if (user) {
        const { password, ...userWithoutPassword } = user;

        const accessToken = jwt.sign({ user: userWithoutPassword }, this.secret, {
          expiresIn: this.expiresIn,
        });
        console.trace(accessToken, userWithoutPassword)

        return accessToken;
      } else {
        return null;
      }
        } catch (error) {
      console.log('error:', error);
      return null;
    }
  }

  async generateForVerification(userId: number): Promise<string | null> {
    try {
      const user = await this.userModel.getUserById(userId);
      console.log('user:', user);

      if (user) {
        const { password, ...userWithoutPassword } = user;

        const accessToken = jwt.sign({ user: userWithoutPassword }, this.secret, {
          expiresIn: this.expiresInVerif,
        });
        console.log('accessToken:', accessToken);

        return accessToken;
      }

      return null;
    } catch (error) {
      console.log('error:', error);
      return null;
    }
  }

   async checkTokenValidity(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.secret) as any;
      return decoded;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  }
}

export default AccessTokenGenerator;