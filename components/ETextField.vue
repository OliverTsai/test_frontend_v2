<template>
  <div class="e-text-field">
    <label v-if="label" :for="inputId" class="e-text-field-label">{{ label }}</label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="e-text-field-input"
      @input="updateValue"
      @blur="validate"
    />
    <p v-if="errorMessage" class="e-text-field-error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  id?: string // 若使用者有輸入，以使用者輸入的為主，若沒有請產出一個唯一 ID
  label?: string
  modelValue?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rules?: ((value: string) => string | boolean)[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = computed(() => props.id || `text-field-${uniqueId.value}`)
const uniqueId = ref(uuidv4())
const errorMessage = ref('')

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const validate = () => {
  if (!props.rules || !props.rules.length) return true

  for (const rule of props.rules) {
    const result = rule(props.modelValue || '')
    if (typeof result === 'string') {
      errorMessage.value = result
      return false
    }
  }

  errorMessage.value = ''
  return true
}

onMounted(() => {
  if (props.required && props.modelValue === '') {
    validate()
  }
})
</script>

<style scoped lang="scss">
.e-text-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  
  &-label {
    font-size: 14px;
    margin-bottom: 4px;
    color: #333;
  }
  
  &-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    transition: border 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #4caf50;
    }
    
    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }
  
  &-error {
    color: #f44336;
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>