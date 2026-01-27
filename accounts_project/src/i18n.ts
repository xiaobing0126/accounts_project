import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

type MessageSchema = typeof zh

// 从 localStorage 获取保存的语言，没有则根据浏览器语言判断，最后默认中文
const getSavedLocale = (): 'en' | 'zh' => {
  const saved = localStorage.getItem('locale')
  if (saved === 'en' || saved === 'zh') {
    return saved
  }

  const browserLang = navigator.language
  return browserLang.startsWith('en') ? 'en' : 'zh'
}

const i18n = createI18n<MessageSchema, 'en' | 'zh'>({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en,
  },
})

export default i18n
