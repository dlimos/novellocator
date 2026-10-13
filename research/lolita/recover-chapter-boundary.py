"""Recover II.3 from a visually verified third witness, without changing words.

The chapter numeral 3 is visible on FlipHTML5 viewer page 110 / printed 109.
The text on either side also occurs in both user-supplied PDFs. Their bodies
are separated at that externally verified boundary; no body text is added.
Run audit-sources.py first. Full recovered text remains ignored in work/.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / "work/lolita"
BEGIN = "She had entered my world, umber and black Humberland, with rash curiosity"
END = '"With your little claws, Lolita."'
SOURCE = "https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=110"
results = []
for key in ["beland", "readingsanctuary"]:
    sections = json.loads((WORK / f"{key}-sections.json").read_text(encoding="utf-8"))
    index = next(i for i, s in enumerate(sections) if s["id"] == "2.2")
    merged = sections[index]
    assert merged["text"].count(BEGIN) == 1
    boundary = merged["text"].index(BEGIN)
    before, after = merged["text"][:boundary].rstrip(), merged["text"][boundary:]
    assert before.endswith(END), "Preceding text differs from the verified page"
    assert before + " " + after == merged["text"], "Recovery must preserve all text"
    recovered = []
    for section_id, body in [("2.2", before), ("2.3", after)]:
        row = {**merged, "id": section_id, "text": body,
               "wordCount": len(body.split()),
               "sha256": hashlib.sha256(body.encode("utf-8")).hexdigest(),
               "boundaryStatus": "recovered-from-FlipHTML5-viewer-page-110",
               "boundarySource": SOURCE,
               "pdfPageRangeStatus": "inherited-merged-range-not-a-chapter-specific-range"}
        recovered.append(row)
    sections[index:index + 1] = recovered
    assert len(sections) == 70
    (WORK / f"{key}-recovered-sections.json").write_text(json.dumps(sections, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    results.append({"source": key, "recoveredUnits": len(sections),
                    "textPreservedExactly": True,
                    "chapters": [{k: v for k, v in r.items() if k != "text"} for r in recovered]})
report = {
    "checked": "2026-10-13", "source": SOURCE,
    "viewerPages": 213, "viewerPage": 110, "printedPage": 109,
    "headingVisuallyVerified": "Part Two, Chapter 3",
    "afterwordStart": {"viewerPage": 208, "printedPage": 207,
                       "url": "https://online.fliphtml5.com/unwsfj/Lolita---Vladimir-Nabokov/#p=208",
                       "title": "On a book entitled Lolita", "visuallyVerified": True},
    "contentsVisuallyVerifiedAtViewerPage": 3,
    "dedicationVisuallyVerifiedAtViewerPage": 2,
    "editionPublisherVerified": False,
    "fullFlipHTML5TextAcquired": False,
    "fullNarrativeAnalysisCompleted": False,
    "evidenceImage": "work/lolita/fliphtml-page-110.webp",
    "recovery": results,
    "finding": "II.3's text is present in both earlier PDFs; its heading was omitted. The third witness establishes the separation. This resolves the chapter-boundary issue, not every question of transcription fidelity or edition provenance.",
}
(Path(__file__).resolve().parent / "fliphtml5-verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"recoveredUnits": [r["recoveredUnits"] for r in results], "textPreservedExactly": True, "boundaryVerified": SOURCE}, indent=2))
