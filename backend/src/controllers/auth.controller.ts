import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';
import { User } from '../models/User';
import { UnauthorizedError } from '../utils/errors';

export class AuthController {
  /**
   * POST /api/auth/register
   * Create a new user account (manual login required)
   */
  public static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, name, role } = req.body;
      await AuthService.register({
        email,
        passwordHash: password,
        name,
        role,
      });

      // Send standard response representing both global wrapper formatting and custom message
      res.status(201).json({
        success: true,
        message: 'Check your email',
        data: {
          message: 'Check your email',
        },
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl || req.path,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/login
   * Authenticate user credentials and return a token
   */
  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      sendResponse(res, 200, result, req.originalUrl || req.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/auth/me
   * Retrieve active session user context
   */
  public static me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next(new UnauthorizedError('Please login first'));
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new UnauthorizedError('Authentication failed'));
      }

      sendResponse(res, 200, user.toSafeUser(), req.originalUrl || req.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/auth/logout
   * Logout current session
   */
  public static logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        data: null,
        error: null,
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl || req.path,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
export default AuthController;
