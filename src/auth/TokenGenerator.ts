import jwt from "jsonwebtoken";
import { UserDomain } from "../domain/UserDomain";

export class TokenGenerator {
  constructor() {}

  generateAccessToken(user: UserDomain): { token: string, expiresAt: Date } {
    const payload = {
      userId: user.getUserId(),
      userName: user.getUserName(),
      userEmail: user.getUserEmail(),
    };

    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
    });

    const expiresAt = this.getExpirationDate(process.env.JWT_ACCESS_TOKEN_EXPIRES);

    return { token, expiresAt };
  }

  generateRefreshToken(user: UserDomain): { token: string, expiresAt: Date } {
    const payload = {
      userId: user.getUserId(),
      userName: user.getUserName(),
      userEmail: user.getUserEmail(),
    };

    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
    });

    const expiresAt = this.getExpirationDate(process.env.JWT_REFRESH_TOKEN_EXPIRES);

    return { token, expiresAt };
  }

  private getExpirationDate(expiresIn: string | number): Date {
    const now = new Date();
    const expiresInMs = typeof expiresIn === 'string' ? this.parseExpiresIn(expiresIn) : expiresIn * 1000;
    return new Date(now.getTime() + expiresInMs);
  }

  private parseExpiresIn(expiresIn: string): number {
    const timeUnit = expiresIn.slice(-1);
    const timeValue = parseInt(expiresIn.slice(0, -1), 10);

    switch (timeUnit) {
      case 's': return timeValue * 1000; // seconds to milliseconds
      case 'm': return timeValue * 60 * 1000; // minutes to milliseconds
      case 'h': return timeValue * 60 * 60 * 1000; // hours to milliseconds
      case 'd': return timeValue * 24 * 60 * 60 * 1000; // days to milliseconds
      default: throw new Error('Invalid expiration format');
    }
  }
}
