<template>
  <div class="container">
    <div class="user-form-container">
      <h2 class="form-title">{{ $t('actions') }}</h2>
      <div class="form-group">
        <label>{{ $t('name') }}</label>
        <input v-model="appStore.formData.name" type="text" class="form-input" />
      </div>
      <div class="form-group">
        <label>{{ $t('age') }}</label>
        <input v-model="appStore.formData.age" type="number" class="form-input" />
      </div>
      <div class="form-actions">
        <EBtn v-if="appStore.isEditing" color="success" @click="openUpdateConfirmDialog">{{ $t('edit_user') }}</EBtn>
        <EBtn v-else color="warn" @click="openAddConfirmDialog">{{ $t('add_user') }}</EBtn>
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
              <EBtn color="error" @click="openDeleteConfirmDialog(user.id)">{{ $t('delete') }}</EBtn>
            </td>
          </tr>
        </tbody>
      </table>
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
}

// 確認刪除用戶
const confirmDeleteUser = async () => {
  await appStore.deleteUser()
  await appStore.fetchUsers()
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