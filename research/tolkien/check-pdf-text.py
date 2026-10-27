"""Read-only PDF audit. Full text stays in ignored work/tolkien, never in Git."""
import hashlib
import json
import re
import sys
from pathlib import Path
from pypdf import PdfReader

reports = []
for name in sys.argv[1:]:
    path = Path(name)
    reader = PdfReader(path)
    pages = [page.extract_text() or "" for page in reader.pages]
    counts = [len(text.strip()) for text in pages]
    terms = ["PROLOGUE", "BOOK ONE", "BOOK TWO", "BOOK THREE", "BOOK FOUR",
             "BOOK FIVE", "BOOK SIX", "THE GREY HAVENS", "APPENDIX A",
             "APPENDIX B", "APPENDIX C", "APPENDIX D", "APPENDIX E", "APPENDIX F",
             "ON TRANSLATION", "Copyright"]
    normalized = [re.sub(r"\s+", " ", text).upper() for text in pages]
    matches = {term: [i + 1 for i, text in enumerate(normalized) if term.upper() in text]
               for term in terms}
    # The last pages contain edition metadata; no narrative text is published.
    tail = "\n".join(pages[-10:])
    isbns = sorted(set(re.findall(r"ISBN[^\n]{0,65}", tail)))
    output = path.with_suffix(".txt")
    output.write_text("\n".join(f"\n[PDF PAGE {i+1}]\n{text}" for i, text in enumerate(pages)), encoding="utf-8")
    reports.append({"file": path.name, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                    "bytes": path.stat().st_size, "pages": len(pages),
                    "encrypted": reader.is_encrypted, "metadata": dict(reader.metadata or {}),
                    "pagesWithText": sum(count > 0 for count in counts),
                    "pagesOver200Characters": sum(count > 200 for count in counts),
                    "characters": sum(counts),
                    "pagesUnder80Characters": [i+1 for i, count in enumerate(counts) if count < 80],
                    "replacementCharacters": sum(text.count('\ufffd') for text in pages),
                    "sectionMatchesPdfPagesOneBased": matches, "isbnLines": isbns,
                    "scope": "Text extraction and structural checks only; not a full textual collation or narrative analysis.",
                    "requiresOcrForNarrative": None})
Path("research/tolkien/pdf-text-audit.json").write_text(json.dumps(reports, ensure_ascii=False, indent=2, default=str)+"\n", encoding="utf-8")
for report in reports:
    print(json.dumps(report, ensure_ascii=False, default=str))
