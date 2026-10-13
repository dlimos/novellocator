-- Atlas visibility only: retain all original unlocated_settings and quotations.
-- Merge these reviewed exclusions into existing book metadata.
begin;
with reviewed(book_id, hidden_ids) as (
 values
 ('orwell1984', '["truth","peace","love","plenty","records","fiction","work-cubicle","canteen","ministry-corridor","room101","love-cell","interrogation","recovery-cell","fortresses","darkness","golden","mother-dream","paperweight-world","dream-cell","dream-corridor","desert-vision"]'::jsonb),
 ('sound-and-fury', '["heaven-hell","milk-honey"]'::jsonb)
)
update public.books as book
set metadata = jsonb_set(coalesce(book.metadata, '{}'::jsonb), '{hiddenUnlocatedPlaceIds}', (
 select jsonb_agg(distinct value)
 from jsonb_array_elements(coalesce(book.metadata->'hiddenUnlocatedPlaceIds', '[]'::jsonb) || reviewed.hidden_ids)
))
from reviewed
where book.id = reviewed.book_id;
commit;

select id, metadata->'hiddenUnlocatedPlaceIds' as hidden_unlocated_places
from public.books
where id in ('orwell1984', 'sound-and-fury');
