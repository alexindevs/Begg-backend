import { Request, Response, NextFunction } from "express";
import AccessTokenGenerator from "../modules/auth/token.service";
import AuthRepository from "../modules/auth/auth.repository";
import jwt from "jsonwebtoken";
import { IPublicUser } from "../modules/auth/auth.interface";

const jwtSecret = process.env.JWT_SECRET || "ENV access problem";
const ATG = new AccessTokenGenerator();
const authRepo = new AuthRepository()

interface IRequest extends Request {
    user?: IPublicUser
}

export const protectRoute = async (req: IRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const authToken = req.headers.authorization?.split(" ")[1];
        if (!authToken) {
            throw new Error("UNAUTHORIZED: Missing Token")
        } else {
            const decodedToken = jwt.decode(authToken) as { exp: number; user: { id: number } };
      const expDate = decodedToken?.exp;
      const userId = decodedToken?.user.id;
  
      if (!expDate) {
        return res.status(401).json({ error: 'INVALID_TOKEN_EXPIRATION' });
      }
  
        if (expDate < Math.floor(Date.now() / 1000)) {
          const refreshToken = await authRepo.getTokenByUserId(userId);
  
          if (refreshToken) {
            const tokenIsValid = await authRepo.checkTokenValidity(refreshToken.token);
  
            if (tokenIsValid) {
              const accessToken = await ATG.generate(userId);
                if (!accessToken || !accessToken?.user) {
                  return res.status(401).json({ error: 'ACCESS_TOKEN_NOT_GENERATED_PROPERLY' });
                }
                req.user = accessToken?.user;
                res.setHeader('Authorization', `Bearer ${accessToken?.accessToken}`);
                return next();
              } else {
                return res.status(404).json({ error: 'USER_NOT_FOUND' });
              }
          } else {
              return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
           }
        } else {
           return next();
        }
      }
    } catch (error: any) {
        res.status(403).json({
            success: false,
            error: {
                message: error.message,
                code: "Unauthorized"
            }
        })   
    }
}