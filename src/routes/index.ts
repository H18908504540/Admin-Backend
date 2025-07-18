import { Router } from 'express';
import userRoutes from './users';

const router = Router();

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 用户管理路由
router.use('/users', userRoutes);

export default router; 