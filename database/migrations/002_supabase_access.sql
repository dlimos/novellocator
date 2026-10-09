-- Requires Supabase Auth (auth.users, auth.uid(), anon/authenticated/service_role).
begin;
create schema if not exists private;
create table public.editorial_memberships (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('editor','admin'))
);
create table public.favorite_places (
 user_id uuid not null references auth.users(id) on delete cascade,
 book_id text not null,
 place_id text not null,
 created_at timestamptz not null default now(),
 primary key (user_id,book_id,place_id),
 foreign key (book_id,place_id) references public.places(book_id,id) on delete cascade
);
create index favorite_places_place_idx on public.favorite_places(book_id,place_id);
create function private.is_editor() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.editorial_memberships where user_id = (select auth.uid()) and role in ('editor','admin'));
$$;
create function private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.editorial_memberships where user_id = (select auth.uid()) and role = 'admin');
$$;
revoke all on function private.is_editor(), private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_editor(), private.is_admin() to anon, authenticated;

alter table public.books enable row level security;
revoke all on public.books from anon, authenticated;
grant select on public.books to anon;
grant select,insert,update,delete on public.books to authenticated, service_role;
create policy books_read on public.books for select to anon,authenticated using (publication_status='published' or (select private.is_editor()));
create policy books_insert on public.books for insert to authenticated with check ((select private.is_editor()));
create policy books_update on public.books for update to authenticated using ((select private.is_editor())) with check ((select private.is_editor()));
create policy books_delete on public.books for delete to authenticated using ((select private.is_admin()));

do $$
declare target text;
begin
 foreach target in array array['sections','places','sources','place_descriptions','place_references','excerpts','unlocated_settings','content_translations'] loop
  execute format('alter table public.%I enable row level security',target);
  execute format('revoke all on public.%I from anon, authenticated',target);
  execute format('grant select on public.%I to anon',target);
  execute format('grant select,insert,update,delete on public.%I to authenticated, service_role',target);
  execute format('create policy content_read on public.%I for select to anon,authenticated using (exists(select 1 from public.books b where b.id=book_id and (b.publication_status=''published'' or (select private.is_editor()))))',target);
  execute format('create policy content_insert on public.%I for insert to authenticated with check ((select private.is_editor()))',target);
  execute format('create policy content_update on public.%I for update to authenticated using ((select private.is_editor())) with check ((select private.is_editor()))',target);
  execute format('create policy content_delete on public.%I for delete to authenticated using ((select private.is_editor()))',target);
 end loop;
end $$;

alter table public.editorial_memberships enable row level security;
revoke all on public.editorial_memberships from anon, authenticated;
grant select,insert,update,delete on public.editorial_memberships to authenticated,service_role;
create policy membership_read on public.editorial_memberships for select to authenticated using (user_id=(select auth.uid()) or (select private.is_admin()));
create policy membership_insert on public.editorial_memberships for insert to authenticated with check ((select private.is_admin()));
create policy membership_update on public.editorial_memberships for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy membership_delete on public.editorial_memberships for delete to authenticated using ((select private.is_admin()));

alter table public.favorite_places enable row level security;
revoke all on public.favorite_places from anon, authenticated;
grant select,insert,update,delete on public.favorite_places to authenticated, service_role;
create policy favorites_read on public.favorite_places for select to authenticated using (user_id=(select auth.uid()));
create policy favorites_insert on public.favorite_places for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.books b where b.id=book_id and b.publication_status='published'));
create policy favorites_update on public.favorite_places for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()) and exists(select 1 from public.books b where b.id=book_id and b.publication_status='published'));
create policy favorites_delete on public.favorite_places for delete to authenticated using (user_id=(select auth.uid()));
commit;
