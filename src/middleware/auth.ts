import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { config } from '../config';
import ResponseUtil from '../utils/response';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      ResponseUtil.unauthorized(res, '访问令牌缺失');
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    ResponseUtil.unauthorized(res, '无效的访问令牌');
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    ResponseUtil.forbidden(res, '需要管理员权限');
    return;
  }
  next();
};

export default authMiddleware; 