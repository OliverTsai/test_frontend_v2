import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, reactive } from 'vue'
import { useNuxtApp } from '#app'

interface User {
  id: number
  name: string
  age: number
}

interface FormData {
  name: string
  age: number | string
}

export const useAppStore = defineStore('app', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isEditing = ref(false)
  const currentUserId = ref<number | null>(null)
  const formData = reactive<FormData>({
    name: '',
    age: ''
  })
  const baseUrl = 'https://42683.wu.elitepro.ltd'

  // 獲取用戶數據
  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await axios.get(`${baseUrl}/api/user`)
      users.value = structuredClone(response.data.data)
      console.log('用戶資料:', users.value)
    } 
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  // 設置編輯模式
  const setEditMode = (value: boolean) => {
    isEditing.value = value
  }

  // 設置當前用戶ID
  const setCurrentUserId = (id: number | null) => {
    currentUserId.value = id
  }

  // 設置表單數據
  const setFormData = (name: string, age: number | string) => {
    formData.name = name
    formData.age = age
  }

  // 重置表單
  const resetForm = () => {
    formData.name = ''
    formData.age = ''
    isEditing.value = false
    currentUserId.value = null
  }

  // 添加用戶
  const addUser = async () => {
    try {
      loading.value = true
      error.value = null
      const userData = {
        name: formData.name,
        age: Number(formData.age)
      }
      const response = await axios.post(`${baseUrl}/api/user`, userData)
      users.value.push(response.data.data)
      resetForm()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add user'
      console.error('Error adding user:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // 更新用戶
  const updateUser = async () => {
    if (!currentUserId.value) return false

    try {
      loading.value = true
      error.value = null
      const userData = {
        id: currentUserId.value,
        name: formData.name,
        age: Number(formData.age)
      }
      const response = await axios.put(`${baseUrl}/api/user`, userData)
      const index = users.value.findIndex(user => user.id === userData.id) 
      if (index !== -1) {
        users.value[index] = response.data
      }
      resetForm()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user'
      console.error('Error updating user:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // 刪除用戶
  const deleteUser = async () => {
    if (!currentUserId.value) return false

    try {
      loading.value = true
      error.value = null
      await axios.delete(`${baseUrl}/api/user`, {
        data: { id: currentUserId.value } 
      })
      users.value = users.value.filter(user => user.id !== currentUserId.value)
      currentUserId.value = null
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user'
      console.error('Error deleting user:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    isEditing,
    currentUserId,
    formData,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    setEditMode,
    setCurrentUserId,
    setFormData,
    resetForm
  }
})