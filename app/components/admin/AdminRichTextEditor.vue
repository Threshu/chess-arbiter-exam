<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { t } = useI18n()

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  editorProps: {
    attributes: { class: 'prose-sm max-w-none focus-visible:outline-none min-h-[8rem] px-3 py-2' },
  },
  onUpdate: ({ editor: e }) => emit('update:modelValue', e.getHTML()),
})

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, { emitUpdate: false })
    }
  },
)

onBeforeUnmount(() => editor.value?.destroy())

function isActive(name: string, attrs?: Record<string, unknown>) {
  return editor.value?.isActive(name, attrs) ?? false
}
</script>

<template>
  <div class="border-border bg-bg rounded-md border">
    <div v-if="editor" class="border-border flex flex-wrap gap-1 border-b p-1.5">
      <button
        v-for="level in [1, 2, 3] as const"
        :key="level"
        type="button"
        :aria-pressed="isActive('heading', { level })"
        :class="[
          'rounded px-2 py-1 text-xs font-semibold',
          isActive('heading', { level })
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:text-fg',
        ]"
        @click="editor?.chain().focus().toggleHeading({ level }).run()"
      >
        H{{ level }}
      </button>
      <button
        type="button"
        :aria-pressed="isActive('bold')"
        :class="[
          'rounded px-2 py-1 text-xs font-bold',
          isActive('bold') ? 'bg-primary/10 text-primary' : 'text-muted hover:text-fg',
        ]"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        {{ t('examGenerator.editor.bold') }}
      </button>
      <button
        type="button"
        :aria-pressed="isActive('italic')"
        :class="[
          'rounded px-2 py-1 text-xs italic',
          isActive('italic') ? 'bg-primary/10 text-primary' : 'text-muted hover:text-fg',
        ]"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        {{ t('examGenerator.editor.italic') }}
      </button>
      <button
        type="button"
        :aria-pressed="isActive('bulletList')"
        :class="[
          'rounded px-2 py-1 text-xs',
          isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-muted hover:text-fg',
        ]"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        {{ t('examGenerator.editor.bulletList') }}
      </button>
      <button
        type="button"
        :aria-pressed="isActive('orderedList')"
        :class="[
          'rounded px-2 py-1 text-xs',
          isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-muted hover:text-fg',
        ]"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        {{ t('examGenerator.editor.orderedList') }}
      </button>
    </div>
    <EditorContent :editor="editor" class="text-fg" />
  </div>
</template>
