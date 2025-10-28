import { request } from '@umijs/max';

export interface UserRegisterParams {
  email: string;
  password: string;
  confirm: string;
}

export interface RegisterResponse {
  status: 'ok' | 'error';
  success: boolean;
  message?: string;
  currentAuthority?: 'user' | 'admin' | 'guest';
}

export async function registerUser(data: UserRegisterParams): Promise<RegisterResponse> {
  return request('/api/register', {
    method: 'POST',
    requestType: 'json', // 👈 明确指定发送 JSON 格式
    data,                // ✅ Umi 会自动设置 Content-Type 为 application/json
  });
}


