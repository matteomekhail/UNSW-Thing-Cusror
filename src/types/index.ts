export type TabId = 'flashcards' | 'quiz' | 'summary'
export type Theme = 'dark' | 'light'

export interface Flashcard {
  front: string
  back: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Summary {
  bulletPoints: string[]
  keyConcepts: string[]
  connections: string[]
}

export interface AISettings {
  apiUrl: string
  apiKey: string
  model: string
}
