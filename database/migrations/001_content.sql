-- PostgreSQL content model. Run once, before 002_supabase_access.sql.
begin;
create table public.books (
 id text primary key,
 title text not null,
 author text not null,
 original_language text not null,
 publication_status text not null default 'draft' check (publication_status in ('draft','published')),
 metadata jsonb not null default '{}'::jsonb
);
create table public.sections (
 book_id text not null references public.books(id) on delete cascade,
 id integer not null,
 ordinal integer not null check (ordinal >= 0),
 title text not null,
 metadata jsonb not null default '{}'::jsonb,
 legacy_fields text[] not null default '{}',
 primary key (book_id,id),
 unique (book_id,ordinal)
);
-- IDs are scoped to a book: "london" is a Dublin road in one legacy dataset.
-- Cross-book merging requires geographical verification, not a matching slug.
create table public.places (
 book_id text not null references public.books(id) on delete cascade,
 id text not null,
 latitude double precision not null check (latitude between -90 and 90),
 longitude double precision not null check (longitude between -180 and 180),
 primary key (book_id,id)
);
create table public.sources (
 book_id text not null references public.books(id) on delete cascade,
 id text not null check (id ~ '^[a-f0-9]{64}$'),
 url text not null check (url ~ '^https?://'),
 label text,
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,id)
);
-- Core and citation records may describe the same feature differently.
-- They share coordinates but retain their own precision notes and provenance.
create table public.place_descriptions (
 book_id text not null,
 place_id text not null,
 collection text not null check (collection in ('core','cited')),
 name text not null,
 area text not null,
 kind text not null check (kind in ('building','historical','street','area','uncertain')),
 zoom double precision not null,
 checked date not null,
 status text not null,
 note text not null,
 method text not null,
 position_source_id text not null,
 narrative_source_id text,
 additional_source_id text,
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,place_id,collection),
 foreign key (book_id,place_id) references public.places(book_id,id) on delete cascade,
 foreign key (book_id,position_source_id) references public.sources(book_id,id),
 foreign key (book_id,narrative_source_id) references public.sources(book_id,id),
 foreign key (book_id,additional_source_id) references public.sources(book_id,id)
);
create table public.place_references (
 book_id text not null,
 id text not null,
 section_id integer not null,
 place_id text not null,
 collection text not null,
 ordinal integer not null check (ordinal >= 0),
 category text not null check (category in ('action','mentioned')),
 scene_text text,
 source_id text,
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,id),
 unique (book_id,section_id,id),
 unique (book_id,section_id,collection,ordinal),
 unique (book_id,section_id,collection,place_id),
 foreign key (book_id,section_id) references public.sections(book_id,id) on delete cascade,
 foreign key (book_id,place_id,collection) references public.place_descriptions(book_id,place_id,collection),
 foreign key (book_id,source_id) references public.sources(book_id,id),
 check (collection <> 'cited' or category = 'mentioned')
);
create index place_references_place_idx on public.place_references(book_id,place_id);
create table public.excerpts (
 book_id text not null,
 id text not null,
 section_id integer not null,
 reference_id text,
 slot text not null,
 language text not null,
 type text not null check (type in ('original','translation')),
 quote text not null check (length(quote)>0),
 attribution text not null,
 text_source_id text not null,
 rights_source_id text not null,
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,id),
 foreign key (book_id,section_id) references public.sections(book_id,id) on delete cascade,
 foreign key (book_id,section_id,reference_id) references public.place_references(book_id,section_id,id) on delete cascade,
 foreign key (book_id,text_source_id) references public.sources(book_id,id),
 foreign key (book_id,rights_source_id) references public.sources(book_id,id)
);
create unique index excerpts_section_slot_idx on public.excerpts(book_id,section_id,slot) where reference_id is null;
create unique index excerpts_reference_slot_idx on public.excerpts(book_id,reference_id,slot) where reference_id is not null;
create table public.unlocated_settings (
 book_id text not null,
 section_id integer not null,
 ordinal integer not null check (ordinal >= 0),
 name text not null,
 description text not null,
 quote text not null,
 source_id text not null,
 metadata jsonb not null default '{}'::jsonb,
 primary key (book_id,section_id,ordinal),
 foreign key (book_id,section_id) references public.sections(book_id,id) on delete cascade,
 foreign key (book_id,source_id) references public.sources(book_id,id)
);
-- Preserve the existing translation dictionaries without indexing long prose.
create table public.content_translations (
 book_id text not null references public.books(id) on delete cascade,
 language text not null,
 source_hash text not null check (source_hash ~ '^[a-f0-9]{64}$'),
 source_text text not null,
 translated_text text not null,
 primary key (book_id,language,source_hash)
);
commit;
