import { CurrentUserRes, LoginPayload } from '@/types/api';
import { request } from '@/utils';

/**
 * 用户登录
 */
export async function login(data: LoginPayload) {
  return await request.post('/auth/login', data);
}

/**
 * 获取当前用户信息
 */
export async function currentUser(): Promise<CurrentUserRes> {
  return await request.get('/auth/whoami');
}

/**
 * 用户注册
 */
export async function register(data: { username: string; password: string }) {
  return await request.post('/admin/register', data);
}
