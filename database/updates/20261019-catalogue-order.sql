-- Source: https://thegreatestbooks.org/ (verified 2026-10-19).
-- Snapshot of the main ranking, not an automatic synchronization.
begin;
update public.book_presentations p set catalogue_order=r.position,updated_at=now()
from (values
  ('ulisse',0),
  ('proust',1),
  ('gatsby',2),
  ('macondo',3),
  ('holden',4),
  ('moby-dick',5),
  ('orwell1984',6),
  ('don-quijote',7),
  ('sound-and-fury',8),
  ('anna-karenina',9),
  ('lolita',10),
  ('war-and-peace',11),
  ('crime-and-punishment',12),
  ('wuthering-heights',13),
  ('pride-and-prejudice',14)
) as r(book_id,position) where p.book_id=r.book_id;
commit;
select book_id,catalogue_order from public.book_presentations order by catalogue_order,book_id;
