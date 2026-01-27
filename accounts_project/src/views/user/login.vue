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
      const response = await loginApi({ username: username.value, password: password.value })
      console.log('output->response,', response)
      ElMessage.success(`${t('login.button')} success`)

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

const toggleLanguage = () => {
  if (currentLocale.value === 'zh') {
    locale.value = 'en'
    currentLocale.value = 'en'
    localStorage.setItem('locale', 'en')
  } else {
    locale.value = 'zh'
    currentLocale.value = 'zh'
    localStorage.setItem('locale', 'zh')
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
