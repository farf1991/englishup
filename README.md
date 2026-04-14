# 🌍 EnglishUp — App complète v3

Programme anglais enfants 6–16 ans · Next.js 14 + Supabase · Virement manuel · PWA

---

## 🚀 Setup

```bash
cp .env.example .env.local   # remplis les valeurs
npm install
npm run dev                  # http://localhost:3000
```

## Supabase
1. supabase.com → New project
2. SQL Editor → `supabase_schema.sql` → Run
3. SQL Editor → `content_sessions_seed.sql` → Run
4. Settings → API → copie les 3 clés dans .env.local

## Variables d'environnement (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=0033665791697
ADMIN_EMAIL=ton@email.com
CRON_SECRET=secret_32_chars
# Optionnel SMS:
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Pages
- `/` — Landing + démo
- `/auth/register` — Inscription
- `/auth/login` — Connexion
- `/dashboard` — Dashboard parent
- `/dashboard/pending` — Attente virement
- `/session` — Session 20 min
- `/bilan` — Test bilan (30 questions)
- `/child` — Profil détaillé + historique
- `/admin` — Panel admin global
- `/admin/enrollments` — Activer les comptes
- `/admin/students` — Tableau des élèves

## Déploiement Vercel
```bash
git add . && git commit -m "EnglishUp v3" && git push
# Sur vercel.com → Import → Add env vars → Deploy
```

## PWA — Icônes
Génère les icônes sur realfavicongenerator.net :
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
