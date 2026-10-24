BEGIN;
-- Remove only the reviewed, non-informative values; preserve all other metadata.
UPDATE public.sections SET metadata=metadata-'time'-'people'
WHERE book_id='moby-dick' AND metadata->>'time'='Voyage chronology unspecified'
AND metadata->>'people'='Ishmael · Queequeg · Ahab · Starbuck';
UPDATE public.sections SET metadata=metadata-'people'
WHERE book_id='anna-karenina' AND metadata->>'people'='Anna, Levin and their social circles';
UPDATE public.sections SET metadata=metadata-'people'
WHERE book_id='crime-and-punishment' AND metadata->>'people'='Fyodor Dostoevsky';
UPDATE public.sections SET metadata=metadata-'time'
WHERE book_id='don-quijote' AND metadata->>'time' IN ('1605 / 1615','1604–1615');
UPDATE public.sections SET metadata=metadata-'time'
WHERE book_id='proust' AND metadata->>'time' LIKE 'Published %';
COMMIT;
SELECT book_id, count(*) AS sections,
count(*) FILTER (WHERE nullif(trim(metadata->>'time'),'') IS NOT NULL) AS time_badges,
count(*) FILTER (WHERE nullif(trim(metadata->>'people'),'') IS NOT NULL) AS people_badges
FROM public.sections GROUP BY book_id ORDER BY book_id;
