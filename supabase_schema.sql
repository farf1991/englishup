-- ============================================================
-- ENGLISHUP — SUPABASE DATABASE SCHEMA
-- Colle ce SQL dans Supabase > SQL Editor > Run
-- ============================================================

-- EXTENSION UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: parents
-- Un compte parent = un accès dashboard
-- ============================================================
create table public.parents (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  phone         text not null,
  first_name    text,
  created_at    timestamptz default now(),
  -- lié au compte Supabase Auth
  auth_id       uuid references auth.users(id) on delete cascade
);

-- ============================================================
-- TABLE: children
-- Un parent peut avoir plusieurs enfants
-- ============================================================
create table public.children (
  id              uuid primary key default uuid_generate_v4(),
  parent_id       uuid references public.parents(id) on delete cascade,
  first_name      text not null,
  last_name       text not null,
  date_of_birth   date not null,
  gender          text check (gender in ('boy','girl')),
  school          text not null,
  grade           text not null,
  -- calculé depuis date_of_birth
  age_group       text check (age_group in ('explorer','adventurer','champion')),
  -- niveau anglais détecté au test
  english_level   text check (english_level in ('starter','explorer','champion')) default 'starter',
  -- statut du programme
  status          text check (status in ('pending','active','completed','expired')) default 'pending',
  -- session en cours (1 à 60)
  current_session int default 0,
  -- XP total accumulé
  total_xp        int default 0,
  -- streak actuel (jours consécutifs)
  streak          int default 0,
  -- date dernière session
  last_session_at timestamptz,
  -- date activation (après virement reçu)
  activated_at    timestamptz,
  created_at      timestamptz default now()
);

-- ============================================================
-- TABLE: enrollments
-- Suivi des inscriptions et paiements (virements)
-- ============================================================
create table public.enrollments (
  id              uuid primary key default uuid_generate_v4(),
  child_id        uuid references public.children(id) on delete cascade,
  parent_id       uuid references public.parents(id) on delete cascade,
  -- statut paiement
  payment_status  text check (payment_status in ('pending','received','confirmed')) default 'pending',
  amount_dhs      numeric(10,2) default 379.00,
  -- notes admin (ex: "virement reçu le 12/04")
  admin_notes     text,
  -- qui a activé (admin)
  activated_by    text,
  activated_at    timestamptz,
  created_at      timestamptz default now()
);

-- ============================================================
-- TABLE: sessions
-- Chaque session de cours complétée par un enfant
-- ============================================================
create table public.sessions (
  id              uuid primary key default uuid_generate_v4(),
  child_id        uuid references public.children(id) on delete cascade,
  session_number  int not null,           -- 1 à 60
  session_type    text check (session_type in ('regular','bilan')) default 'regular',
  -- score QCM (bonnes réponses / total)
  score           int default 0,
  total_questions int default 0,
  xp_earned       int default 0,
  -- durée en secondes
  duration_sec    int default 0,
  -- phases complétées
  phases_done     text[] default '{}',
  completed_at    timestamptz default now()
);

-- ============================================================
-- TABLE: session_answers
-- Détail de chaque réponse QCM (pour spaced repetition)
-- ============================================================
create table public.session_answers (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid references public.sessions(id) on delete cascade,
  child_id        uuid references public.children(id) on delete cascade,
  question_id     text not null,          -- identifiant de la question
  question_text   text not null,
  correct_answer  text not null,
  given_answer    text not null,
  is_correct      boolean not null,
  -- pour spaced repetition
  needs_review    boolean default false,
  reviewed_at     timestamptz,
  created_at      timestamptz default now()
);

-- ============================================================
-- TABLE: bilan_results
-- Résultats des 2 tests bilan (session 30 et 60)
-- ============================================================
create table public.bilan_results (
  id              uuid primary key default uuid_generate_v4(),
  child_id        uuid references public.children(id) on delete cascade,
  bilan_number    int check (bilan_number in (1, 2)),  -- 1 = session 30, 2 = session 60
  score           int not null,
  total_questions int not null,
  score_pct       numeric(5,2),
  -- niveau avant/après
  level_before    text,
  level_after     text,
  -- rapport PDF généré
  report_url      text,
  report_sent_at  timestamptz,
  completed_at    timestamptz default now()
);

-- ============================================================
-- TABLE: notifications
-- Alertes SMS envoyées aux parents
-- ============================================================
create table public.notifications (
  id              uuid primary key default uuid_generate_v4(),
  parent_id       uuid references public.parents(id) on delete cascade,
  child_id        uuid references public.children(id) on delete cascade,
  type            text check (type in ('missed_session','bilan_ready','activation','welcome')),
  message         text not null,
  sent_at         timestamptz default now(),
  status          text check (status in ('sent','failed')) default 'sent'
);

-- ============================================================
-- TABLE: content_sessions
-- Le contenu réel des 60 sessions (rempli par admin)
-- ============================================================
create table public.content_sessions (
  id              uuid primary key default uuid_generate_v4(),
  session_number  int not null,           -- 1 à 60
  level           text check (level in ('starter','explorer','champion')) not null,
  age_group       text check (age_group in ('explorer','adventurer','champion')) not null,
  title           text not null,
  -- Vocab (JSON array de mots)
  vocab           jsonb default '[]',
  -- Grammaire (règle + questions QCM)
  grammar         jsonb default '{}',
  -- Listening (transcript + questions)
  listening       jsonb default '{}',
  -- Questions de révision
  review_questions jsonb default '[]',
  created_at      timestamptz default now(),
  unique(session_number, level, age_group)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.parents enable row level security;
alter table public.children enable row level security;
alter table public.enrollments enable row level security;
alter table public.sessions enable row level security;
alter table public.session_answers enable row level security;
alter table public.bilan_results enable row level security;
alter table public.notifications enable row level security;
alter table public.content_sessions enable row level security;

-- Parents voient seulement leurs propres données
create policy "parents_own" on public.parents
  for all using (auth.uid() = auth_id);

create policy "children_own" on public.children
  for all using (
    parent_id in (select id from public.parents where auth_id = auth.uid())
  );

create policy "sessions_own" on public.sessions
  for all using (
    child_id in (
      select c.id from public.children c
      join public.parents p on c.parent_id = p.id
      where p.auth_id = auth.uid()
    )
  );

create policy "answers_own" on public.session_answers
  for all using (
    child_id in (
      select c.id from public.children c
      join public.parents p on c.parent_id = p.id
      where p.auth_id = auth.uid()
    )
  );

create policy "bilan_own" on public.bilan_results
  for all using (
    child_id in (
      select c.id from public.children c
      join public.parents p on c.parent_id = p.id
      where p.auth_id = auth.uid()
    )
  );

create policy "content_public_read" on public.content_sessions
  for select using (true);

-- ============================================================
-- FONCTION: calculer age_group depuis date_of_birth
-- ============================================================
create or replace function public.get_age_group(dob date)
returns text language plpgsql as $$
declare
  age int;
begin
  age := extract(year from age(dob));
  if age between 6 and 9 then return 'explorer';
  elsif age between 10 and 13 then return 'adventurer';
  elsif age between 14 and 16 then return 'champion';
  else return 'adventurer';
  end if;
end;
$$;

-- TRIGGER: auto-set age_group à l'insertion d'un enfant
create or replace function public.set_age_group()
returns trigger language plpgsql as $$
begin
  new.age_group := public.get_age_group(new.date_of_birth);
  return new;
end;
$$;

create trigger trg_set_age_group
  before insert or update on public.children
  for each row execute function public.set_age_group();

-- ============================================================
-- FONCTION: mise à jour streak après session complétée
-- ============================================================
create or replace function public.update_streak_after_session()
returns trigger language plpgsql as $$
declare
  last_date date;
  child_row public.children%rowtype;
begin
  select * into child_row from public.children where id = new.child_id;
  last_date := child_row.last_session_at::date;

  update public.children set
    current_session = current_session + 1,
    total_xp = total_xp + new.xp_earned,
    last_session_at = new.completed_at,
    streak = case
      when last_date is null then 1
      when last_date = current_date - 1 then streak + 1
      when last_date = current_date then streak
      else 1
    end
  where id = new.child_id;

  return new;
end;
$$;

create trigger trg_update_streak
  after insert on public.sessions
  for each row execute function public.update_streak_after_session();

-- ============================================================
-- INDEX pour les performances
-- ============================================================
create index idx_children_parent on public.children(parent_id);
create index idx_sessions_child on public.sessions(child_id);
create index idx_sessions_number on public.sessions(child_id, session_number);
create index idx_answers_child on public.session_answers(child_id);
create index idx_content_session on public.content_sessions(session_number, level, age_group);
create index idx_enrollments_status on public.enrollments(payment_status);
