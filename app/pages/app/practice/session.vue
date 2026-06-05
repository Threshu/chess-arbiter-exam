<script setup lang="ts">
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Firestore,
} from 'firebase/firestore'
import type { ClosedQuestion, Level, Question, QuestionTypeId } from '~~/shared/types/question'
import { isClosedQuestion } from '~~/shared/types/question'

definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { $firestore } = useNuxtApp()
const { user } = useAuth()
const firestore = $firestore as Firestore

const levelFilter = computed(() => route.query.level as Level | undefined)
const typeFilter = computed(() => route.query.type as QuestionTypeId | undefined)
const limitFilter = computed(() => {
  const raw = route.query.limit as string | undefined
  if (!raw) return undefined
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : undefined
})

type Loaded = Question & { id: string }

const questions = ref<Loaded[]>([])
const loading = ref(true)
const currentIndex = ref(0)

const selectedIds = ref<Set<string>>(new Set())
const userText = ref('')
const submitted = ref(false)
const saving = ref(false)

const scoredCount = ref(0)
const correctCount = ref(0)
const openCount = ref(0)

const current = computed<Loaded | null>(() => questions.value[currentIndex.value] ?? null)
const currentLocale = computed<'pl' | 'en'>(() => (locale.value === 'en' ? 'en' : 'pl'))
const total = computed(() => questions.value.length)
const finished = computed(() => total.value > 0 && currentIndex.value >= total.value)

const closedCurrent = computed(() =>
  current.value && isClosedQuestion(current.value)
    ? (current.value as ClosedQuestion & { id: string })
    : null,
)

const isCorrect = computed<boolean | null>(() => {
  if (!submitted.value || !closedCurrent.value) return null
  const correctIds = new Set(
    closedCurrent.value.options.filter((o) => o.isCorrect).map((o) => o.id),
  )
  if (correctIds.size !== selectedIds.value.size) return false
  for (const id of correctIds) if (!selectedIds.value.has(id)) return false
  return true
})

function toggleOption(id: string) {
  if (submitted.value || !closedCurrent.value) return
  if (closedCurrent.value.type === 'single-choice') {
    selectedIds.value = new Set([id])
  } else {
    const next = new Set(selectedIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    selectedIds.value = next
  }
}

function canSubmit(): boolean {
  if (!current.value) return false
  if (current.value.type === 'open-ended') return true
  return selectedIds.value.size > 0
}

async function submit() {
  if (submitted.value || !current.value || !user.value) return
  saving.value = true
  submitted.value = true
  try {
    const q = current.value

    if (q.type === 'open-ended') {
      openCount.value += 1
      return
    }

    const correctIds = new Set(q.options.filter((o) => o.isCorrect).map((o) => o.id))
    let allMatch = correctIds.size === selectedIds.value.size
    if (allMatch) {
      for (const id of correctIds) if (!selectedIds.value.has(id)) allMatch = false
    }

    scoredCount.value += 1
    if (allMatch) correctCount.value += 1

    await addDoc(collection(firestore, 'practiceAttempts'), {
      userId: user.value.uid,
      questionId: q.id,
      questionType: q.type,
      selectedOptionIds: Array.from(selectedIds.value),
      isCorrect: allMatch,
      answeredAt: serverTimestamp(),
    })

    await updateDoc(doc(firestore, 'users', user.value.uid), {
      'stats.attempts': increment(1),
      ...(allMatch ? { 'stats.correct': increment(1) } : {}),
      lastLoginAt: serverTimestamp(),
    })
  } finally {
    saving.value = false
  }
}

function next() {
  currentIndex.value += 1
  selectedIds.value = new Set()
  userText.value = ''
  submitted.value = false
}

onMounted(async () => {
  const q = query(collection(firestore, 'questions'), where('status', '==', 'published'))
  const snap = await getDocs(q)
  const all = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Question) }))
    .filter(
      (q) => q.type === 'single-choice' || q.type === 'multi-choice' || q.type === 'open-ended',
    )
    .filter((q) => !levelFilter.value || q.level === levelFilter.value)
    .filter((q) => !typeFilter.value || q.type === typeFilter.value)
  const seed = Math.floor(Math.random() * 1_000_000)
  const shuffled = shuffle(all, seed)
  questions.value = limitFilter.value ? shuffled.slice(0, limitFilter.value) : shuffled
  loading.value = false
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-10">
    <h1 class="font-display text-fg mb-6 text-3xl">{{ t('practice.title') }}</h1>

    <Transition name="slide-fade" mode="out-in">
      <UiCard v-if="loading" key="loading">
        <p class="text-muted">{{ t('practice.loading') }}</p>
      </UiCard>

      <UiCard v-else-if="total === 0" key="empty">
        <p class="text-muted mb-3">{{ t('practice.noResults') }}</p>
        <NuxtLink :to="localePath('/app/practice')">
          <UiButton variant="secondary" size="sm">{{ t('practice.backToSetup') }}</UiButton>
        </NuxtLink>
      </UiCard>

      <UiCard v-else-if="finished" key="finished">
        <h2 class="font-display text-fg mb-2 text-2xl">{{ t('practice.completed') }}</h2>
        <p class="text-muted">
          {{
            t('practice.completedSubtitle', {
              n: correctCount,
              scored: scoredCount,
              open: openCount,
            })
          }}
        </p>
      </UiCard>

      <div v-else-if="current" :key="`q-${currentIndex}`">
        <UiCard>
          <template #header>
            <p class="text-muted text-sm">
              {{ t('practice.progress', { current: currentIndex + 1, total }) }}
            </p>
          </template>

          <div class="flex flex-col gap-6">
            <p class="text-fg text-lg">
              {{ localized(current.content, locale as 'pl' | 'en').stem }}
            </p>

            <div v-if="current.diagram" class="flex justify-center">
              <ChessBoard v-if="current.diagram.kind === 'fen'" :fen="current.diagram.fen" />
              <ChessReplay v-else-if="current.diagram.kind === 'pgn'" :pgn="current.diagram.pgn" />
            </div>

            <fieldset v-if="closedCurrent" class="flex flex-col gap-2">
              <label
                v-for="opt in closedCurrent.options"
                :key="opt.id"
                :for="`opt-${opt.id}`"
                :class="[
                  'border-border bg-bg flex cursor-pointer items-start gap-3 rounded-md border p-3',
                  submitted && opt.isCorrect ? 'border-success bg-success/10' : '',
                  submitted && !opt.isCorrect && selectedIds.has(opt.id)
                    ? 'border-danger bg-danger/10'
                    : '',
                  !submitted && selectedIds.has(opt.id) ? 'border-primary' : '',
                ]"
              >
                <input
                  :id="`opt-${opt.id}`"
                  :type="closedCurrent.type === 'single-choice' ? 'radio' : 'checkbox'"
                  :checked="selectedIds.has(opt.id)"
                  :disabled="submitted"
                  class="mt-1"
                  @change="toggleOption(opt.id)"
                >
                <span class="text-fg flex-1">{{
                  localized(opt.content, locale as 'pl' | 'en')
                }}</span>
              </label>
            </fieldset>

            <template v-else-if="current.type === 'open-ended'">
              <label for="session-answer" class="flex flex-col gap-1.5">
                <span class="text-muted text-xs">{{ t('practice.openEndedNote') }}</span>
                <textarea
                  id="session-answer"
                  v-model="userText"
                  :placeholder="t('practice.yourAnswerPlaceholder')"
                  rows="4"
                  :disabled="submitted"
                  class="bg-bg text-fg border-border focus-visible:ring-primary rounded-md border px-3 py-2 font-sans text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60"
                />
              </label>

              <div v-if="submitted" class="border-border bg-bg rounded-md border p-3">
                <p class="text-fg mb-2 text-sm font-medium">{{ t('practice.modelAnswer') }}</p>
                <p class="text-fg">{{ localized(current.modelAnswer, locale as 'pl' | 'en') }}</p>
              </div>
            </template>

            <div v-if="submitted && closedCurrent" class="border-border rounded-md border p-3">
              <p :class="['mb-2 font-medium', isCorrect ? 'text-success' : 'text-danger']">
                {{ isCorrect ? t('practice.correct') : t('practice.incorrect') }}
              </p>
              <p
                v-if="localized(current.content, locale as 'pl' | 'en').explanation"
                class="text-muted text-sm"
              >
                <strong class="text-fg">{{ t('practice.explanation') }}:</strong>
                {{ localized(current.content, locale as 'pl' | 'en').explanation }}
              </p>
            </div>

            <div
              v-else-if="
                submitted &&
                current.type === 'open-ended' &&
                localized(current.content, locale as 'pl' | 'en').explanation
              "
              class="border-border rounded-md border p-3"
            >
              <p class="text-muted text-sm">
                <strong class="text-fg">{{ t('practice.explanation') }}:</strong>
                {{ localized(current.content, locale as 'pl' | 'en').explanation }}
              </p>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end">
              <UiButton
                v-if="!submitted"
                variant="primary"
                :disabled="!canSubmit()"
                :loading="saving"
                @click="submit"
              >
                {{ current.type === 'open-ended' ? t('practice.showModel') : t('practice.submit') }}
              </UiButton>
              <UiButton v-else variant="primary" @click="next">
                {{ currentIndex + 1 < total ? t('practice.next') : t('practice.finish') }}
              </UiButton>
            </div>
          </template>
        </UiCard>
        <PracticeAssistant v-if="submitted" :question="current" :locale="currentLocale" />
      </div>
    </Transition>
  </section>
</template>
