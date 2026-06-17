#!/usr/bin/env python3
"""
Generate docs/chinese-color-pinyin.json — toned pinyin for every traditional
color name, keyed by name.

pypinyin's phrase dictionary already reads the hard cases correctly (e.g.
殷红 → yān hóng, 茜红 → qiàn hóng), so this is auto-generation + a small,
reviewed override table for color-specific readings pypinyin still gets wrong.
The output is committed and consumed by scripts/build-manifest.mjs (Node has no
pinyin library, so this is a maintainer-run Python step, like the font subset).

Requires: pip install pypinyin   (see .venv-tooling)
Run:      python scripts/build-pinyin.py
Re-run whenever colors are added/renamed in docs/chinese-color-master-list.md.
"""
import json
import re
from pathlib import Path

from pypinyin import Style, lazy_pinyin

ROOT = Path(__file__).resolve().parent.parent
MASTER_LIST = ROOT / "docs" / "chinese-color-master-list.md"
OUT = ROOT / "docs" / "chinese-color-pinyin.json"

# Per-character overrides for color-specific readings where pypinyin's default
# is wrong. Applied positionally on top of the phrase-level reading, so phrase
# context (殷红 → yān) is preserved for every other character.
# Keep this table small and reviewed; add a row only with a confident source.
CHAR_OVERRIDES = {
    "缥": "piǎo",  # 缥碧 / 缥色 — pale blue-green; pypinyin defaults to piāo
}


def load_names(text: str) -> list[str]:
    """Color rows live inside a ```text fence as `色名 #HEX` (same contract as
    scripts/lib/color-data.mjs loadMasterList)."""
    names = []
    in_fence = False
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("```"):
            in_fence = not in_fence
            continue
        if not in_fence:
            continue
        m = re.match(r"^(.+?)\s+#[0-9A-Fa-f]{6}$", line)
        if m:
            names.append(m.group(1))
    return names


def toned(name: str) -> str:
    syllables = lazy_pinyin(name, style=Style.TONE)
    # syllables is one entry per Han character; apply positional overrides.
    if len(syllables) == len(name):
        for i, ch in enumerate(name):
            if ch in CHAR_OVERRIDES:
                syllables[i] = CHAR_OVERRIDES[ch]
    return " ".join(syllables)


def main() -> None:
    names = load_names(MASTER_LIST.read_text(encoding="utf8"))
    data = {name: toned(name) for name in names}
    OUT.write_text(
        json.dumps(data, ensure_ascii=False, indent=0) + "\n",
        encoding="utf8",
    )
    applied = [n for n in names if any(c in CHAR_OVERRIDES for c in n)]
    print(f"Wrote {len(data)} pinyin entries to {OUT.relative_to(ROOT)}")
    print(f"Overrides applied to {len(applied)} name(s): {', '.join(applied)}")


if __name__ == "__main__":
    main()
