"""Audit the locally acquired transcription, without certifying a print edition.

Usage: python -X utf8 research/mockingbird/audit-source.py
Requires pypdf. Complete texts and derived chapter files stay under ignored work/.
This is a structural check, not a narrative inventory or an editorial collation.
"""
from pathlib import Path
import hashlib
import json
import re

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
LOCAL = ROOT / "work/mockingbird"
SOURCE = LOCAL / "original.pdf"
reader = PdfReader(SOURCE)
pages = [page.extract_text() or "" for page in reader.pages]
text = "\n\f\n".join(pages)
# Exclude the contents list, whose entries have bullet prefixes.
headers = list(re.finditer(r"(?m)^[ \t]*Chapter[ \t]+(\d{1,2})[ \t]*$", text))
numbers = [int(match[1]) for match in headers]
assert numbers == list(range(1, 32)), numbers
notes = text.index("Scan & Proof Notes", headers[-1].end())
sections = []
for index, header in enumerate(headers):
    end = headers[index + 1].start() if index + 1 < len(headers) else notes
    chapter = text[header.end():end]
    chapter = re.sub(r"Contents - Prev(?: / Next)?", "", chapter).strip()
    assert len(chapter) > 2000, (numbers[index], len(chapter))
    (LOCAL / f"chapter-{numbers[index]:02}.txt").write_text(chapter, encoding="utf-8")
    sections.append({
        "chapter": numbers[index],
        "part": 1 if numbers[index] <= 11 else 2,
        "pdfStartPage": text[:header.start()].count("\f") + 1,
        "characters": len(chapter),
        "sha256": hashlib.sha256(chapter.encode("utf-8")).hexdigest(),
        "narrativeReview": "pending",
        "editionCollation": "pending",
    })
report = {
    "bookId": "to-kill-a-mockingbird",
    "checked": "2026-10-19",
    "fileSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    "pages": len(reader.pages),
    "characters": len(text),
    "pdfMetadata": {str(key): str(value) for key, value in reader.metadata.items()},
    "structuralCheck": {
        "consecutiveChapterHeadings": numbers,
        "parts": [list(range(1, 12)), list(range(12, 32))],
        "dedicationPresent": "for Mr. Lee and Alice" in text,
        "epigraphAttributionPresent": "Charles Lamb" in text[:2000],
        "closingSentencePresent": "and he would be there when Jem waked up in the morning." in text[-2000:],
        "anonymousProofNotesPresent": "scanned & proofed anonymously" in text,
    },
    "editionVerified": False,
    "fullNarrativeReviewComplete": False,
    "exhaustiveGeographicalInventoryCertified": False,
    "publicationReady": False,
    "limitations": [
        "Anonymous HTML transcription captured as PDF; print publisher, edition and ISBN are absent.",
        "1960 copyright and 1988 renewal do not identify the scanned edition.",
        "All 31 chapter headings and the ending are present; this does not prove textual integrity.",
        "PDF page numbers are transcription pages, not verified print pagination.",
        "Automatic extraction and splitting do not constitute a narrative review.",
    ],
    "sections": sections,
}
assert all(report["structuralCheck"][key] for key in [
    "dedicationPresent", "epigraphAttributionPresent", "closingSentencePresent", "anonymousProofNotesPresent"
])
(LOCAL / "original.txt").write_text(text, encoding="utf-8")
(ROOT / "research/mockingbird/source-audit.json").write_text(
    json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
)
print(json.dumps({"chapters": len(sections), "pages": len(pages),
                  "editionVerified": False, "publicationReady": False}))
