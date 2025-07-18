import { Request, Response } from 'express';
import User from '../models/User';
import ResponseUtil from '../utils/response';

// 获取用户列表（简化版本）
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // 获取用户列表，不返回密码字段
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await User.countDocuments();
    
    ResponseUtil.success(res, {
      data: users,
      pagination: {
        current: Number(page),
        pageSize: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 创建新用户
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      ResponseUtil.badRequest(res, '用户名或邮箱已存在');
      return;
    }
    
    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      role: role || 'user' // 如果没有指定角色，默认为user
    });
    
    await user.save();
    
    // 返回用户信息（不包含密码）
    const userResponse = await User.findById(user._id).select('-password');
    
    ResponseUtil.success(res, userResponse, '用户创建成功');
  } catch (error: any) {
    // 处理Mongoose验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      ResponseUtil.badRequest(res, messages.join(', '));
    } else {
      ResponseUtil.error(res, error.message);
    }
  }
}; 