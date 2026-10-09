-- Optional cartography per book, including fictional worlds.
-- Apply after 001_content.sql and 002_supabase_access.sql.
begin;
create table public.book_maps (
 book_id text not null references public.books(id) on delete cascade,
 id text not null,
 title text not null,
 world_type text not null check (world_type in ('real','fictional')),
 renderer text not null check (renderer in ('webmap','image','layers')),
 coordinate_space text not null check (coordinate_space in ('wgs84','cartesian')),
 spatial_reference jsonb not null check (jsonb_typeof(spatial_reference)='object'),
 portal_item_id text check (portal_item_id ~ '^[a-fA-F0-9]{32}$'),
 image_url text check (image_url ~ '^https?://'),
 is_default boolean not null default false,
 initial_view jsonb not null default '{}'::jsonb,
 attribution text not null default '',
 rights_url text check (rights_url ~ '^https?://'),
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,id),
 unique (book_id,id,coordinate_space),
 check (renderer <> 'webmap' or portal_item_id is not null),
 check (renderer <> 'image' or image_url is not null),
 check (coordinate_space <> 'wgs84' or spatial_reference @> '{"wkid":4326}'::jsonb)
);
create unique index book_maps_default_idx on public.book_maps(book_id) where is_default;
create table public.section_maps (
 book_id text not null,
 section_id integer not null,
 map_id text not null,
 is_default boolean not null default false,
 primary key (book_id,section_id,map_id),
 foreign key (book_id,section_id) references public.sections(book_id,id) on delete cascade,
 foreign key (book_id,map_id) references public.book_maps(book_id,id) on delete cascade
);
create unique index section_maps_default_idx on public.section_maps(book_id,section_id) where is_default;
create table public.map_layers (
 book_id text not null,
 map_id text not null,
 id text not null,
 title text not null,
 layer_type text not null check (layer_type in ('feature','tile','vector_tile','map_image','image','geojson','group')),
 layer_role text not null check (layer_role in ('basemap','context','route','places')),
 service_url text check (service_url ~ '^https?://'),
 portal_item_id text check (portal_item_id ~ '^[a-fA-F0-9]{32}$'),
 webmap_layer_id text,
 ordinal integer not null check (ordinal >= 0),
 default_visible boolean not null default true,
 opacity double precision not null default 1 check (opacity between 0 and 1),
 attribution text not null default '',
 rights_url text check (rights_url ~ '^https?://'),
 configuration jsonb not null default '{}'::jsonb,
 primary key (book_id,map_id,id),
 foreign key (book_id,map_id) references public.book_maps(book_id,id) on delete cascade,
 check (layer_type='group' or service_url is not null or portal_item_id is not null or webmap_layer_id is not null)
);
-- A place may have a different position on different map editions.
-- X/Y are local map coordinates; never silently interpret them as lon/lat.
create table public.place_positions (
 book_id text not null,
 place_id text not null,
 map_id text not null,
 coordinate_space text not null check (coordinate_space in ('wgs84','cartesian')),
 x double precision not null check (x > '-Infinity'::double precision and x < 'Infinity'::double precision),
 y double precision not null check (y > '-Infinity'::double precision and y < 'Infinity'::double precision),
 source_id text,
 method text not null,
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,place_id,map_id),
 foreign key (book_id,place_id) references public.places(book_id,id) on delete cascade,
 foreign key (book_id,map_id,coordinate_space) references public.book_maps(book_id,id,coordinate_space) on delete cascade,
 foreign key (book_id,source_id) references public.sources(book_id,id),
 check (coordinate_space <> 'wgs84' or (x between -180 and 180 and y between -90 and 90))
);
create index place_positions_map_idx on public.place_positions(book_id,map_id);
-- Existing WGS84 columns remain for the current static export. A fictional
-- place can leave both empty and use place_positions instead.
alter table public.places alter column latitude drop not null;
alter table public.places alter column longitude drop not null;
alter table public.places add constraint places_coordinate_pair check ((latitude is null)=(longitude is null));

do $$
declare target text;
begin
 foreach target in array array['book_maps','section_maps','map_layers','place_positions'] loop
  execute format('alter table public.%I enable row level security',target);
  execute format('revoke all on public.%I from anon, authenticated',target);
  execute format('grant select on public.%I to anon',target);
  execute format('grant select,insert,update,delete on public.%I to authenticated, service_role',target);
  execute format('create policy cartography_read on public.%I for select to anon,authenticated using (exists(select 1 from public.books b where b.id=book_id and (b.publication_status=''published'' or (select private.is_editor()))))',target);
  execute format('create policy cartography_insert on public.%I for insert to authenticated with check ((select private.is_editor()))',target);
  execute format('create policy cartography_update on public.%I for update to authenticated using ((select private.is_editor())) with check ((select private.is_editor()))',target);
  execute format('create policy cartography_delete on public.%I for delete to authenticated using ((select private.is_editor()))',target);
 end loop;
end $$;
commit;
