/**
 * 工具类
 * 获取当天，yyyy-mm-dd 格式
 */
export function getTodayDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取本月第一天，yyyy-mm-dd 格式
 */
export function getFirstDayOfMonth(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

/**
 * 获取本年第一天，yyyy-mm-dd 格式
 */
export function getFirstDayOfYear(): string {
  const today = new Date()
  const year = today.getFullYear()
  return `${year}-01-01`
}
