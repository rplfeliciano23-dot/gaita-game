-- Gaita Game | Supabase schema inicial
-- Execute no SQL Editor do projeto Supabase somente depois de criar o projeto.
create table if not exists public.student_progress (
  id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer not null default 1,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.student_progress enable row level security;

drop policy if exists "student can read own progress" on public.student_progress;
create policy "student can read own progress"
  on public.student_progress for select
  using (auth.uid() = id);

drop policy if exists "student can insert own progress" on public.student_progress;
create policy "student can insert own progress"
  on public.student_progress for insert
  with check (auth.uid() = id);

drop policy if exists "student can update own progress" on public.student_progress;
create policy "student can update own progress"
  on public.student_progress for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
