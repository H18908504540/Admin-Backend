import { match } from 'assert';
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, '用户名至少需要3个字符'],
    maxlength: [20, '用户名最多20个字符'],
    unique: true,
    match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '请输入有效的电子邮件地址']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [8, '密码至少需要8个字符'],
    maxlength: [50, '密码最多50个字符'],
    select: false, // 查询时默认不返回密码字段
    validate: {
      validator: function(password: string) {
        // 密码强度验证：至少包含一个字母、一个数字
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
      },
      message: '密码必须包含至少一个字母和一个数字'
    }
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: '角色只能是 admin 或 user'
    },
    default: 'user', // 默认为普通用户
    required: [true, '用户角色不能为空']
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema); 