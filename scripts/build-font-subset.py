#!/usr/bin/env python3
"""
Subset Noto Serif SC down to only the glyphs the site actually renders
(742 color-name characters + UI labels + toned-pinyin letters + digits/punct),
producing assets/fonts/NotoSerifSC-subset.woff2.

Why: the share card / daily-color playground render Chinese color names and
pinyin; shipping the full ~11 MB CJK font is wasteful and relying on the
viewer's system font produces 豆腐块 (missing-glyph boxes) on Windows/Linux.
The subset is ~230 KB and embeds exactly what we need.

Noto Serif SC is licensed under the SIL Open Font License 1.1; the license is
kept alongside the font at assets/fonts/OFL.txt.

Requires: pip install fonttools brotli   (see .venv-tooling)
Run:      python scripts/build-font-subset.py
Re-run whenever color names change (new characters may need to be embedded).
"""
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTER_LIST = ROOT / "docs" / "chinese-color-master-list.md"
PINYIN = ROOT / "docs" / "chinese-color-pinyin.json"
FONT_DIR = ROOT / "assets" / "fonts"
OUT = FONT_DIR / "NotoSerifSC-subset.woff2"
SRC = Path("/tmp/NotoSerifSC-Regular.otf")
SRC_URL = (
    "https://github.com/notofonts/noto-cjk/raw/main/"
    "Serif/SubsetOTF/SC/NotoSerifSC-Regular.otf"
)

# UI / card / playground literal strings that must render.
UI_TEXT = (
    "中国传统色No.色系暖冷配搭档取自传统库"
    "RGBCMYK拼音小红书竖版方形公众号横版跟随浅深底文艺实用国潮"
    "今日传统色下载分享卡高级东方年轻克制"
    "colors.xiaoxiaodong.ai"
)
PINYIN_LETTERS = (
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüńňǹ"
)
DIGITS_PUNCT = "0123456789 .,·、，。：·#()%/-—×÷+@"


def load_names() -> str:
    names, in_fence = [], False
    for raw in MASTER_LIST.read_text(encoding="utf8").splitlines():
        line = raw.strip()
        if line.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            m = re.match(r"^(.+?)\s+#[0-9A-Fa-f]{6}$", line)
            if m:
                names.append(m.group(1))
    return "".join(names)


def main() -> None:
    if not SRC.exists():
        print(f"Downloading source font → {SRC} ...")
        urllib.request.urlretrieve(SRC_URL, SRC)

    pinyin_text = "".join(json.loads(PINYIN.read_text(encoding="utf8")).values())
    chars = set(load_names()) | set(UI_TEXT) | set(PINYIN_LETTERS) | set(DIGITS_PUNCT) | set(pinyin_text)
    unicodes = ",".join(f"U+{ord(c):04X}" for c in sorted(chars))

    FONT_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            sys.executable, "-m", "fontTools.subset", str(SRC),
            f"--unicodes={unicodes}",
            "--flavor=woff2",
            "--layout-features=*",
            f"--output-file={OUT}",
        ],
        check=True,
    )
    kb = OUT.stat().st_size / 1024
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(chars)} glyphs, {kb:.0f} KB)")


if __name__ == "__main__":
    main()
