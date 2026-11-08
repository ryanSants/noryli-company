create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- Conta comercial da Noryli vira administradora ao se cadastrar
create or replace function public.grant_noryli_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if lower(new.email) = 'noryli.company@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_noryli_admin after insert on auth.users
for each row execute function public.grant_noryli_admin();

create type public.lead_stage as enum ('novo','em_conversa','proposta_enviada','fechado','arquivado');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  company text not null check (char_length(company) between 1 and 120),
  channel text not null check (channel in ('whatsapp','email')),
  contact text not null check (char_length(contact) between 5 and 160),
  consent boolean not null check (consent = true),
  answers jsonb not null default '{}'::jsonb check (pg_column_size(answers) < 4000),
  recommendation text check (char_length(recommendation) <= 200),
  package_interest text check (char_length(package_interest) <= 120),
  stage public.lead_stage not null default 'novo',
  is_client boolean not null default false,
  notes text check (char_length(notes) <= 2000)
);
grant insert on public.leads to anon, authenticated;
grant select, update on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "visitors submit own request" on public.leads for insert to anon, authenticated
  with check (stage = 'novo' and is_client = false and notes is null);
create policy "admins read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update leads" on public.leads for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.leads_before_update()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  if new.is_client and new.stage <> 'fechado' then
    raise exception 'Somente pedidos fechados podem ser marcados como cliente';
  end if;
  return new;
end $$;
create trigger leads_bu before update on public.leads for each row execute function public.leads_before_update();

create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  description text not null
);
grant select on public.lead_events to authenticated;
grant all on public.lead_events to service_role;
alter table public.lead_events enable row level security;
create policy "admins read events" on public.lead_events for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.leads_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.lead_events(lead_id, description) values (new.id, 'Pedido recebido');
  else
    if new.stage is distinct from old.stage then
      insert into public.lead_events(lead_id, description) values (new.id, 'Etapa: ' || new.stage::text);
    end if;
    if new.is_client is distinct from old.is_client then
      insert into public.lead_events(lead_id, description) values (new.id, case when new.is_client then 'Marcado como cliente' else 'Desmarcado como cliente' end);
    end if;
  end if;
  return new;
end $$;
create trigger leads_log_ai after insert on public.leads for each row execute function public.leads_log();
create trigger leads_log_au after update on public.leads for each row execute function public.leads_log();