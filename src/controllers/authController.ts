import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config';
import ResponseUtil from '../utils/response';
import { AuthRequest } from '../types';

// 生成 JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  } as jwt.SignOptions);
};

// 用户注册
export const register = async (req: Request, res: Response): Promise<void> => {
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

    // 创建用户
    const user = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    // 生成 token
    const token = generateToken((user._id as any).toString());

    ResponseUtil.success(res, {
      user: {
        id: user._id as any,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    }, '注册成功');
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 用户登录
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 查找用户（包含密码字段）
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      ResponseUtil.unauthorized(res, '邮箱或密码错误');
      return;
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      ResponseUtil.unauthorized(res, '邮箱或密码错误');
      return;
    }

    // 生成 token
    const token = generateToken((user._id as any).toString());

    ResponseUtil.success(res, {
      user: {
        id: user._id as any,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    }, '登录成功');
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 获取当前用户信息
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      ResponseUtil.notFound(res, '用户不存在');
      return;
    }

    ResponseUtil.success(res, {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 更新用户信息
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { username, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      ResponseUtil.notFound(res, '用户不存在');
      return;
    }

    ResponseUtil.success(res, {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }, '更新成功');
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
}; 