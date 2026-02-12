-- Cambo Cinema — Supabase schema
-- Run this in your Supabase SQL editor to set up the database.

-- Movies table
create table if not exists movies (
  id text primary key,
  tmdb_id integer,
  slug text not null,
  title text not null,
  title_kh text default '',
  poster_url text default '',
  backdrop_url text default '',
  trailer_url text default '',
  duration integer default 0,
  genre text[] default '{}',
  rating text default 'PG',
  subtitle_lang text default 'ខ្មែរ',
  synopsis text default '',
  synopsis_kh text default '',
  release_date text default '',
  status text default 'now_showing' check (status in ('now_showing', 'coming_soon', 'hidden')),
  vote_average numeric default 0,
  vote_count integer default 0,
  source text default 'manual',
  created_at timestamptz default now()
);

-- Showtimes table
create table if not exists showtimes (
  id text primary key,
  movie_id text not null references movies(id) on delete cascade,
  date text not null,
  time text not null,
  price numeric default 4.00,
  total_seats integer default 120,
  booked_seats text[] default '{}',
  created_at timestamptz default now()
);

-- Votes table
create table if not exists votes (
  movie_id text primary key references movies(id) on delete cascade,
  count integer default 0
);

-- Enable Realtime on all tables
alter publication supabase_realtime add table movies;
alter publication supabase_realtime add table showtimes;
alter publication supabase_realtime add table votes;

-- Indexes for common queries
create index if not exists idx_showtimes_movie_id on showtimes(movie_id);
create index if not exists idx_showtimes_date on showtimes(date);
create index if not exists idx_movies_status on movies(status);
create index if not exists idx_movies_slug on movies(slug);
