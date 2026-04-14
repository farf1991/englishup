// @ts-nocheck
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Child, ContentSession, QCMQuestion } from '@/types/database'

// ─── DEMO CONTENT (remplacé par DB en prod) ──────────────────
const DEMO_CONTENT: ContentSession = {
  id: 'demo',
  session_number: 1,
  level: 'explorer',
  age_group: 'adventurer',
  title: 'Present Simple & Vocabulary',
  vocab: [
    { word: 'Determined', translation: 'Déterminé(e)', example: 'She was determined to succeed.', emoji: '💪' },
    { word: 'Curious', translation: 'Curieux/se', example: 'He was curious about everything.', emoji: '🔍' },
    { word: 'Brilliant', translation: 'Brillant(e)', example: 'What a brilliant idea!', emoji: '✨' },
  ],
  grammar: {
    rule: 'Present Simple — 3ème personne',
    explanation: 'Avec he/she/it, on ajoute toujours -s ou -es au verbe. À la forme négative, on utilise "doesn\'t".',
    examples: ['She plays football every day.', 'He doesn\'t like coffee.', 'It works perfectly.'],
    questions: [
      { id: 'g1', q: 'Choose the correct sentence:', choices: ['She don\'t like cats', 'She doesn\'t like cats', 'She not like cats', 'She isn\'t like cats'], correct: 1, explanation: 'Avec "she", on utilise "doesn\'t" à la forme négative.' },
      { id: 'g2', q: 'He ___ to school every day.', choices: ['go', 'goes', 'going', 'gone'], correct: 1, explanation: 'Avec "he", on ajoute -s : "goes".' },
      { id: 'g3', q: 'They ___ football on weekends.', choices: ['plays', 'play', 'played', 'playing'], correct: 1, explanation: 'Avec "they" (pluriel), pas de -s.' },
    ],
  },
  listening: {
    transcript: 'Hi! My name is Alex. I\'m 13 years old and I live in London with my family. I love playing football and reading science fiction books. My favourite subject at school is maths, but I also enjoy English classes a lot.',
    questions: [
      { id: 'l1', q: 'How old is Alex?', choices: ['12', '13', '14', '15'], correct: 1, explanation: 'Alex says "I\'m 13 years old".' },
      { id: 'l2', q: 'What sport does Alex love?', choices: ['Tennis', 'Basketball', 'Football', 'Swimming'], correct: 2, explanation: 'Alex mentions "playing football".' },
      { id: 'l3', q: 'What is Alex\'s favourite subject?', choices: ['English', 'Science', 'History', 'Maths'], correct: 3, explanation: 'Alex says "my favourite subject is maths".' },
    ],
  },
  review_questions: [
    { id: 'r1', q: 'Complete: "I have lived here ___ 2019."', choices: ['for', 'since', 'during', 'ago'], correct: 1, explanation: '"Since" s\'utilise avec un point précis dans le temps.' },
    { id: 'r2', q: 'What is the comparative of "good"?', choices: ['Gooder', 'More good', 'Better', 'Bester'], correct: 2, explanation: '"Good" est irrégulier — son comparatif est "better".' },
    { id: 'r3', q: '"They ___ playing football now"', choices: ['is', 'are', 'am', 'be'], correct: 1, explanation: '"They" est pluriel — il prend "are" au présent continu.' },
  ],
}

type Phase = 'vocab' | 'grammar' | 'listening' | 'review' | 'done'
type QCMState = 'idle' | 'answered'

const PHASE_ORDER: Phase[] = ['vocab', 'grammar', 'listening', 'review']
const PHASE_LABELS = { vocab: '📖 Vocabulaire', grammar: '✍️ Grammaire', listening: '🎧 Listening', review: '🔁 Révision', done: '✅ Terminé' }
const PHASE_COLORS = { vocab: '#00B4D8', grammar: '#7B2FBE', listening: '#FF6B35', review: '#06D6A0', done: '#06D6A0' }

export default function SessionPage() {
  const router = useRouter()
  const supabase = createClient()

  const [child, setChild] = useState<Child | null>(null)
  const [content] = useState<ContentSession>(DEMO_CONTENT)
  const [phase, setPhase] = useState<Phase>('vocab')
  const [vocabIdx, setVocabIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [grammarStep, setGrammarStep] = useState<'rule' | 'qcm'>('rule')
  const [listeningStep, setListeningStep] = useState<'read' | 'qcm'>('read')
  const [selected, setSelected] = useState<number | null>(null)
  const [qcmState, setQcmState] = useState<QCMState>('idle')
  const [xp, setXp] = useState(0)
  const [score, setScore] = useState(0)
  const [totalQ, setTotalQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(1200) // 20 min
  const [sessionStart] = useState(Date.now())
  const [wrongQuestions, setWrongQuestions] = useState<QCMQuestion[]>([])

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  // Load child data
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: parent } = await supabase.from('parents').select('id').eq('auth_id', user.id).single()
      if (!parent) return
      const { data: childData } = await supabase.from('children').select('*').eq('parent_id', parent.id).eq('status', 'active').single()
      if (childData) setChild(childData)
    }
    load()
  }, [])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  function phaseIndex(p: Phase) { return PHASE_ORDER.indexOf(p) }
  const currentPhaseIdx = phaseIndex(phase)

  // ── Handles QCM answer ──
  function handleAnswer(idx: number, questions: QCMQuestion[]) {
    if (qcmState === 'answered') return
    const q = questions[qIdx]
    setSelected(idx)
    setQcmState('answered')
    setTotalQ(t => t + 1)
    if (idx === q.correct) {
      setScore(s => s + 1)
      setXp(x => x + 15)
    } else {
      setWrongQuestions(w => [...w, q])
    }
  }

  // ── Next after "J'ai compris" ──
  function handleNext(questions: QCMQuestion[], onDone: () => void) {
    setSelected(null)
    setQcmState('idle')
    if (qIdx + 1 < questions.length) {
      setQIdx(q => q + 1)
    } else {
      setQIdx(0)
      onDone()
    }
  }

  function nextPhase() {
    const idx = phaseIndex(phase)
    if (idx + 1 < PHASE_ORDER.length) {
      setPhase(PHASE_ORDER[idx + 1])
    } else {
      setPhase('done')
    }
  }

  // ── Save session to DB ──
  async function saveSession() {
    if (!child) return
    const duration = Math.floor((Date.now() - sessionStart) / 1000)
    await supabase.from('sessions').insert({
      child_id: child.id,
      session_number: child.current_session + 1,
      session_type: 'regular',
      score,
      total_questions: totalQ,
      xp_earned: xp + 50,
      duration_sec: duration,
      phases_done: ['vocab', 'grammar', 'listening', 'review'],
    })
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="mobile-container min-h-screen bg-[#F0FBFF]" style={{ fontFamily: 'var(--font-nunito)' }}>

      {/* Session top bar */}
      <div className="bg-white shadow-sm px-5 py-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-sm font-black text-gray-900">
              {child ? `Session #${(child.current_session || 0) + 1} · ${child.first_name}` : 'Session de cours'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#00B4D8] text-white text-xs font-black px-3 py-1 rounded-full">⚡ {xp} XP</span>
            <span className="bg-red-50 border border-red-200 text-red-600 text-xs font-black px-3 py-1.5 rounded-xl">
              ⏱ {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        {/* Phase progress bars */}
        <div className="flex gap-1.5">
          {PHASE_ORDER.map((p, i) => (
            <div key={p} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: i < currentPhaseIdx ? '100%' : i === currentPhaseIdx ? '60%' : '0%', background: PHASE_COLORS[p] }} />
            </div>
          ))}
        </div>
        <div className="text-xs font-black mt-1.5" style={{ color: PHASE_COLORS[phase] || '#6B7280' }}>
          {PHASE_LABELS[phase]}
        </div>
      </div>

      <div className="px-5 py-5 pb-10">

        {/* ═══════════════════════════════════════
            PHASE: VOCABULAIRE
        ═══════════════════════════════════════ */}
        {phase === 'vocab' && vocabIdx < content.vocab.length && (
          <div className="animate-fadeUp">
            <div className="text-center mb-3">
              <span className="text-xs text-gray-400 font-bold">{vocabIdx + 1} / {content.vocab.length} mots</span>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm text-center mb-5">
              <div className="text-6xl mb-5">{content.vocab[vocabIdx].emoji}</div>
              <div className="text-4xl font-black text-gray-900 mb-2">{content.vocab[vocabIdx].word}</div>
              <div className="text-xl font-bold text-[#00B4D8] mb-4">{content.vocab[vocabIdx].translation}</div>
              <div className="bg-[#E0F7FF] rounded-2xl px-5 py-4">
                <p className="text-sm italic text-gray-600 font-medium">"{content.vocab[vocabIdx].example}"</p>
              </div>
            </div>
            <button onClick={() => {
              setXp(x => x + 10)
              if (vocabIdx + 1 < content.vocab.length) setVocabIdx(v => v + 1)
              else nextPhase()
            }}
              className="w-full py-5 bg-gradient-to-r from-[#00B4D8] to-[#06D6A0] rounded-2xl text-white text-lg font-black shadow-lg">
              J'ai appris ce mot ! ✓ (+10 XP)
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE: GRAMMAIRE — Règle
        ═══════════════════════════════════════ */}
        {phase === 'grammar' && grammarStep === 'rule' && (
          <div className="animate-fadeUp">
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-5">
              <div className="text-xs font-black text-[#7B2FBE] uppercase tracking-widest mb-3">📌 Règle du jour</div>
              <h2 className="text-xl font-black text-gray-900 mb-3">{content.grammar.rule}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{content.grammar.explanation}</p>
              {content.grammar.examples.map((ex, i) => (
                <div key={i} className="bg-purple-50 rounded-xl px-4 py-3 mb-2 text-sm font-bold text-purple-900">
                  → {ex}
                </div>
              ))}
            </div>
            <button onClick={() => setGrammarStep('qcm')}
              className="w-full py-5 bg-gradient-to-r from-[#7B2FBE] to-[#00B4D8] rounded-2xl text-white text-lg font-black shadow-lg">
              Mettre en pratique →
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE: GRAMMAIRE — QCM
        ═══════════════════════════════════════ */}
        {phase === 'grammar' && grammarStep === 'qcm' && (
          <QCMBlock
            questions={content.grammar.questions}
            qIdx={qIdx}
            selected={selected}
            qcmState={qcmState}
            onAnswer={(i) => handleAnswer(i, content.grammar.questions)}
            onNext={() => handleNext(content.grammar.questions, () => { setGrammarStep('rule'); nextPhase() })}
            accentColor="#7B2FBE"
            xp={xp}
          />
        )}

        {/* ═══════════════════════════════════════
            PHASE: LISTENING — Transcript
        ═══════════════════════════════════════ */}
        {phase === 'listening' && listeningStep === 'read' && (
          <div className="animate-fadeUp">
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎧</span>
                <div>
                  <div className="text-xs font-black text-[#FF6B35] uppercase tracking-widest">Transcript audio</div>
                  <div className="text-sm text-gray-500 font-medium">Lis attentivement, tu répondras ensuite</div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl px-5 py-4">
                <p className="text-sm text-gray-700 leading-relaxed italic">"{content.listening.transcript}"</p>
              </div>
            </div>
            <button onClick={() => setListeningStep('qcm')}
              className="w-full py-5 bg-gradient-to-r from-[#FF6B35] to-[#FFD93D] rounded-2xl text-gray-900 text-lg font-black shadow-lg">
              Répondre aux questions →
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════
            PHASE: LISTENING — QCM
        ═══════════════════════════════════════ */}
        {phase === 'listening' && listeningStep === 'qcm' && (
          <QCMBlock
            questions={content.listening.questions}
            qIdx={qIdx}
            selected={selected}
            qcmState={qcmState}
            onAnswer={(i) => handleAnswer(i, content.listening.questions)}
            onNext={() => handleNext(content.listening.questions, () => { setListeningStep('read'); nextPhase() })}
            accentColor="#FF6B35"
            xp={xp}
          />
        )}

        {/* ═══════════════════════════════════════
            PHASE: RÉVISION — QCM
        ═══════════════════════════════════════ */}
        {phase === 'review' && (
          <QCMBlock
            questions={content.review_questions}
            qIdx={qIdx}
            selected={selected}
            qcmState={qcmState}
            onAnswer={(i) => handleAnswer(i, content.review_questions)}
            onNext={() => handleNext(content.review_questions, async () => {
              await saveSession()
              setPhase('done')
            })}
            accentColor="#06D6A0"
            xp={xp}
          />
        )}

        {/* ═══════════════════════════════════════
            PHASE: DONE
        ═══════════════════════════════════════ */}
        {phase === 'done' && (
          <SessionDone
            xp={xp + 50}
            score={score}
            totalQ={totalQ}
            child={child}
            onDashboard={() => router.push('/dashboard')}
          />
        )}

      </div>
    </div>
  )
}

// ─── QCM BLOCK COMPONENT ─────────────────────────────────────
function QCMBlock({ questions, qIdx, selected, qcmState, onAnswer, onNext, accentColor, xp }: {
  questions: QCMQuestion[]
  qIdx: number
  selected: number | null
  qcmState: QCMState
  onAnswer: (i: number) => void
  onNext: () => void
  accentColor: string
  xp: number
}) {
  const q = questions[qIdx]
  const isAnswered = qcmState === 'answered'
  const isCorrect = selected === q.correct

  return (
    <div className="animate-fadeUp">
      <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-400">
        <span>Question {qIdx + 1}/{questions.length}</span>
        <span style={{ color: accentColor }}>+15 XP si correct</span>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
        <p className="text-lg font-black text-gray-900 leading-snug">{q.q}</p>
      </div>

      <div className="space-y-3 mb-4">
        {q.choices.map((c, i) => {
          let style = 'bg-white border-gray-200 text-gray-800'
          if (isAnswered) {
            if (i === q.correct) style = 'bg-green-50 border-green-400 text-green-900'
            else if (i === selected) style = 'bg-red-50 border-red-400 text-red-900'
            else style = 'bg-white border-gray-200 text-gray-400 opacity-60'
          }
          return (
            <button key={i} onClick={() => onAnswer(i)} disabled={isAnswered}
              className={`w-full px-4 py-4 rounded-2xl border-2 font-bold text-sm text-left flex items-center gap-3 transition-all ${style}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all
                ${isAnswered && i === q.correct ? 'bg-green-500 text-white'
                  : isAnswered && i === selected ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-500'}`}>
                {isAnswered && i === q.correct ? '✓' : isAnswered && i === selected ? '✗' : String.fromCharCode(65 + i)}
              </span>
              {c}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className="animate-fadeIn mb-4">
          <div className={`rounded-2xl p-4 mb-3 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            <p className={`text-sm font-black mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? '✅ Bonne réponse ! +15 XP' : `❌ Pas tout à fait...`}
            </p>
            {!isCorrect && (
              <p className="text-sm text-green-800 font-bold mb-2">
                Bonne réponse : <span className="font-black">"{q.choices[q.correct]}"</span>
              </p>
            )}
            <div className="bg-blue-50 rounded-xl px-3 py-2 mt-2">
              <p className="text-xs text-blue-800 font-semibold">💡 {q.explanation}</p>
            </div>
          </div>

          <button onClick={onNext}
            className="w-full py-4 rounded-2xl text-white font-black text-base shadow-lg transition-all active:scale-98"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #00B4D8)` }}>
            {qIdx + 1 < questions.length ? "J'ai compris → Question suivante" : "J'ai compris → Phase suivante"}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── SESSION DONE COMPONENT ──────────────────────────────────
function SessionDone({ xp, score, totalQ, child, onDashboard }: {
  xp: number
  score: number
  totalQ: number
  child: Child | null
  onDashboard: () => void
}) {
  const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0

  return (
    <div className="text-center animate-bounceIn pt-4">
      <div className="text-7xl mb-4">🎉</div>
      <h2 className="text-3xl font-black text-gray-900 mb-2">Session terminée !</h2>
      <p className="text-gray-500 font-semibold mb-6">
        {child ? `Bravo ${child.first_name} !` : 'Excellent travail !'}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: 'XP gagnés', value: `+${xp}`, icon: '⚡', color: '#00B4D8' },
          { label: 'Score', value: `${pct}%`, icon: '🎯', color: pct >= 70 ? '#06D6A0' : '#FF6B35' },
          { label: 'Bonnes réponses', value: `${score}/${totalQ}`, icon: '✅', color: '#52B788' },
          { label: 'Streak', value: `${(child?.streak || 0) + 1} 🔥`, icon: '', color: '#FF6B35' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Motivational message */}
      <div className={`rounded-2xl p-4 mb-6 ${pct >= 80 ? 'bg-green-50 border-2 border-green-200' : pct >= 60 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-orange-50 border-2 border-orange-200'}`}>
        <p className="font-black text-sm">
          {pct >= 80 ? '🌟 Excellent ! Continue comme ça !' : pct >= 60 ? '👍 Bien ! Encore un peu de pratique et tu maîtriseras !' : '💪 C\'est en pratiquant qu\'on progresse. Reviens demain !'}
        </p>
      </div>

      <button onClick={onDashboard}
        className="w-full py-5 bg-gradient-to-r from-[#00B4D8] to-[#7B2FBE] rounded-2xl text-white text-lg font-black shadow-lg">
        Voir mes progrès →
      </button>
    </div>
  )
}
