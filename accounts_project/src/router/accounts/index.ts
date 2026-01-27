import type { RouteRecordRaw } from 'vue-router'
import AccountsList from '@/views/accounts/list.vue'

const accountsRoutes: RouteRecordRaw[] = [
  {
    path: 'list',
    name: 'list',
    component: AccountsList,
  },
]

export default accountsRoutes
