
-- Enable RLS on tables
alter table movies enable row level security;
alter table showtimes enable row level security;
alter table votes enable row level security;

-- Create permissive policies for development
-- WARNING: These policies allow ANYONE to read/write data.
-- For production, you should restrict write access to authenticated users.

-- Movies
create policy "Enable full access for all users" on movies
  for all using (true) with check (true);

-- Showtimes
create policy "Enable full access for all users" on showtimes
  for all using (true) with check (true);

-- Votes
create policy "Enable full access for all users" on votes
  for all using (true) with check (true);
