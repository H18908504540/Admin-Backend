import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// 所有用户管理路由都需要认证和管理员权限
router.use(authMiddleware, adminMiddleware);

// 获取用户列表
router.get('/', getUsers);

// 获取单个用户详情
router.get('/:id', getUserById);

// 创建新用户
router.post('/', createUser);

// 更新用户信息
router.put('/:id', updateUser);

// 删除用户
router.delete('/:id', deleteUser);

export default router; 