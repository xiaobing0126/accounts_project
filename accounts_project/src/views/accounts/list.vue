<template>
  <div class="accounts-list">
    <div class="header">
      <h2>记账本</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增记录
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="summary-cards">
      <div class="card income">
        <div class="label">本月收入</div>
        <div class="amount">+ ¥{{ totalIncome.toFixed(2) }}</div>
      </div>
      <div class="card expense">
        <div class="label">本月支出</div>
        <div class="amount">- ¥{{ totalExpense.toFixed(2) }}</div>
      </div>
      <div class="card balance">
        <div class="label">本月结余</div>
        <div class="amount">¥{{ (totalIncome - totalExpense).toFixed(2) }}</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-date-picker
        v-model="filterDate"
        type="month"
        placeholder="选择月份"
        format="YYYY年MM月"
        value-format="YYYY-MM"
      />
      <el-select v-model="filterType" placeholder="类型" clearable style="width: 120px">
        <el-option label="全部" value="" />
        <el-option label="收入" value="income" />
        <el-option label="支出" value="expense" />
      </el-select>
      <el-select v-model="filterCategory" placeholder="分类" clearable style="width: 120px">
        <el-option
          v-for="cat in categories"
          :key="cat.value"
          :label="cat.label"
          :value="cat.value"
        />
      </el-select>
    </div>

    <!-- 记录列表 -->
    <el-table :data="filteredList" style="width: 100%" v-loading="loading">
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="type" label="类型" width="80">
        <template #default="{ row }">
          <el-tag :type="row.type === 'income' ? 'success' : 'danger'">
            {{ row.type === 'income' ? '收入' : '支出' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" width="100">
        <template #default="{ row }">
          {{ getCategoryLabel(row.category) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="150" />
      <el-table-column prop="amount" label="金额" width="120">
        <template #default="{ row }">
          <span :class="row.type === 'income' ? 'income-text' : 'expense-text'">
            {{ row.type === 'income' ? '+' : '-' }} ¥{{ row.amount.toFixed(2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑记录' : '新增记录'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio value="expense">支出</el-radio>
            <el-radio value="income">收入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in currentCategories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'AccountsList',
})

interface AccountRecord {
  id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const filterDate = ref('')
const filterType = ref('')
const filterCategory = ref('')

// 分类选项
const incomeCategories = [
  { label: '工资', value: 'salary' },
  { label: '奖金', value: 'bonus' },
  { label: '投资', value: 'investment' },
  { label: '其他收入', value: 'other_income' },
]

const expenseCategories = [
  { label: '餐饮', value: 'food' },
  { label: '交通', value: 'transport' },
  { label: '购物', value: 'shopping' },
  { label: '娱乐', value: 'entertainment' },
  { label: '住房', value: 'housing' },
  { label: '医疗', value: 'medical' },
  { label: '教育', value: 'education' },
  { label: '其他支出', value: 'other_expense' },
]

const categories = [...incomeCategories, ...expenseCategories]

const currentCategories = computed(() => {
  return form.value.type === 'income' ? incomeCategories : expenseCategories
})

// 表单数据
const defaultForm = (): AccountRecord => ({
  id: 0,
  type: 'expense',
  amount: 0,
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
})

const form = ref<AccountRecord>(defaultForm())

// 模拟数据
const accountList = ref<AccountRecord[]>([
  {
    id: 1,
    type: 'expense',
    amount: 35.5,
    category: 'food',
    description: '午餐',
    date: '2026-01-27',
  },
  {
    id: 2,
    type: 'expense',
    amount: 128,
    category: 'shopping',
    description: '日用品采购',
    date: '2026-01-26',
  },
  {
    id: 3,
    type: 'income',
    amount: 15000,
    category: 'salary',
    description: '1月工资',
    date: '2026-01-25',
  },
  {
    id: 4,
    type: 'expense',
    amount: 2500,
    category: 'housing',
    description: '房租',
    date: '2026-01-20',
  },
  {
    id: 5,
    type: 'expense',
    amount: 66,
    category: 'entertainment',
    description: '电影票',
    date: '2026-01-18',
  },
  {
    id: 6,
    type: 'income',
    amount: 500,
    category: 'bonus',
    description: '项目奖金',
    date: '2026-01-15',
  },
])

// 筛选后的列表
const filteredList = computed(() => {
  return accountList.value.filter((item) => {
    if (filterType.value && item.type !== filterType.value) return false
    if (filterCategory.value && item.category !== filterCategory.value) return false
    if (filterDate.value && !item.date.startsWith(filterDate.value)) return false
    return true
  })
})

// 统计
const totalIncome = computed(() => {
  return filteredList.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
})

const totalExpense = computed(() => {
  return filteredList.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
})

const getCategoryLabel = (value: string) => {
  const cat = categories.find((c) => c.value === value)
  return cat ? cat.label : value
}

const handleAdd = () => {
  isEdit.value = false
  form.value = defaultForm()
  dialogVisible.value = true
}

const handleEdit = (row: AccountRecord) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSave = () => {
  if (!form.value.amount || !form.value.category) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (isEdit.value) {
    const index = accountList.value.findIndex((item) => item.id === form.value.id)
    if (index !== -1) {
      accountList.value[index] = { ...form.value }
    }
    ElMessage.success('编辑成功')
  } else {
    const newId = Math.max(...accountList.value.map((item) => item.id), 0) + 1
    accountList.value.unshift({ ...form.value, id: newId })
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}

const handleDelete = (row: AccountRecord) => {
  ElMessageBox.confirm('确定删除这条记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const index = accountList.value.findIndex((item) => item.id === row.id)
    if (index !== -1) {
      accountList.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}
</script>

<style scoped lang="scss">
.accounts-list {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    .card {
      padding: 20px;
      border-radius: 8px;
      color: #fff;

      .label {
        font-size: 14px;
        opacity: 0.9;
        margin-bottom: 8px;
      }

      .amount {
        font-size: 24px;
        font-weight: bold;
      }

      &.income {
        background: linear-gradient(135deg, #67c23a, #85ce61);
      }

      &.expense {
        background: linear-gradient(135deg, #f56c6c, #f89898);
      }

      &.balance {
        background: linear-gradient(135deg, #409eff, #79bbff);
      }
    }
  }

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .income-text {
    color: #67c23a;
    font-weight: 500;
  }

  .expense-text {
    color: #f56c6c;
    font-weight: 500;
  }
}
</style>
