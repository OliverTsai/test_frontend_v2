<template>
  <button
    :class="[
      'e-btn',
      `e-btn-${color}`,
      { 'e-btn-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <template v-if="text">{{ text }}</template>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'success',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.e-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  // success 綠
  &-success {
    background-color: #4caf50;
    color: white;
    
    &:hover {
      background-color: #4caf50;
    }
  }

  // error 紅
  &-error {
    background-color: #f44336;
    color: white;
    
    &:hover {
      background-color: #f44336;
    }
  }

  // warn 黃
  &-warn {
    background-color: #ff9800;
    color: white;
    
    &:hover {
      background-color: #ff9800;
    }
  }
  
  &-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>