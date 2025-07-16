# 管理系统后端

基于 Node.js + Express + TypeScript + MongoDB 构建的管理系统后端API。

## 技术栈

- **Node.js** - 运行时环境
- **Express** - Web框架
- **TypeScript** - 类型安全的JavaScript
- **MongoDB** - 数据库
- **Mongoose** - MongoDB对象建模
- **JWT** - 身份验证
- **bcryptjs** - 密码加密

## 项目结构

```
src/
├── config/          # 配置文件
├── controllers/     # 控制器
├── middleware/      # 中间件
├── models/         # 数据模型
├── routes/         # 路由
├── types/          # 类型定义
├── utils/          # 工具函数
├── app.ts          # Express应用配置
└── index.ts        # 服务器入口
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
复制 `.env` 文件并根据需要修改配置

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
npm start
```

## API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户资料

### 用户管理（需要管理员权限）
- `GET /api/users` - 获取用户列表（支持分页）
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建新用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

### 健康检查
- `GET /api/health` - 服务健康状态

## 环境变量

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/admin-backend
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080
```

## 开发说明

- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码规范检查
- 支持热重载开发模式
- 统一的错误处理和响应格式
- JWT 身份验证和权限控制
- 请求限流和安全防护
