/**
 * 生成存储数据工具类——封装localStorage
 */
class StorageUtil {
  private prefix: string

  constructor(prefix = '') {
    // 空构造函数
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return this.prefix + key
  }

  // 本地存储localStorage
  // static方法可以直接通过类名调用，无需实例化
  // static表示静态方法，属于类本身，而不是类的实例，方法内部的this指向类本身
  // 如果使用static修饰，所有的private方法后面也需要加static，否则会报错
  // 默认值也需要直接赋值，下面的prefix无法通过构造函数赋值
  // constructor(prefix = 'app_') {
  //   // 空构造函数
  //   this.prefix = prefix
  // }
  // public修饰符表示该方法可以被外部访问，需要用实例调用，方法内部的this指向类的实例
  public setLocal(key: string, value: any): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(value))
  }

  public getLocal<T>(key: string): T | null {
    const item = localStorage.getItem(this.getKey(key))
    return item ? (JSON.parse(item) as T) : null
  }

  public removeLocal(key: string): void {
    localStorage.removeItem(this.getKey(key))
  }
}

// 导出单例，public修饰的方法，用实例调用
export default new StorageUtil()

// 工厂函数，创建不同前缀的实例
export const createStorage = (prefix?: string) => new StorageUtil(prefix)

// 导出类，static修饰的方法，用类名调用，注意其他所有的都得用static了
// export default StorageUtil
