'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { generateBilanPDF } from '@/lib/pdf-report'
import type { Child } from '@/types/database'

// Questions du test bilan (30 questions couvrant tout le contenu)
const BILAN_QUESTIONS = [
  // Grammaire — tenses
  { id:'b1', q:'Choose the correct sentence:', choices:['She don\'t like coffee','She doesn\'t like coffee','She not like coffee','She isn\'t like coffee'], correct:1, explanation:'3ème personne singulier : doesn\'t.' },
  { id:'b2', q:'I ___ (go) to Paris last year.', choices:['go','goes','went','have gone'], correct:2, explanation:'Last year = passé → went (irrégulier).' },
  { id:'b3', q:'They ___ (study) right now. Look!', choices:['study','studies','are studying','is studying'], correct:2, explanation:'Action en cours → Present Continuous.' },
  { id:'b4', q:'If I ___ (be) rich, I would travel the world.', choices:['am','is','was','were'], correct:3, explanation:'Conditionnel Type 2 → IF + WERE.' },
  { id:'b5', q:'She ___ (already/finish) her homework.', choices:['already finished','has already finished','is already finishing','had already finished'], correct:1, explanation:'Already + résultat actuel → Present Perfect.' },
  // Vocabulaire
  { id:'b6', q:'What does "resilient" mean?', choices:['Fragile','Qui rebondit/résistant','Curieux','Ambitieux'], correct:1, explanation:'Resilient = capable de surmonter les difficultés.' },
  { id:'b7', q:'"Ubiquitous" is closest in meaning to:', choices:['Rare','Unique','Everywhere','Invisible'], correct:2, explanation:'Ubiquitous = présent partout, omniprésent.' },
  { id:'b8', q:'Choose the correct word: He made a ___ decision.', choices:['consequence','consequently','consequent','consequential'], correct:3, explanation:'Avant un nom → adjectif : consequential.' },
  { id:'b9', q:'"Albeit" is a synonym of:', choices:['Therefore','Although','Furthermore','Meanwhile'], correct:1, explanation:'Albeit = although = bien que.' },
  { id:'b10', q:'The project was ___ (faisable).', choices:['feasible','feasibility','feasibly','unfeasible'], correct:0, explanation:'Feasible = faisable (adjectif).' },
  // Articles et déterminants
  { id:'b11', q:'I saw ___ interesting film yesterday.', choices:['a','an','the','some'], correct:1, explanation:'Interesting commence par une voyelle → AN.' },
  { id:'b12', q:'___ Nile is the longest river in the world.', choices:['A','An','The','—'], correct:2, explanation:'Rivière unique connue → THE.' },
  // Prépositions
  { id:'b13', q:'She arrived ___ Monday morning.', choices:['in','on','at','by'], correct:1, explanation:'Jours de la semaine → ON Monday.' },
  { id:'b14', q:'I\'ve been waiting ___ two hours.', choices:['since','for','during','ago'], correct:1, explanation:'Durée → FOR two hours.' },
  { id:'b15', q:'He\'s good ___ mathematics.', choices:['in','for','on','at'], correct:3, explanation:'Good at = doué en (+ compétence).' },
  // Comparatifs/Superlatifs
  { id:'b16', q:'This is ___ (good) film I\'ve ever seen.', choices:['better','more good','the best','the goodest'], correct:2, explanation:'Superlatif de good → THE BEST.' },
  { id:'b17', q:'She is ___ than her sister. (tall)', choices:['more tall','taller','tallest','the taller'], correct:1, explanation:'Comparatif de supériorité, adjectif court → -ER.' },
  // Passif
  { id:'b18', q:'The book ___ (write) by Shakespeare.', choices:['wrote','was written','is writing','has written'], correct:1, explanation:'Passif au passé → WAS + past participle.' },
  { id:'b19', q:'English ___ (speak) all over the world.', choices:['speaks','is speaking','is spoken','has spoken'], correct:2, explanation:'Passif au présent → IS + past participle.' },
  // Questions
  { id:'b20', q:'___ did you go last summer?', choices:['Where','What','Which','How'], correct:0, explanation:'Pour un lieu → WHERE.' },
  { id:'b21', q:'___ long have you lived here?', choices:['What','Which','How','Where'], correct:2, explanation:'Pour une durée → HOW long.' },
  // Modaux
  { id:'b22', q:'You ___ smoke here. It\'s forbidden.', choices:['mustn\'t','don\'t have to','couldn\'t','shouldn\'t'], correct:0, explanation:'Interdiction absolue → MUSTN\'T.' },
  { id:'b23', q:'You ___ bring anything. I\'ve got everything.', choices:['mustn\'t','don\'t have to','can\'t','shouldn\'t'], correct:1, explanation:'Pas obligatoire → DON\'T HAVE TO.' },
  // Reported Speech
  { id:'b24', q:'"I am tired." → He said he ___ tired.', choices:['is','was','were','has been'], correct:1, explanation:'Discours indirect : am → WAS (recul temporel).' },
  { id:'b25', q:'"I will help." → She said she ___ help.', choices:['will','would','should','could'], correct:1, explanation:'Will → WOULD au discours indirect.' },
  // Linking words
  { id:'b26', q:'I wanted to come; ___, I was too tired.', choices:['moreover','however','therefore','besides'], correct:1, explanation:'Contraste → HOWEVER (cependant).' },
  { id:'b27', q:'She studied hard; ___, she passed the exam.', choices:['however','although','consequently','unless'], correct:2, explanation:'Conséquence → CONSEQUENTLY (par conséquent).' },
  // Lecture
  { id:'b28', q:'The word "perceive" is closest in meaning to:', choices:['Ignore','Understand/Notice','Forget','Create'], correct:1, explanation:'Perceive = percevoir, remarquer, comprendre.' },
  // Vocabulaire avancé
  { id:'b29', q:'Choose the correct verb form: "I suggest he ___ present."', choices:['is','be','was','were'], correct:1, explanation:'Subjonctif après suggest → BE.' },
  { id:'b30', q:'Which sentence is grammatically correct?', choices:['Between you and I','Between you and myself','Between you and me','Between I and you'], correct:2, explanation:'Après une préposition → pronom COI : ME (pas I).' },
]

export default function BilanPage() {
  const router = useRouter()
  const supabase = createClient()
  const [child, setChild] = useState<Child | null>(null)
  const [bilanNumber, setBilanNumber] = useState<1|2>(1)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: parent } = await supabase.from('parents').select('id').eq('auth_id', user.id).single()
      if (!parent) return
      const { data: childData } = await supabase.from('children').select('*').eq('parent_id', parent.id).eq('status', 'active').single()
      if (childData) {
        setChild(childData)
        setBilanNumber(childData.current_session >= 30 && childData.current_session < 60 ? 1 : 2)
      }
    }
    load()
  }, [])

  const q = BILAN_QUESTIONS[current]
  const pct = BILAN_QUESTIONS.length > 0 ? Math.round((current / BILAN_QUESTIONS.length) * 100) : 0

  function handleAnswer(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const isCorrect = idx === q.correct
    if (isCorrect) setScore(s => s + 1)
    setAnswers(a => [...a, isCorrect])
  }

  async function handleNext() {
    if (current + 1 < BILAN_QUESTIONS.length) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      // Bilan terminé — sauvegarder
      setSaving(true)
      const finalScore = score + (selected === q.correct && !answers[current] ? 1 : 0)
      const scorePct = Math.round((finalScore / BILAN_QUESTIONS.length) * 100)

      if (child) {
        await supabase.from('bilan_results').insert({
          child_id: child.id,
          bilan_number: bilanNumber,
          score: finalScore,
          total_questions: BILAN_QUESTIONS.length,
          score_pct: scorePct,
          level_before: child.english_level,
          level_after: scorePct >= 80 ? 'champion' : scorePct >= 55 ? 'explorer' : 'starter',
        })
      }
      setSaving(false)
      setDone(true)
    }
  }

  if (done && child) {
    const finalScore = answers.filter(Boolean).length
    const scorePct = Math.round((finalScore / BILAN_QUESTIONS.length) * 100)
    const mention = scorePct >= 80 ? { text: 'Excellent ! 🌟', color: '#06D6A0' } : scorePct >= 70 ? { text: 'Bien ! 👍', color: '#00B4D8' } : scorePct >= 60 ? { text: 'Satisfaisant ✓', color: '#FFD93D' } : { text: 'À améliorer 💪', color: '#FF6B35' }

    return (
      <div className="mobile-container min-h-screen bg-[#F0FBFF] px-5 py-8 flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-4" style={{ animation: 'bounceIn 0.6s ease' }}>🏆</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Test Bilan {bilanNumber} terminé !</h1>
        <p className="text-gray-500 mb-6 font-semibold">Bravo {child.first_name} !</p>

        <div className="bg-white rounded-3xl p-6 shadow-sm w-full mb-6">
          <div className="text-5xl font-black mb-1" style={{ color: mention.color }}>{scorePct}%</div>
          <div className="text-lg font-black" style={{ color: mention.color }}>{mention.text}</div>
          <div className="text-sm text-gray-500 mt-1">{finalScore}/{BILAN_QUESTIONS.length} bonnes réponses</div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mt-4">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${scorePct}%`, background: mention.color }} />
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 w-full flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div className="text-left">
            <p className="font-black text-amber-900 text-sm">Rapport PDF disponible</p>
            <p className="text-xs text-amber-700">Téléchargez et partagez avec vos parents</p>
          </div>
        </div>

        <button
          onClick={() => generateBilanPDF({ child, bilan: { id: '', child_id: child.id, bilan_number: bilanNumber as 1|2, score: finalScore, total_questions: BILAN_QUESTIONS.length, score_pct: scorePct, level_before: child.english_level, level_after: scorePct >= 80 ? 'champion' : 'explorer', report_url: null, report_sent_at: null, completed_at: new Date().toISOString() }, sessions: [], parentEmail: '' })}
          className="w-full py-4 rounded-2xl text-gray-900 font-black mb-3"
          style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B35)' }}>
          📄 Télécharger mon rapport PDF
        </button>

        <button onClick={() => router.push('/dashboard')}
          className="w-full py-4 rounded-2xl text-white font-black"
          style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)' }}>
          Retour au tableau de bord →
        </button>
      </div>
    )
  }

  return (
    <div className="mobile-container min-h-screen bg-[#FFFBF5]" style={{ fontFamily: 'var(--font-nunito)' }}>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFD93D] to-[#FF6B35] px-5 py-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-xs font-black text-orange-900 uppercase tracking-wide">🧪 Test Bilan {bilanNumber}</div>
            <div className="text-sm font-black text-gray-900">{current + 1}/{BILAN_QUESTIONS.length} questions</div>
          </div>
          <div className="bg-white/80 rounded-xl px-3 py-1.5 text-sm font-black text-orange-700">
            ✓ {score} pts
          </div>
        </div>
        <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="px-5 py-5 pb-10">
        {/* Question */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4" key={current}>
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Question {current + 1}</div>
          <p className="text-lg font-black text-gray-900 leading-snug">{q.q}</p>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-4">
          {q.choices.map((c, i) => {
            let style = 'bg-white border-gray-200 text-gray-800'
            if (answered) {
              if (i === q.correct) style = 'bg-green-50 border-green-400 text-green-900'
              else if (i === selected && i !== q.correct) style = 'bg-red-50 border-red-400 text-red-900'
              else style = 'bg-white border-gray-200 text-gray-400 opacity-50'
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                className={`w-full px-4 py-4 rounded-2xl border-2 font-bold text-sm text-left flex items-center gap-3 transition-all ${style}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                  ${answered && i === q.correct ? 'bg-green-500 text-white' : answered && i === selected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {answered && i === q.correct ? '✓' : answered && i === selected && i !== q.correct ? '✗' : String.fromCharCode(65 + i)}
                </span>
                {c}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div className="animate-fadeIn">
            <div className={`rounded-2xl p-4 mb-4 ${selected === q.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
              <p className={`font-black text-sm mb-2 ${selected === q.correct ? 'text-green-800' : 'text-red-800'}`}>
                {selected === q.correct ? '✅ Correct !' : `❌ Incorrect — Bonne réponse : "${q.choices[q.correct]}"`}
              </p>
              <div className="bg-blue-50 rounded-xl px-3 py-2">
                <p className="text-xs text-blue-800 font-semibold">💡 {q.explanation}</p>
              </div>
            </div>
            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl text-white font-black text-base"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #FFD93D)', color: '#1B1B1B' }}>
              {current + 1 < BILAN_QUESTIONS.length ? "J'ai compris → Question suivante" : "Voir mes résultats 🏆"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
