begin;
do $correction$
begin
 if (select count(*) from public.place_descriptions where book_id in ('proust','wuthering-heights','gatsby') and metadata->'positionDescription'->>'reviewedAt'='2026-11-03' and metadata->'positionDescription'->>'status'='reviewed') <> 136 then raise exception 'Unexpected number of descriptions; no date corrected'; end if;
 update public.place_descriptions set metadata=jsonb_set(metadata,'{positionDescription,reviewedAt}',to_jsonb('2026-11-04'::text),false) where book_id in ('proust','wuthering-heights','gatsby') and metadata->'positionDescription'->>'reviewedAt'='2026-11-03' and metadata->'positionDescription'->>'status'='reviewed';
end $correction$;
commit;
