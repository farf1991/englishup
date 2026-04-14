// @ts-nocheck
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '0033665791697'
const WA_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour ! Je viens de créer mon compte EnglishUp. Voici mes coordonnées pour le virement.')}`

export default function PendingPage() {
  return (
    <div className="mobile-container bg-[#F8FAFF] min-h-screen flex flex-col justify-center px-6 py-12">

      <div className="text-center mb-10">
        <div className="text-6xl mb-4 animate-bounceIn">⏳</div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">
          Inscription reçue !
        </h1>
        <p className="text-gray-500 text-base leading-relaxed font-medium">
          Votre compte est créé. Il ne reste plus qu'une étape avant d'accéder au programme.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-8">
        {[
          { num: '1', icon: '✅', label: 'Compte créé', desc: 'Profil enregistré avec succès', done: true },
          { num: '2', icon: '💳', label: 'Virement — 379 DHS', desc: 'Envoyez le virement à nos coordonnées', done: false, active: true },
          { num: '3', icon: '🚀', label: 'Activation sous 24h', desc: 'Accès complet au programme', done: false },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-4 rounded-2xl p-4 border-2 transition-all
            ${s.done ? 'bg-green-50 border-green-200' : s.active ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0
              ${s.done ? 'bg-green-500 text-white' : s.active ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
              {s.done ? '✓' : s.num}
            </div>
            <div>
              <p className={`font-black text-sm ${s.done ? 'text-green-900' : s.active ? 'text-blue-900' : 'text-gray-500'}`}>{s.label}</p>
              <p className={`text-xs ${s.done ? 'text-green-700' : s.active ? 'text-blue-700' : 'text-gray-400'}`}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info virement */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
        <p className="text-sm font-black text-gray-900 mb-3">💳 Coordonnées de virement</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Montant</span>
            <span className="font-black text-gray-900">379 DHS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Bénéficiaire</span>
            <span className="font-black text-gray-900">EnglishUp SARL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">RIB</span>
            <span className="font-black text-gray-900 text-xs">XXX XXX XXX XXX</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 font-medium">Mentionnez le prénom de votre enfant en référence</p>
      </div>

      {/* WhatsApp CTA */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        className="btn-whatsapp w-full py-5 rounded-2xl text-base font-black mb-4 block text-center">
        <span>Confirmer mon virement sur WhatsApp →</span>
      </a>

      <p className="text-center text-xs text-gray-400 font-medium mb-6">
        Envoyez-nous une capture de votre virement via WhatsApp.<br/>
        Activation garantie sous 24h.
      </p>

      <LogoutButton />
    </div>
  )
}
