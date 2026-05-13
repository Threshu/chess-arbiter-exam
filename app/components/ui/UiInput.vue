<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  hint?: string
  error?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: undefined,
  hint: undefined,
  error: undefined,
  type: 'text',
  placeholder: undefined,
  disabled: false,
  required: false,
  id: undefined,
})

defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = computed(() => props.id ?? `ui-input-${crypto.randomUUID()}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)

const describedBy = computed(
  () =>
    [props.hint ? hintId.value : null, props.error ? errorId.value : null]
      .filter(Boolean)
      .join(' ') || undefined,
)
</script>

<template>
  <label :for="inputId" class="flex flex-col gap-1.5">
    <span v-if="label" class="text-fg text-sm font-medium">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="text-danger">*</span>
    </span>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="describedBy"
      :class="[
        'bg-bg text-fg h-10 rounded-md border px-3 font-sans text-base',
        'placeholder:text-muted',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        error ? 'border-danger' : 'border-border',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span v-if="hint && !error" :id="hintId" class="text-muted text-sm">{{ hint }}</span>
    <span v-if="error" :id="errorId" class="text-danger text-sm">{{ error }}</span>
  </label>
</template>
