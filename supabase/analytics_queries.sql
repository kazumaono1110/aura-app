-- ============================================
-- Aura アプリ 利用分析クエリ集
-- Supabase SQL Editor で実行
-- ============================================

-- ■ DAU（日次アクティブユーザー数）— 直近30日
select
  date(created_at at time zone 'Asia/Tokyo') as day,
  count(distinct user_id) as dau
from auras
where created_at >= now() - interval '30 days'
group by day
order by day desc;

-- ■ 日次生成回数 — 直近30日
select
  date(created_at at time zone 'Asia/Tokyo') as day,
  count(*) as generations
from auras
where created_at >= now() - interval '30 days'
group by day
order by day desc;

-- ■ ユーザー別 今日の生成回数（フリーミアム制限チェック用）
select
  user_id,
  count(*) as today_count
from auras
where date(created_at at time zone 'Asia/Tokyo') = date(now() at time zone 'Asia/Tokyo')
group by user_id
order by today_count desc;

-- ■ 特定ユーザーの今日の生成回数（API側で使用する想定）
-- $1 = user_id
-- select count(*) as cnt
-- from auras
-- where user_id = $1
--   and date(created_at at time zone 'Asia/Tokyo') = date(now() at time zone 'Asia/Tokyo');

-- ■ 累計ユーザー数
select count(distinct user_id) as total_users from auras;

-- ■ 累計生成回数
select count(*) as total_generations from auras;

-- ■ ユーザーあたり平均生成回数
select
  round(count(*)::numeric / nullif(count(distinct user_id), 0), 1) as avg_generations_per_user
from auras;

-- ■ 時間帯別生成数（ユーザー行動パターン分析）
select
  extract(hour from created_at at time zone 'Asia/Tokyo')::int as hour,
  count(*) as generations
from auras
group by hour
order by hour;

-- ■ よく使われる感情ラベル TOP20
select
  emotion_label,
  count(*) as cnt
from auras
group by emotion_label
order by cnt desc
limit 20;

-- ■ 週次リテンション（初回利用週からの継続率）
with user_first_week as (
  select
    user_id,
    date_trunc('week', min(created_at)) as first_week
  from auras
  group by user_id
),
user_weekly_activity as (
  select
    a.user_id,
    date_trunc('week', a.created_at) as active_week
  from auras a
  group by a.user_id, active_week
)
select
  fw.first_week as cohort_week,
  count(distinct fw.user_id) as cohort_size,
  count(distinct case when wa.active_week = fw.first_week + interval '1 week' then wa.user_id end) as week1_retained,
  count(distinct case when wa.active_week = fw.first_week + interval '2 weeks' then wa.user_id end) as week2_retained
from user_first_week fw
left join user_weekly_activity wa on fw.user_id = wa.user_id
group by cohort_week
order by cohort_week desc;
