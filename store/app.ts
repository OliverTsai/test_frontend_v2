import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, toRaw } from 'vue'  // 添加这一行，导入 ref 函数
import { useNuxtApp } from '#app'

interface User {
  id: number
  name: string
  age: number
}

export const useAppStore = defineStore('app', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
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

  // 添加用戶
  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      loading.value = true
      error.value = null
      const response = await axios.post(`${baseUrl}/api/user`, user)
      users.value.push(response.data.data)
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
  const updateUser = async (userData: User) => {
    try {
        loading.value = true
        error.value = null
        const response = await axios.put(`${baseUrl}/api/user`, userData)
        const index = users.value.findIndex(user => user.id === userData.id) 
        if (index !== -1) {
            users.value[index] = response.data
        }
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
  const deleteUser = async (id: number) => {
    try {
        loading.value = true
        error.value = null
        await axios.delete(`${baseUrl}/api/user`, {
            data: { id } 
        })
        users.value = users.value.filter(user => user.id !== id)
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
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  }
})