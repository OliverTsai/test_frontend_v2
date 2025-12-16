<template>
  <div class="container">
    <div class="user-form-container">
      <h2 class="form-title">{{ $t('actions') }}</h2>
      <div class="form-group">
        <label>{{ $t('name') }}</label>
        <input v-model="newUser.name" type="text" class="form-input" />
      </div>
      <div class="form-group">
        <label>{{ $t('age') }}</label>
        <input v-model="newUser.age" type="number" class="form-input" />
      </div>
      <div class="form-actions">
        <EBtn v-if="isEditing" color="success" @click="updateUser">{{ $t('edit_user') }}</EBtn>
        <EBtn v-else color="warn" @click="addUser">{{ $t('add_user') }}</EBtn>
      </div>
    </div>

    <div class="user-table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ $t('name') }}</th>
            <th>{{ $t('age') }}</th>
            <th>{{ $t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in appStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.age }}</td>
            <td class="actions-cell">
              <EBtn color="success" @click="editUser(user)">{{ $t('edit') }}</EBtn>
              <EBtn color="error" @click="deleteUser(user.id)">{{ $t('delete') }}</EBtn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useAppStore } from '~/store/app'

const appStore = useAppStore()
const isEditing = ref(false)
const currentUserId = ref<number | null>(null)

interface User {
  id: number
  name: string
  age: number
}

// 表單數據
const newUser = reactive({
  name: '',
  age: ''
})

// 初始化
onMounted(async () => {
  await appStore.fetchUsers()
})

// 編輯用戶
const editUser = (user: User) => {
  isEditing.value = true
  currentUserId.value = user.id
  newUser.name = user.name
  newUser.age = user.age.toString()
}

// 添加用戶
const addUser = async () => {
  if (newUser.name && newUser.age) {
    await appStore.addUser({
      name: newUser.name,
      age: Number(newUser.age)
    })
    
    // 清空表單
    newUser.name = ''
    newUser.age = ''

    await appStore.fetchUsers()
  }
}

// 更新用戶
const updateUser = async () => {
  if (currentUserId.value && newUser.name && newUser.age) {
    await appStore.updateUser({
      id: Number(currentUserId.value),
      name: newUser.name,
      age: Number(newUser.age)
    })
    
    // 重置表單
    newUser.name = ''
    newUser.age = ''
    isEditing.value = false
    currentUserId.value = null

    await appStore.fetchUsers()
  }
}

// 刪除用戶
const deleteUser = async (id:number) => {
  if (confirm('確定要刪除此用戶嗎？')) {
    await appStore.deleteUser(id)
  }
}
</script>

<style scoped lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: white;
}

.user-form-container {
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: normal;
}

.form-group {
  margin-bottom: 15px;
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #444;
    background-color: #333;
    color: white;
    font-size: 16px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.user-table-container {
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #444;
  }
  
  th {
    font-weight: normal;
    text-align: center;
  }
  
  td {
    text-align: center;
  }
  
  .actions-cell {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
}

/* RWD */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
  
  .user-table th, .user-table td {
    padding: 8px;
  }
  
  .actions-cell {
    flex-direction: column;
    gap: 4px;
  }
}
</style>