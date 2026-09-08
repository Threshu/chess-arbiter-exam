<script setup lang="ts">
interface Props {
  modelValue: string[]
  suggestions?: string[]
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), { suggestions: () => [], ariaLabel: 'Tags' })

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const { t } = useI18n()

const draft = ref('')
const showSuggestions = ref(false)

const filteredSuggestions = computed(() => {
  const term = draft.value.trim().toLowerCase()
  return props.suggestions
    .filter((s) => !props.modelValue.includes(s))
    .filter((s) => !term || s.toLowerCase().includes(term))
    .slice(0, 8)
})

function addTag(raw: string) {
  const tag = raw.trim()
  if (!tag || props.modelValue.includes(tag)) return
  emit('update:modelValue', [...props.modelValue, tag])
  draft.value = ''
}

function removeTag(tag: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((t) => t !== tag),
  )
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag(draft.value)
  } else if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeTag(props.modelValue[props.modelValue.length - 1]!)
  }
}
</script>

<template>
  <div class="relative">
    <div class="border-border bg-bg flex flex-wrap items-center gap-1.5 rounded-md border p-2">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      >
        {{ tag }}
        <button
          type="button"
          :aria-label="t('questions.form.removeTag', { tag })"
          class="hover:text-danger"
          @click="removeTag(tag)"
        >
          ×
        </button>
      </span>
      <input
        v-model="draft"
        type="text"
        :aria-label="ariaLabel"
        :placeholder="modelValue.length ? '' : t('questions.form.tagsPlaceholder')"
        class="text-fg min-w-[8rem] flex-1 bg-transparent text-sm outline-none"
        @keydown="onKeydown"
        @focus="showSuggestions = true"
        @blur="showSuggestions = false"
      >
    </div>
    <ul
      v-if="showSuggestions && filteredSuggestions.length"
      class="border-border bg-surface absolute z-10 mt-1 w-full max-w-xs rounded-md border shadow-lg"
    >
      <li v-for="s in filteredSuggestions" :key="s">
        <button
          type="button"
          class="hover:bg-bg text-fg block w-full px-3 py-1.5 text-left text-sm"
          @mousedown.prevent="addTag(s)"
        >
          {{ s }}
        </button>
      </li>
    </ul>
  </div>
</template>
