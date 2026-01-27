import request from '@/utils/request'

interface LoginParams {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
  }
}

interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
}

/**
 * 用户登录
 */
export const loginApi = (params: LoginParams) => {
  return request.post<LoginResponse>('/user/login', params)
}

/**
 * 用户注册
 */
export const register = (params: LoginParams) => {
  return request.post<LoginResponse>('/user/register', params)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<UserInfo>('/user/info')
}

/**
 * 用户登出
 */
export const logout = () => {
  return request.post('/user/logout')
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return request.put<UserInfo>('/user/info', data)
}
