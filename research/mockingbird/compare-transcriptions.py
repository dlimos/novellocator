"""Compare two research witnesses; agreement is not a print-edition certificate."""
from pathlib import Path
import difflib
import hashlib
import json
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[2]
R = ROOT / "research/mockingbird"
W = ROOT / "work/mockingbird"
t = (W / "peradaban.txt").read_text(encoding="utf-8")
headers = list(re.finditer(r"(?m)^[ \t]*(\d{1,2})[ \t]*$", t))
assert [int(m[1]) for m in headers] == list(range(1, 32))
end = t.index("Appendix. 3.", headers[-1].end())
def tokens(value):
    value = unicodedata.normalize("NFKC", value).lower()
    return re.findall(r"[a-z0-9]+", value)
report = {
    "checked": "2026-10-20",
    "witnessA": "english-school-transcription",
    "witnessB": "peradaban-university-appendix",
    "witnessBSha256": hashlib.sha256((W / "peradaban.pdf").read_bytes()).hexdigest(),
    "witnessBPages": 157,
    "claimedISBN": "9780061980268",
    "claimedEditionVerified": False,
    "independenceOfWitnessesEstablished": False,
    "method": "Compare lowercase alphanumeric tokens chapter by chapter; whitespace, case and punctuation are ignored. Remaining differences include OCR/reflow word splits. This does not assess meaning or certify authenticity.",
    "limitations": [
        "The second witness is a thesis appendix reflow, not a facsimile of the claimed publisher's print edition.",
        "Its front matter gives renewal 1998 instead of 1988 and misspells Foreword; declared ISBN is not sufficient proof of edition identity.",
        "Both transcriptions may descend from a common electronic ancestor; textual agreement does not establish independent corroboration.",
        "The 1993 foreword is additional material and is not silently included in the first witness's edition or chapter count.",
        "The thesis author's biographical appendix is excluded from the literary corpus and from all research outputs.",
    ],
    "chapters": [],
}
private = []
for index, header in enumerate(headers):
    number = index + 1
    stop = headers[index + 1].start() if index + 1 < len(headers) else end
    other = t[header.end():stop].strip()
    original = (W / f"chapter-{number:02}.txt").read_text(encoding="utf-8")
    # PART TWO is structural matter, not the end of chapter 11.
    original = re.sub(r"\s*PART TWO\s*$", "", original)
    other = re.sub(r"\s*PART TWO\s*$", "", other)
    a, b = tokens(original), tokens(other)
    matcher = difflib.SequenceMatcher(None, a, b, autojunk=False)
    changes = [opcode for opcode in matcher.get_opcodes() if opcode[0] != "equal"]
    report["chapters"].append({"chapter": number, "tokensA": len(a), "tokensB": len(b),
        "tokenSimilarity": round(matcher.ratio(), 6), "differenceBlocks": len(changes)})
    private.append({"chapter": number, "differences": [
        {"type": kind, "a": a[i:j], "b": b[k:l], "aOffset": i, "bOffset": k}
        for kind, i, j, k, l in changes]})
    (W / f"witness-b-chapter-{number:02}.txt").write_text(other, encoding="utf-8")
(W / "comparison-details.json").write_text(json.dumps(private, ensure_ascii=False, indent=2), encoding="utf-8")
(R / "transcription-comparison.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"chaptersCompared": len(report["chapters"]),
    "minimumTokenSimilarity": min(c["tokenSimilarity"] for c in report["chapters"]),
    "editionVerified": False, "independenceEstablished": False}))
