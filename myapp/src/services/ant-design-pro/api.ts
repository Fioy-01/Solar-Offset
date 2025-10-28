// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export interface LoginParams {
  username?: string;
  password?: string;
  mobile?: string;
  captcha?: string;
  type: 'account' | 'mobile';
}

export interface LoginResult {
  status: 'ok' | 'error';
  currentAuthority?: 'admin' | 'user' | 'guest';
  token?: string;
  [key: string]: any;
}


/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // ✅ 防止额外拼接 token 参数
    params: {},   // <---- 这一行清空任何可能默认拼上的参数
    ...(options || {}),
  });
}

/** 获取验证码 GET /api/getCaptcha */
export async function getCaptcha(phone: string) {
  return request<Record<string, any>>(`/api/getCaptcha?phone=${phone}`, {
    method: 'GET',
  });
}


/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
/** 发送重置密码验证码 POST /api/getResetCode */
export async function getResetCode(body: { email: string }) {
  return request<Record<string, any>>('/api/getResetCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

/** 重置密码接口 POST /api/resetPassword */
export async function resetPassword(body: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return request<Record<string, any>>('/api/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

