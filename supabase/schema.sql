-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists study_plans (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  topics text not null,
  exam_date date not null,
  plan text not null,
  created_at timestamptz default now()
);

-- Allow public read/write for demo (no auth). For production, add Row Level Security.
alter table study_plans enable row level security;

create policy "Allow public insert"
  on study_plans for insert
  with check (true);

create policy "Allow public select"
  on study_plans for select
  using (true);
