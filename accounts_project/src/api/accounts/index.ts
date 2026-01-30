import request from '@/utils/request'

// 获取列表接口
export const postAccountsListApi = (data: object = {}) => {
  return request.post('/accounts/list', data)
}

// 创建账单接口
export const createAccountApi = (data: object) => {
  return request.post('/accounts/create', data)
}

// 更新账单接口
export const updateAccountApi = (data: object) => {
  return request.post('/accounts/update', data)
}

// 删除账单接口
export const deleteAccountApi = (data: object) => {
  return request.post('/accounts/delete', data)
}
