import { Response } from 'express';
import { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(res: Response, data?: T, message: string = '操作成功'): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    return res.status(200).json(response);
  }

  static error(res: Response, message: string = '操作失败', statusCode: number = 500): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: message
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string = '请求参数错误'): Response {
    return this.error(res, message, 400);
  }

  static unauthorized(res: Response, message: string = '未授权'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = '禁止访问'): Response {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = '资源不存在'): Response {
    return this.error(res, message, 404);
  }
}

export default ResponseUtil; 