// ============================================================
// ENGLISHUP — TypeScript Types
// ============================================================

export type AgeGroup = 'explorer' | 'adventurer' | 'champion'
export type EnglishLevel = 'starter' | 'explorer' | 'champion'
export type ChildStatus = 'pending' | 'active' | 'completed' | 'expired'
export type PaymentStatus = 'pending' | 'received' | 'confirmed'
export type NotifType = 'missed_session' | 'bilan_ready' | 'activation' | 'welcome'

export interface Parent {
  id: string
  email: string
  phone: string
  first_name: string | null
  created_at: string
  auth_id: string | null
}

export interface Child {
  id: string
  parent_id: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'boy' | 'girl'
  school: string
  grade: string
  age_group: AgeGroup
  english_level: EnglishLevel
  status: ChildStatus
  current_session: number
  total_xp: number
  streak: number
  last_session_at: string | null
  activated_at: string | null
  created_at: string
}

export interface Enrollment {
  id: string
  child_id: string
  parent_id: string
  payment_status: PaymentStatus
  amount_dhs: number
  admin_notes: string | null
  activated_by: string | null
  activated_at: string | null
  created_at: string
}

export interface Session {
  id: string
  child_id: string
  session_number: number
  session_type: 'regular' | 'bilan'
  score: number
  total_questions: number
  xp_earned: number
  duration_sec: number
  phases_done: string[]
  completed_at: string
}

export interface BilanResult {
  id: string
  child_id: string
  bilan_number: 1 | 2
  score: number
  total_questions: number
  score_pct: number
  level_before: string | null
  level_after: string | null
  report_url: string | null
  report_sent_at: string | null
  completed_at: string
}

export interface ContentSession {
  id: string
  session_number: number
  level: EnglishLevel
  age_group: AgeGroup
  title: string
  vocab: VocabItem[]
  grammar: GrammarContent
  listening: ListeningContent
  review_questions: QCMQuestion[]
}

export interface VocabItem {
  word: string
  translation: string
  example: string
  emoji: string
}

export interface QCMQuestion {
  id: string
  q: string
  choices: string[]
  correct: number
  explanation: string
}

export interface GrammarContent {
  rule: string
  explanation: string
  examples: string[]
  questions: QCMQuestion[]
}

export interface ListeningContent {
  transcript: string
  questions: QCMQuestion[]
}

// ─── Dashboard parent ────────────────────────────────────────
export interface ParentDashboardData {
  child: Child
  enrollment: Enrollment
  sessions: Session[]
  bilan_results: BilanResult[]
  // calculés côté client
  completion_pct: number
  sessions_this_week: number
  avg_score: number
  missed_days: number
}

// ─── Supabase Database type (pour le client typé) ────────────
export type Database = {
  public: {
    Tables: {
      parents: { Row: Parent; Insert: Partial<Parent>; Update: Partial<Parent> }
      children: { Row: Child; Insert: Partial<Child>; Update: Partial<Child> }
      enrollments: { Row: Enrollment; Insert: Partial<Enrollment>; Update: Partial<Enrollment> }
      sessions: { Row: Session; Insert: Partial<Session>; Update: Partial<Session> }
      bilan_results: { Row: BilanResult; Insert: Partial<BilanResult>; Update: Partial<BilanResult> }
      content_sessions: { Row: ContentSession; Insert: Partial<ContentSession>; Update: Partial<ContentSession> }
    }
  }
}
