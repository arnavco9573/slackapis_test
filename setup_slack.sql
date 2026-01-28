-- Create a table to store Slack User Tokens
create table if not exists public.user_slack_tokens (
  user_id uuid references auth.users not null primary key,
  slack_user_id text not null,
  access_token text not null,
  scopes text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.user_slack_tokens enable row level security;

-- Create policy to allow users to view/edit ONLY their own token
create policy "Users can view their own slack token"
  on public.user_slack_tokens for select
  using ( auth.uid() = user_id );

create policy "Users can update their own slack token"
  on public.user_slack_tokens for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own slack token update"
  on public.user_slack_tokens for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own slack token"
  on public.user_slack_tokens for delete
  using ( auth.uid() = user_id );
