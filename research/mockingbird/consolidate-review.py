"""Consolidate authored reading notes without promoting them to verified quotes."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
R = ROOT / "research/mockingbird"
path = R / "narrative-review.json"
review = json.loads(path.read_text(encoding="utf-8"))
extra = json.loads((R / "review-part-two.json").read_text(encoding="utf-8"))
chapters = {item["chapter"]: item for item in review["chapters"]}
chapters.update({item["chapter"]: item for item in extra})
assert sorted(chapters) == list(range(1, 32))
for number, chapter in chapters.items():
    source = ROOT / f"work/mockingbird/chapter-{number:02}.txt"
    chapter["sourceSha256"] = hashlib.sha256(source.read_bytes()).hexdigest()
    chapter["reading"] = "complete-transcription"
    chapter["associationInventoryStatus"] = "candidate-review-pending-individual-evidence"
    chapter["publicQuotationStatus"] = "pending-edition-and-proportionality-assessment"
review["chapters"] = [chapters[number] for number in sorted(chapters)]
review["status"] = "first-narrative-reading-complete-association-audit-pending"
review["fullNarrativeReadOfTranscription"] = True
review["editionVerified"] = False
review["exhaustiveGeographicalInventoryCertified"] = False
review["publicationReady"] = False
path.write_text(json.dumps(review, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("31 chapter reading notes consolidated; edition and individual evidence remain pending.")
