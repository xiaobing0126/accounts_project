<template>
  <div class="login">
    <div class="login-container">
      <div class="title">{{ $t('login.title') }}</div>
      <el-form>
        <el-form-item>
          <el-input v-model="username" :placeholder="$t('login.placeholder.username')" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            :placeholder="$t('login.placeholder.password')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">
            {{ $t('login.button') }}
          </el-button>
        </el-form-item>
        <el-button text @click="toggleLanguage">
          {{ currentLocale === 'zh' ? 'English' : '中文' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'UserLogin',
})
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/user/index'
// 如果是导出类，就这么引入
// import StorageUtil from '@/utils/storage'

// 如果是导出单例，就这么引入
// import storageUtil from '@/utils/storage'

import storageUtil, { createStorage } from '@/utils/storage'
// 创建自定义前缀的实例
const userStorage = createStorage('user_')

const { t, locale } = useI18n()
const username = ref('')
const password = ref('')
const currentLocale = ref(locale.value)
const router = useRouter()

// 处理登录逻辑
const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.error(t('login.placeholder.username'))
  } else {
    try {
      const res = await loginApi({ username: username.value, password: password.value })
      console.log('output->res,', res)
      ElMessage.success(`${t('login.button')} success`)

      userStorage.setLocal('token', res.data.token)

      // 登陆成功跳转列表页面
      router.push({
        path: '/accounts/list',
      })
    } catch (error) {
      console.log('output->error,', error)
      ElMessage.error(t('login.error'))
    }
  }
}

/**
 * 切换语言
 */
const toggleLanguage = () => {
  console.log('output->storageUtil.getLocal', storageUtil.getLocal('locale'))
  if (currentLocale.value === 'zh') {
    locale.value = 'en'
    currentLocale.value = 'en'
    storageUtil.setLocal('locale', 'en')
  } else {
    locale.value = 'zh'
    currentLocale.value = 'zh'
    storageUtil.setLocal('locale', 'zh')
  }
}
</script>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .login-container {
    padding: 2.5rem;
    width: 100%;
    max-width: 25rem;

    .title {
      text-align: center;
      margin-bottom: 1.875rem;
      color: #333;
      font-size: 1.5rem;
    }
  }
}
</style>
