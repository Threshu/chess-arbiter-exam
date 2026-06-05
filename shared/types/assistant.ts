export interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

export interface QuestionContext {
  stem: string
  explanation?: string
  correctAnswer?: string
  type: string
}

export interface AskRequest {
  messages: ChatMessage[]
  questionContext?: QuestionContext
  locale: 'pl' | 'en'
}

export interface AskResponse {
  reply: string
}

export interface KnowledgeItem {
  title: { pl: string; en: string }
  content: { pl: string; en: string }
  source: string
  tags: string[]
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}
