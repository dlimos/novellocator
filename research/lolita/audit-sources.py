"""Audit the two user-supplied PDFs without publishing their literary text.

Run from the repository root with Python and pypdf. Source PDFs, extracted
pages and full-text section files remain in ignored work/lolita/.
This is a source/structure audit, not a completed narrative analysis.
"""
import difflib
import hashlib
import json
import re
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / "work/lolita"
OUT = Path(__file__).resolve().parent
SOURCES = [
    ("beland", "original.pdf", "https://mrbeland.weebly.com/uploads/3/0/5/5/30558007/lolita.pdf"),
    ("readingsanctuary", "readingsanctuary.pdf", "https://www.readingsanctuary.com/wp-content/uploads/2023/04/lolita.pdf"),
]
EXPECTED = ["foreword"] + [f"1.{i}" for i in range(1, 34)] + [f"2.{i}" for i in range(1, 37)]


def digest(value):
    return hashlib.sha256(value if isinstance(value, bytes) else value.encode("utf-8")).hexdigest()


def clean_page(text):
    text = re.sub(r"file:///D[^\n]*", "", text)
    text = re.sub(r"PDF\s+vytvořeno\s+zkušební\s+verzí\s+pdfFactory\s+Pro\s+www\.fineprint\.cz", "", text)
    return re.sub(r"[\t ]+", " ", text)


def audit_source(key, filename, url):
    path = WORK / filename
    reader = PdfReader(path)
    pages = [clean_page(page.extract_text() or "") for page in reader.pages]
    offsets = []
    offset = 0
    for number, page in enumerate(pages, 1):
        offsets.append((offset, number))
        offset += len(page) + 1
    text = "\n".join(pages)
    headings = list(re.finditer(r"(?m)^\s*(FOREWORD|\*?\s*PART ONE\s*\*?|\*?\s*PART TWO\s*\*?|\d{1,2})\s*$", text))
    part = 0
    sections = []
    for index, heading in enumerate(headings):
        label = heading.group(1).strip(" *")
        if label.startswith("PART"):
            part = 1 if label == "PART ONE" else 2
            continue
        section_id = "foreword" if label == "FOREWORD" else f"{part}.{int(label)}"
        start = heading.end()
        end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
        body = re.sub(r"\s+", " ", text[start:end]).strip()
        if section_id == "2.36":
            body = re.sub(r"\s+Lolita\. Paris: The Olympia Press, 1955\s*$", "", body)
        sections.append({
            "id": section_id,
            "pdfPageStart": next(number for off, number in reversed(offsets) if off <= heading.start()),
            "pdfPageEnd": next(number for off, number in reversed(offsets) if off < end),
            "wordCount": len(body.split()),
            "sha256": digest(body),
            "text": body,
            "narrativeReview": "pending",
            "boundaryStatus": "pending-II.2-II.3-separation" if section_id == "2.2" else "heading-detected",
        })
    # Full text remains local and ignored; only counts and hashes are versioned.
    (WORK / f"{key}-clean.txt").write_text(text, encoding="utf-8")
    (WORK / f"{key}-sections.json").write_text(json.dumps(sections, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    manifest = {
        "id": key, "url": url, "file": f"work/lolita/{filename}",
        "pdfPages": len(pages), "pdfSha256": digest(path.read_bytes()),
        "pdfMetadata": {str(k): str(v) for k, v in (reader.metadata or {}).items()},
        "detectedUnits": len(sections),
        "missingHeadings": [s for s in EXPECTED if s not in {row["id"] for row in sections}],
        "publisherStatementPresent": "Lolita. Paris: The Olympia Press, 1955" in re.sub(r"\s+", " ", text),
        "afterwordPresent": bool(re.search(r"On a Book Entitled|AFTERWORD", text, re.I)),
        "sharedAnomalies": [word for word in ["settlemen", "publshed", "despare"] if re.search(r"\b" + word + r"\b", text)],
        "sections": [{k: v for k, v in row.items() if k != "text"} for row in sections],
    }
    return manifest, sections


results = [audit_source(*source) for source in SOURCES]
maps = [{s["id"]: s for s in sections} for _, sections in results]
comparisons = []
for section_id in EXPECTED:
    if not all(section_id in m for m in maps):
        comparisons.append({"id": section_id, "comparison": "missing-heading-in-both", "narrativeReview": "pending"})
        continue
    a, b = [m[section_id]["text"] for m in maps]
    # Word comparison ignores layout and dash typography, not spelling changes.
    tokens = [re.findall(r"\w+|[^\w\s]", value.replace("—", "--")) for value in [a, b]]
    matcher = difflib.SequenceMatcher(None, *tokens, autojunk=False)
    comparisons.append({"id": section_id, "tokenSimilarity": round(matcher.ratio(), 6), "narrativeReview": "pending"})

report = {
    "book": "lolita", "author": "Vladimir Nabokov", "originalLanguage": "en",
    "checked": "2026-10-13", "publicationStatus": "pending",
    "fullTextReviewed": False, "fullNarrativeAnalysisCompleted": False,
    "expectedNarrativeUnits": len(EXPECTED), "sources": [m for m, _ in results],
    "sectionComparison": comparisons,
    "findings": [
        "Both PDFs contain the foreword and numbered parts I and II, ending in II.36.",
        "Both omit the II.3 heading; II.2 currently includes an unresolved merged region. This does not prove that the entire body of II.3 is missing.",
        "Reading Sanctuary ends with a 1955 Olympia Press bibliographic line, but has no photographed copyright or edition page identifying its underlying copy.",
        "Both contain the same anomalous words settlemen, publshed and despare in the foreword. They are not established as independent witnesses.",
        "Neither contains the later authorial afterword. Its absence alone is not a defect of the 1955 first edition; first publication and electronic transcription provenance must be distinguished.",
        "PDF page counts reflect reformatting and do not establish textual completeness.",
        "No literary location data or quotation has been published by this audit.",
    ],
    "pending": [
        "Compare the electronic text with an identifiable complete English edition.",
        "Establish the boundary between II.2 and II.3 without inventing it.",
        "Review every original section for scenes, mentions, memories, journeys and unlocated settings, including sections without places.",
        "Write specific narrative introductions in English, Italian, French and Spanish.",
        "Verify each location association, its original evidence and its narrative category; use mentioned where the evidence is uncertain.",
        "Document the necessity and proportion of the individual and aggregate quotations under article 70; source provision alone is not publication permission.",
        "Keep translated quotations unavailable until an authentic edition passage and reuse basis are verified.",
        "Prepare and verify the artwork, dedicated theme, database import and publication on docs only after the content is ready.",
    ],
}
(OUT / "analysis.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"pages": [m["pdfPages"] for m, _ in results], "units": [m["detectedUnits"] for m, _ in results], "missing": [m["missingHeadings"] for m, _ in results], "averageTokenSimilarity": round(sum(c.get("tokenSimilarity", 0) for c in comparisons) / (len(comparisons) - 1), 6)}, indent=2))
