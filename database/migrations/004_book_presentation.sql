-- Editorial data and CSS follow the same publication rules as narrative content.
begin;
create table public.book_presentations (
 book_id text primary key references public.books(id) on delete cascade,
 catalogue_order integer not null default 0,
 presentation jsonb not null check (jsonb_typeof(presentation)='object'),
 translations jsonb not null default '{}' check (jsonb_typeof(translations)='object'),
 css text not null,
 artwork_documentation text not null default '',
 is_default boolean not null default false,
 is_legacy_illustrated boolean not null default false,
 updated_at timestamptz not null default now(),
 check (length(css)>0)
);
create unique index book_presentations_default on public.book_presentations(is_default) where is_default;
create unique index book_presentations_legacy on public.book_presentations(is_legacy_illustrated) where is_legacy_illustrated;
alter table public.book_presentations enable row level security;
revoke all on public.book_presentations from anon, authenticated;
grant select on public.book_presentations to anon;
grant select,insert,update,delete on public.book_presentations to authenticated,service_role;
create policy presentation_read on public.book_presentations for select to anon,authenticated using (
 exists(select 1 from public.books b where b.id=book_id and (b.publication_status='published' or (select private.is_editor())))
);
create policy presentation_insert on public.book_presentations for insert to authenticated with check ((select private.is_editor()));
create policy presentation_update on public.book_presentations for update to authenticated using ((select private.is_editor())) with check ((select private.is_editor()));
create policy presentation_delete on public.book_presentations for delete to authenticated using ((select private.is_editor()));
commit;
