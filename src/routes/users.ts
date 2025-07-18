import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';

const router = Router();

// 获取用户列表 - 简化版本，无需认证
router.get('/', getUsers);

// 创建新用户
router.post('/', createUser);

export default router; 