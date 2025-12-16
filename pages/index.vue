<template>
  <div class="container">
    <div class="user-form-container">
      <h2 class="form-title">{{ $t('actions') }}</h2>
      <div class="form-group">
        <label for="name-input">{{ $t('name') }}</label>
        <input 
          id="name-input"
          v-model="appStore.formData.name" 
          type="text" 
          class="form-input" 
          placeholder="輸入姓名"
        />
      </div>
      <div class="form-group">
        <label for="age-input">{{ $t('age') }}</label>
        <input 
          id="age-input"
          v-model="appStore.formData.age" 
          type="number" 
          class="form-input" 
          placeholder="輸入年齡"
        />
      </div>
      <div class="form-actions">
        <EBtn 
          v-if="appStore.isEditing" 
          color="success" 
          @click="openUpdateConfirmDialog"
          class="action-btn"
        >
          <span class="btn-text">{{ $t('edit_user') }}</span>
        </EBtn>
        <EBtn 
          v-else 
          color="warn" 
          @click="openAddConfirmDialog"
          class="action-btn"
        >
          <span class="btn-text">{{ $t('add_user') }}</span>
        </EBtn>
        <EBtn 
          v-if="appStore.isEditing"
          color="error" 
          @click="cancelEdit"
          class="action-btn"
        >
          <span class="btn-text">{{ $t('cancel') }}</span>
        </EBtn>
      </div>
    </div>

    <div class="user-table-container">
      <div class="table-header">
        <h2 class="table-title">{{ $t('user_list') }}</h2>
        <div class="user-count">{{ appStore.users.length }} {{ $t('users') }}</div>
      </div>
      
      <div class="table-responsive">
        <table class="user-table">
          <thead>
            <tr>
              <th class="id-column">#</th>
              <th>{{ $t('name') }}</th>
              <th>{{ $t('age') }}</th>
              <th class="actions-column">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in appStore.users" :key="user.id" :class="{'highlight': user.id === appStore.currentUserId}">
              <td class="id-column">{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.age }}</td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <EBtn 
                    color="success" 
                    @click="editUser(user)"
                    class="table-btn"
                  >
                    {{ $t('edit') }}
                  </EBtn>
                  <EBtn 
                    color="error" 
                    @click="openDeleteConfirmDialog(user.id)"
                    class="table-btn"
                  >
                    {{ $t('delete') }}
                  </EBtn>
                </div>
              </td>
            </tr>
            <tr v-if="appStore.users.length === 0">
              <td colspan="4" class="no-data">{{ $t('no_users') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增確認對話框 -->
    <EDialog ref="addConfirmDialogRef" :title="$t('add_user')" @confirm="confirmAddUser">
      <p>{{ $t('confirm_add_message') }}</p>
    </EDialog>
    
    <!-- 更新確認對話框 -->
    <EDialog ref="updateConfirmDialogRef" :title="$t('edit_user')" @confirm="confirmUpdateUser">
      <p>{{ $t('confirm_edit_message') }}</p>
    </EDialog>
    
    <!-- 刪除確認對話框 -->
    <EDialog ref="deleteConfirmDialogRef" :title="$t('delete_user')" @confirm="confirmDeleteUser">
      <p>{{ $t('confirm_delete') }}</p>
    </EDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '~/store/app'

const appStore = useAppStore()

// 對話框引用
const addConfirmDialogRef = ref<{ open: () => void; close: () => void } | null>(null)
const updateConfirmDialogRef = ref<{ open: () => void; close: () => void } | null>(null)
const deleteConfirmDialogRef = ref<{ open: () => void; close: () => void } | null>(null)

// 初始化
onMounted(async () => {
  await appStore.fetchUsers()
})

// 編輯用戶
const editUser = (user: { id: number, name: string, age: number }) => {
  appStore.setEditMode(true)
  appStore.setCurrentUserId(user.id)
  appStore.setFormData(user.name, user.age)
  
  // 在小螢幕上自動滾動到表單
  if (window.innerWidth < 768) {
    setTimeout(() => {
      document.querySelector('.user-form-container')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }
}

// 取消編輯
const cancelEdit = () => {
  appStore.setEditMode(false)
  appStore.setCurrentUserId(null)
  appStore.setFormData('', '')
}

// 打開新增確認對話框
const openAddConfirmDialog = () => {
  if (appStore.formData.name && appStore.formData.age) {
    addConfirmDialogRef.value?.open()
  } else {
    alert('請填寫完整的用戶信息')
  }
}

// 打開更新確認對話框
const openUpdateConfirmDialog = () => {
  if (appStore.currentUserId && appStore.formData.name && appStore.formData.age) {
    updateConfirmDialogRef.value?.open()
  } else {
    alert('請填寫完整的用戶信息')
  }
}

// 打開刪除確認對話框
const openDeleteConfirmDialog = (id: number) => {
  appStore.setCurrentUserId(id)
  deleteConfirmDialogRef.value?.open()
}

// 確認添加用戶
const confirmAddUser = async () => {
  await appStore.addUser()
  await appStore.fetchUsers()
}

// 確認更新用戶
const confirmUpdateUser = async () => {
  await appStore.updateUser()
  await appStore.fetchUsers()
  cancelEdit()
}

// 確認刪除用戶
const confirmDeleteUser = async () => {
  await appStore.deleteUser()
  await appStore.fetchUsers()
}
</script>

<style scoped lang="scss">
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  color: white;
  min-height: 100vh;
}

.user-form-container {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 600;
  color: #f0f0f0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #4a6cf7, #6a49f2);
    border-radius: 3px;
  }
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #e0e0e0;
  }
  
  .form-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #444;
    background-color: #333;
    color: white;
    font-size: 16px;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #4a6cf7;
      box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
    }
    
    &::placeholder {
      color: #888;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  min-width: 100px;
  padding: 8px 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .btn-text {
    display: inline-block;
  }
}

.user-table-container {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .table-title {
    font-size: 20px;
    font-weight: 600;
    color: #f0f0f0;
    margin: 0;
  }
  
  .user-count {
    background-color: rgba(74, 108, 247, 0.2);
    color: #4a6cf7;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
  }
}

.table-responsive {
  overflow-x: auto;
  margin: 0 -8px;
  padding: 0 8px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #333;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
    
    &:hover {
      background: #666;
    }
  }
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #444;
  }
  
  th {
    font-weight: 500;
    color: #e0e0e0;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.5px;
  }
  
  td {
    color: #f0f0f0;
    font-size: 15px;
  }
  
  tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
    
    &.highlight {
      background-color: rgba(74, 108, 247, 0.1);
      border-left: 3px solid #4a6cf7;
    }
  }
  
  .actions-cell {
    .action-buttons {
      display: flex;
      justify-content: flex-start;
      gap: 8px;
    }
  }
  
  .table-btn {
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 6px;
  }
  
  .no-data {
    text-align: center;
    padding: 32px;
    color: #888;
    font-style: italic;
  }
}

.id-column {
  width: 60px;
}

.actions-column {
  width: 180px;
}

/* RWD */
@media (max-width: 768px) {
  .container {
    padding: 16px;
    gap: 24px;
  }
  
  .user-form-container,
  .user-table-container {
    padding: 20px;
  }
  
  .form-title,
  .table-title {
    font-size: 18px;
  }
  
  .form-title::after {
    width: 50px;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .user-table th, 
  .user-table td {
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .id-column {
    width: 40px;
  }
  
  .actions-column {
    width: 140px;
  }
}

@media (max-width: 576px) {
  .container {
    padding: 12px;
    gap: 20px;
  }
  
  .user-form-container,
  .user-table-container {
    padding: 16px;
    border-radius: 10px;
  }
  
  .form-group .form-input {
    padding: 10px 12px;
  }
  
  .form-actions {
    flex-direction: column;
    width: 100%;
    
    .action-btn {
      width: 100%;
      margin-bottom: 8px;
    }
  }
  
  .user-table th, 
  .user-table td {
    padding: 10px 6px;
    font-size: 13px;
  }
  
  .table-btn {
    padding: 5px 8px;
    font-size: 12px;
  }
  
  .actions-cell .action-buttons {
    flex-direction: column;
    gap: 6px;
  }
  
  .id-column {
    width: 30px;
  }
  
  .actions-column {
    width: 80px;
  }
}

@media (max-width: 400px) {
  .container {
    padding: 8px;
  }
  
  .user-form-container,
  .user-table-container {
    padding: 12px;
  }
  
  .form-title,
  .table-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .user-table {
    font-size: 12px;
    
    th {
      font-size: 12px;
    }
    
    td {
      font-size: 12px;
    }
  }
}

/* 特別針對 320px 的極小螢幕優化 */
@media (max-width: 320px) {
  .container {
    padding: 6px;
  }
  
  .user-form-container,
  .user-table-container {
    padding: 10px;
  }
  
  .form-title,
  .table-title {
    font-size: 15px;
  }
  
  .form-group label {
    font-size: 13px;
  }
  
  .form-group .form-input {
    padding: 8px 10px;
    font-size: 14px;
  }
  
  .user-table th, 
  .user-table td {
    padding: 8px 4px;
    font-size: 11px;
  }
  
  .table-btn {
    padding: 4px 6px;
    font-size: 11px;
  }
  
  .id-column {
    width: 25px;
  }
  
  .actions-column {
    width: 70px;
  }
}
</style>