// @ts-nocheck
'use client'

import jsPDF from 'jspdf'
import type { Child, BilanResult, Session } from '@/types/database'

interface BilanReportData {
  child: Child
  bilan: BilanResult
  sessions: Session[]
  parentEmail: string
}

// ─── Générer le PDF du rapport bilan ────────────────────────
export function generateBilanPDF(data: BilanReportData): void {
  const { child, bilan, sessions } = data
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210 // largeur A4
  const MARGIN = 20
  let y = MARGIN

  // ── Helpers ──
  const line = (x1: number, y1: number, x2: number, y2: number, color = [0, 180, 216]) => {
    doc.setDrawColor(color[0], color[1], color[2])
    doc.line(x1, y1, x2, y2)
  }
  const rect = (x: number, yy: number, w: number, h: number, r: number, color: number[]) => {
    doc.setFillColor(color[0], color[1], color[2])
    doc.roundedRect(x, yy, w, h, r, r, 'F')
  }
  const text = (txt: string, x: number, yy: number, opts?: { size?: number; bold?: boolean; color?: number[]; align?: 'center'|'left'|'right' }) => {
    doc.setFontSize(opts?.size || 11)
    doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal')
    if (opts?.color) doc.setTextColor(opts.color[0], opts.color[1], opts.color[2])
    else doc.setTextColor(30, 30, 30)
    doc.text(txt, x, yy, { align: opts?.align || 'left' })
  }

  // ── HEADER ──
  rect(0, 0, W, 50, 0, [4, 13, 26])

  // Logo
  text('🌍 EnglishUp', MARGIN, 18, { size: 22, bold: true, color: [255, 255, 255] })
  text('Programme anglais · 6–16 ans', MARGIN, 27, { size: 10, color: [147, 197, 253] })

  // Rapport info
  text(`RAPPORT DE PROGRESSION`, W - MARGIN, 18, { size: 10, bold: true, color: [255, 217, 61], align: 'right' })
  text(`Test Bilan #${bilan.bilan_number}`, W - MARGIN, 26, { size: 16, bold: true, color: [255, 255, 255], align: 'right' })
  text(new Date(bilan.completed_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    W - MARGIN, 34, { size: 9, color: [147, 197, 253], align: 'right' })

  y = 65

  // ── PROFIL ENFANT ──
  text('PROFIL DE L\'ÉLÈVE', MARGIN, y, { size: 8, bold: true, color: [100, 100, 100] })
  y += 6
  line(MARGIN, y, W - MARGIN, y, [230, 230, 230])
  y += 8

  const col1 = MARGIN, col2 = 80, col3 = 130
  const labelColor: number[] = [120, 120, 120]
  const valueColor: number[] = [30, 30, 30]

  text('Prénom & Nom', col1, y, { size: 9, color: labelColor })
  text(`${child.first_name} ${child.last_name}`, col2, y, { size: 9, bold: true, color: valueColor })
  text('Classe', col3, y, { size: 9, color: labelColor })
  text(child.grade, col3 + 20, y, { size: 9, bold: true, color: valueColor })
  y += 7

  text('Établissement', col1, y, { size: 9, color: labelColor })
  text(child.school, col2, y, { size: 9, bold: true, color: valueColor })
  y += 7

  text('Niveau anglais', col1, y, { size: 9, color: labelColor })
  const levelLabel = { starter: 'A1 — Débutant', explorer: 'A2/B1 — Intermédiaire', champion: 'B1/B2 — Avancé' }
  text(levelLabel[child.english_level] || child.english_level, col2, y, { size: 9, bold: true, color: [0, 180, 216] })
  y += 16

  // ── RÉSULTATS DU TEST BILAN ──
  text('RÉSULTATS DU TEST BILAN', MARGIN, y, { size: 8, bold: true, color: [100, 100, 100] })
  y += 6
  line(MARGIN, y, W - MARGIN, y, [230, 230, 230])
  y += 10

  // Score card
  const scoreColor = bilan.score_pct >= 80 ? [6, 214, 160] : bilan.score_pct >= 60 ? [0, 180, 216] : [255, 107, 53]
  rect(MARGIN, y, 50, 35, 6, [240, 252, 255])
  text('SCORE', MARGIN + 25, y + 11, { size: 8, bold: true, color: [100, 100, 100], align: 'center' })
  text(`${Math.round(bilan.score_pct)}%`, MARGIN + 25, y + 24, { size: 22, bold: true, color: scoreColor, align: 'center' })

  rect(MARGIN + 56, y, 50, 35, 6, [240, 252, 255])
  text('RÉPONSES', MARGIN + 81, y + 11, { size: 8, bold: true, color: [100, 100, 100], align: 'center' })
  text(`${bilan.score}/${bilan.total_questions}`, MARGIN + 81, y + 24, { size: 22, bold: true, color: valueColor, align: 'center' })

  rect(MARGIN + 112, y, 70, 35, 6, [240, 252, 255])
  text('MENTION', MARGIN + 147, y + 11, { size: 8, bold: true, color: [100, 100, 100], align: 'center' })
  const mention = bilan.score_pct >= 80 ? '🌟 Excellent' : bilan.score_pct >= 70 ? '👍 Bien' : bilan.score_pct >= 60 ? '✓ Satisfaisant' : '💪 À améliorer'
  text(mention, MARGIN + 147, y + 24, { size: 13, bold: true, color: scoreColor, align: 'center' })
  y += 46

  // Progression niveau
  if (bilan.level_before && bilan.level_after && bilan.level_before !== bilan.level_after) {
    rect(MARGIN, y, W - 2 * MARGIN, 14, 4, [232, 255, 243])
    text(`🎉 Niveau amélioré : ${bilan.level_before?.toUpperCase()} → ${bilan.level_after?.toUpperCase()}`, W / 2, y + 9, { size: 10, bold: true, color: [6, 100, 80], align: 'center' })
    y += 20
  }

  y += 5

  // ── PROGRESSION GLOBALE ──
  text('PROGRESSION SUR LA PÉRIODE', MARGIN, y, { size: 8, bold: true, color: [100, 100, 100] })
  y += 6
  line(MARGIN, y, W - MARGIN, y, [230, 230, 230])
  y += 10

  const sessionsInPeriod = bilan.bilan_number === 1 ? sessions.slice(0, 30) : sessions.slice(30)
  const avgScore = sessionsInPeriod.length > 0
    ? Math.round(sessionsInPeriod.reduce((a, s) => a + (s.score / Math.max(s.total_questions, 1)) * 100, 0) / sessionsInPeriod.length)
    : 0
  const totalXpPeriod = sessionsInPeriod.reduce((a, s) => a + s.xp_earned, 0)
  const completedSessions = sessionsInPeriod.length

  const stats = [
    { label: 'Sessions complétées', value: `${completedSessions}/30` },
    { label: 'Score moyen', value: `${avgScore}%` },
    { label: 'XP gagnés', value: `${totalXpPeriod.toLocaleString()} XP` },
    { label: 'Streak maximum', value: `${child.streak} jours` },
  ]

  stats.forEach((s, i) => {
    const col = i % 2 === 0 ? MARGIN : W / 2
    const rowY = y + Math.floor(i / 2) * 12
    text(`${s.label} :`, col, rowY, { size: 9, color: labelColor })
    text(s.value, col + 55, rowY, { size: 9, bold: true, color: valueColor })
  })
  y += 28

  // Mini bar chart des 10 derniers scores
  if (sessionsInPeriod.length >= 3) {
    y += 4
    text('ÉVOLUTION DES SCORES (10 dernières sessions)', MARGIN, y, { size: 8, bold: true, color: [100, 100, 100] })
    y += 8
    const chartW = W - 2 * MARGIN
    const chartH = 25
    const lastSessions = sessionsInPeriod.slice(-10)
    const barW = chartW / lastSessions.length - 3

    rect(MARGIN, y, chartW, chartH, 4, [245, 248, 255])

    lastSessions.forEach((s, i) => {
      const pct = s.total_questions > 0 ? (s.score / s.total_questions) : 0
      const barH = Math.max(1, pct * (chartH - 4))
      const x = MARGIN + i * (barW + 3) + 2
      const barColor = pct >= 0.8 ? [6, 214, 160] : pct >= 0.6 ? [0, 180, 216] : [255, 107, 53]
      rect(x, y + chartH - barH - 2, barW, barH, 1, barColor)
    })
    y += chartH + 10
  }

  // ── RECOMMANDATIONS ──
  y += 4
  text('RECOMMANDATIONS', MARGIN, y, { size: 8, bold: true, color: [100, 100, 100] })
  y += 6
  line(MARGIN, y, W - MARGIN, y, [230, 230, 230])
  y += 10

  const recommendations = bilan.score_pct >= 80
    ? ['Excellent niveau ! Encouragez votre enfant à maintenir cette régularité.', 'Proposez des activités en anglais : films, séries, livres adaptés à son niveau.', 'Votre enfant est prêt(e) pour des défis plus avancés.']
    : bilan.score_pct >= 60
    ? ['Bon travail ! La régularité est la clé du progrès en langue.', 'Revoir les points de grammaire manqués lors des sessions suivantes.', 'Encouragez votre enfant à pratiquer 5 minutes supplémentaires par jour.']
    : ['Des progrès sont visibles mais des efforts supplémentaires sont nécessaires.', 'Assurez-vous que votre enfant fait ses sessions sans distractions.', 'Contactez-nous pour adapter le programme si besoin.']

  recommendations.forEach(rec => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    const lines = doc.splitTextToSize(`• ${rec}`, W - 2 * MARGIN - 5)
    doc.text(lines, MARGIN + 3, y)
    y += lines.length * 5 + 2
  })

  y += 8

  // ── FOOTER ──
  line(MARGIN, y, W - MARGIN, y, [230, 230, 230])
  y += 8
  text('EnglishUp — Programme anglais enfants 6–16 ans', W / 2, y, { size: 8, color: [150, 150, 150], align: 'center' })
  y += 5
  text('Des questions ? WhatsApp : 0033665791697', W / 2, y, { size: 8, color: [0, 180, 216], align: 'center' })

  // ── SAUVEGARDER ──
  const filename = `EnglishUp_Bilan${bilan.bilan_number}_${child.first_name}_${child.last_name.slice(0, 1)}_${new Date().getFullYear()}.pdf`
  doc.save(filename)
}
