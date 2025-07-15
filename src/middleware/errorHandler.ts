import { Request, Response, NextFunction } from 'express';
import ResponseUtil from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('错误详情:', err);

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    ResponseUtil.badRequest(res, `验证失败: ${message}`);
    return;
  }

  // Mongoose 重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    ResponseUtil.badRequest(res, `${field} 已存在`);
    return;
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    ResponseUtil.unauthorized(res, '无效的访问令牌');
    return;
  }

  // JWT 过期错误
  if (err.name === 'TokenExpiredError') {
    ResponseUtil.unauthorized(res, '访问令牌已过期');
    return;
  }

  // 默认错误
  ResponseUtil.error(res, err.message || '服务器内部错误', err.statusCode || 500);
};

export default errorHandler; 