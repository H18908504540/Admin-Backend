import app from './app';
import { config } from './config';
import connectDB from './config/database';

// 连接数据库
connectDB();

// 启动服务器
const server = app.listen(config.port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${config.port}`);
  console.log(`📝 环境: ${config.nodeEnv}`);
  console.log(`🗄️  数据库: ${config.mongodbUri}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('👋 收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});

export default server; 