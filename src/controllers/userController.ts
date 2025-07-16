import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import ResponseUtil from '../utils/response';

// 获取用户列表（分页）
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find()
      .select('-password')  // 不返回密码字段
      .sort({ createdAt: -1 })  // 按创建时间倒序
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

// 获取单个用户详情
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      ResponseUtil.notFound(res, '用户不存在');
      return;
    }
    
    ResponseUtil.success(res, user);
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 创建用户
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
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
    
    const user = new User({
      username,
      email,
      password,
      role: role || 'user'
    });
    
    await user.save();
    
    // 返回用户信息（不包含密码）
    const userResponse = await User.findById(user._id).select('-password');
    
    ResponseUtil.success(res, userResponse, '用户创建成功');
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 更新用户
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, role, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { username, email, role, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      ResponseUtil.notFound(res, '用户不存在');
      return;
    }
    
    ResponseUtil.success(res, user, '用户更新成功');
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
};

// 删除用户
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 不能删除自己
    if (id === req.user?.id) {
      ResponseUtil.badRequest(res, '不能删除自己的账户');
      return;
    }
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      ResponseUtil.notFound(res, '用户不存在');
      return;
    }
    
    ResponseUtil.success(res, null, '用户删除成功');
  } catch (error: any) {
    ResponseUtil.error(res, error.message);
  }
}; 