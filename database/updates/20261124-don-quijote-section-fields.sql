-- Don Quijote's imported reference rows include per-place sources and excerpts
-- in sections 113 and 126. Declare those optional maps so the browser adapter
-- can reconstruct their references without throwing on barataria.
begin;

update public.sections
set legacy_fields = legacy_fields
  || case when 'placeSources' = any(legacy_fields) then '{}'::text[] else array['placeSources'] end
  || case when 'placeExcerpts' = any(legacy_fields) then '{}'::text[] else array['placeExcerpts'] end
where book_id = 'don-quijote'
  and id in (113, 126)
  and (
    exists (
      select 1
      from public.place_references r
      where r.book_id = sections.book_id
        and r.section_id = sections.id
        and r.collection = 'core'
        and r.source_id is not null
    )
    or exists (
      select 1
      from public.excerpts e
      where e.book_id = sections.book_id
        and e.section_id = sections.id
        and e.reference_id is not null
    )
  );

commit;
