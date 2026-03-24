-- Aura App Database Schema
-- Run this in Supabase SQL Editor

create table auras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input text not null,
  primary_color text not null,
  secondary_color text not null,
  tertiary_color text not null,
  emotion_label text not null,
  comment text not null,
  lucky_action text not null,
  compatible_color text not null,
  compatible_hex text not null,
  compatible_message text not null,
  personality_mode text not null,
  personality_detail text not null,
  advice text not null,
  trend text not null,
  weather_temp real,
  weather_condition text,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table auras enable row level security;

create policy "Users read own auras"
  on auras for select using (auth.uid() = user_id);

create policy "Users insert own auras"
  on auras for insert with check (auth.uid() = user_id);

create policy "Users delete own auras"
  on auras for delete using (auth.uid() = user_id);

-- Index for fetching user history ordered by date
create index idx_auras_user_created on auras (user_id, created_at desc);
