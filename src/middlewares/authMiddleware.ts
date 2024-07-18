import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { TokenGenerator } from "../auth/TokenGenerator";
import { userLogPath } from "../config/logPaths";
import { Logger } from "../loggers/Logger";
import { UserDomain } from "../domain/UserDomain";

const prisma = new PrismaClient();
const tokenGenerator = new TokenGenerator();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const logger = new Logger("authMiddleware", userLogPath);
  const accessToken = req.headers['authorization']?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'] as string;

  console.log(accessToken);
  if (!accessToken || !refreshToken) {
    logger.error("Access Token or Refresh Token missing");
    return res.status(401).json({ message: 'Token de acesso e/ou token de atualização ausente(s)' });
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    
    const now = Math.floor(Date.now() / 1000); 
    const expirationThreshold = 60 * 15;

    if (decodedAccessToken.exp && decodedAccessToken.exp - now < expirationThreshold) {
      const user = await prisma.user.findUnique({
        where: { userId: decodedAccessToken.userId },
        include: { login: true } 
      });

      console.log("User no Auth: ");
      console.log(user);


      if (user) {
        const { token: newAccessToken, expiresAt: newAccessTokenExpiration } = tokenGenerator.generateAccessToken(new UserDomain({
            userId: user.userId,
            userName: user.userName,
            userEmail: user.userEmail,
          }));

        await prisma.login.update({
          where: { userId: user.userId },
          data: {
            accessToken: newAccessToken,
            accessTokenExpiration: newAccessTokenExpiration,
          },
        });

        res.setHeader('x-access-token', newAccessToken);
      }
      next();
    }
    return res.status(201)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as jwt.JwtPayload;

        const user = await prisma.user.findUnique({
          where: { userId: decodedRefreshToken.userId },
          include: { login: true }
        });

        if (user && decodedRefreshToken.userId === decodedRefreshToken.userId) {
          const { token: newAccessToken, expiresAt: newAccessTokenExpiration } = tokenGenerator.generateAccessToken(new UserDomain({
            userId: user.userId,
            userName: user.userName,
            userEmail: user.userEmail,
          }));

          const { token: newRefreshToken, expiresAt: newRefreshTokenExpiration } = tokenGenerator.generateRefreshToken(new UserDomain({
            userId: user.userId,
            userName: user.userName,
            userEmail: user.userEmail,
          }));

          await prisma.login.update({
            where: { userId: user.userId },
            data: {
              accessToken: newAccessToken,
              accessTokenExpiration: newAccessTokenExpiration,
              refreshToken: newRefreshToken,
              refreshTokenExpiration: newRefreshTokenExpiration,
            },
          });

          res.setHeader('x-access-token', newAccessToken);
          res.setHeader('x-refresh-token', newRefreshToken);

          return next();
        } else {
          logger.error("Invalid refresh token");
          return res.status(401).json({ message: 'Token de atualização inválido' });
        }
      } catch (refreshError) {
        logger.error("Refresh Token error", refreshError);
        return res.status(401).json({ message: 'Token de atualização inválido' });
      }
    } else {
      logger.error("Access Token error", error);
      return res.status(401).json({ message: 'Token de acesso inválido' });
    }
  }
};
