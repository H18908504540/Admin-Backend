import { Router } from 'express';
import authRoutes from './auth';
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

// API 路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router; 