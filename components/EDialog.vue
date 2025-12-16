<template>
  <dialog ref="dialogRef" class="e-dialog">
    <div class="e-dialog-content">
      <div class="e-dialog-header">
        <h3 class="e-dialog-title">{{ title }}</h3>
        <button class="e-dialog-close" @click="close">×</button>
      </div>
      <div class="e-dialog-body">
        <slot />
      </div>
      <div class="e-dialog-footer">
        <EBtn color="error" @click="close">{{ $t('cancel') }}</EBtn>
        <EBtn color="success" @click="confirm">{{ $t('confirm') }}</EBtn>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  title: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const confirm = () => {
  emit('confirm')
  close()
}

defineExpose({
  open,
  close
})
</script>

<style scoped lang="scss">
.e-dialog {
  border: none;
  border-radius: 8px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  background-color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  &-content {
    display: flex;
    flex-direction: column;
  }
  
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }
  
  &-title {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
  
  &-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
  
  &-body {
    padding: 16px;
    min-height: 100px;
  }
  
  &-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px;
    border-top: 1px solid #eee;
  }
}

@media (max-width: 500px) {
  .e-dialog {
    width: 95%;
    
    &-title {
      font-size: 16px;
    }
    
    &-body {
      min-height: 80px;
    }
  }
}
</style>