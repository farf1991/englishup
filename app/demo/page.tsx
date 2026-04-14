// @ts-nocheck
import Link from 'next/link'

// La démo est une page statique qui redirige vers la landing
// Le composant React de démo (EnglishUp.jsx) est intégré séparément

export default function DemoPage() {
  return (
    <div className="mobile-container min-h-screen bg-[#F0FBFF] flex flex-col items-center justify-center px-6 py-12 text-center"
      style={{ fontFamily: 'var(--font-nunito)' }}>
      <div className="text-6xl mb-4">🎭</div>
      <h1 className="text-2xl font-black text-gray-900 mb-3">Démo interactive</h1>
      <p className="text-gray-500 mb-8 font-medium leading-relaxed">
        Découvrez EnglishUp avec le profil d'Emma, 11 ans.<br/>
        Test de niveau · Session de cours · Dashboard parent.
      </p>
      <Link href="/auth/register"
        className="w-full max-w-sm block text-center py-5 rounded-2xl text-lg font-black text-gray-900 shadow-xl mb-3"
        style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B35)' }}>
        Inscrire mon enfant →
      </Link>
      <Link href="/" className="text-sm text-gray-400 font-semibold">← Retour à l'accueil</Link>
    </div>
  )
}
