import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { createStorage } from '@/utils/storage'
// 创建自定义前缀的实例
const userStorage = createStorage('user_')

interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
}

interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 可以在这里添加 token
        const token = userStorage.getLocal<string>('token')
        console.log('output->token', token)
        if (token) {
          config.headers['x-csrf-token'] = token
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        const data = response.data
        console.log('Response data:', data)
        // 根据业务需求处理响应数据
        if (data.code !== 0 && data.code !== 200) {
          // 可以在这里统一处理错误
          console.error('Request error:', data.message)
          return Promise.reject(new Error(data.message || '请求失败'))
        }
        return data
      },
      (error) => {
        // 处理响应错误
        console.error('Network error:', error)
        return Promise.reject(error)
      },
    )
  }

  public request<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
    return this.instance.request(config)
  }

  public get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.instance.get(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.instance.post(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.instance.put(url, data, config)
  }

  public delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.instance.delete(url, config)
  }

  public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.instance.patch(url, data, config)
  }
}

export default new Request()
