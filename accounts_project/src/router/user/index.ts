import type { RouteRecordRaw } from 'vue-router'
import LoginView from '../../views/user/login.vue'

const userRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: LoginView,
  },
]

export default userRoutes
