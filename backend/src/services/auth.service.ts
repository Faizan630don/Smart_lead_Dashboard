import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { ValidationError, UnauthorizedError } from '../utils/errors';
import { IUser, IAuthPayload } from '../types';

export class AuthService {
  /**
   * Register a new user in the system
   */
  public static async register(userData: {
    email: string;
    passwordHash: string;
    name: string;
    role: any;
  }): Promise<{ user: IUser }> {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const newUser = new User(userData);
    await newUser.save();

    const safeUser = newUser.toSafeUser();

    return { user: safeUser };
  }

  /**
   * Log a user in and return token + safe details
   */
  public static async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedError('Email or password is incorrect');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Email or password is incorrect');
    }

    const safeUser = user.toSafeUser();
    const token = this.generateToken(safeUser);

    return { user: safeUser, token };
  }

  /**
   * Helper to sign JWT payload
   */
  private static generateToken(user: IUser): string {
    const payload: IAuthPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }
}
