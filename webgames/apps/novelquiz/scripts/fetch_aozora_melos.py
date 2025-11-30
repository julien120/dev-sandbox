import re
import sys
import urllib.request
import ssl
from pathlib import Path

URL = "https://www.aozora.gr.jp/cards/000035/files/1567_14913.html"
OUT = Path("public/corpus/meros.txt")

def fetch(url: str) -> str:
    context = ssl._create_unverified_context()
    with urllib.request.urlopen(url, context=context) as resp:
        return resp.read().decode("shift_jis", errors="ignore")

def extract_text(html: str) -> str:
    # Aozora format: body > ruby etc. We strip tags and remove Ruby annotations.
    # 1) remove ruby tags entirely
    text = re.sub(r"<ruby>(.*?)<rt>.*?</rt></ruby>", r"\1", html, flags=re.S)
    # 2) strip all remaining tags
    text = re.sub(r"<[^>]+>", "", text)
    # 3) 青空文庫のヘッダ・フッタを概ね除去
    #    Keep main content between はじめ→底本注記直前までを大まかに切り出す
    #    Use the position of "走れメロス" title occurrence
    start = text.find("走れメロス")
    if start != -1:
        text = text[start:]
    # remove 現在位置など余計なUI文字列
    text = re.sub(r"[\r\t]", "", text)
    # remove 注記風の［＃...］
    text = re.sub(r"［＃.*?］", "", text)
    # remove circled numbers etc.
    text = re.sub(r"［.*?］", "", text)
    # collapse multiple newlines
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()

def main():
    html = fetch(URL)
    body = extract_text(html)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(body, encoding="utf-8")
    print(f"saved: {OUT} ({len(body)} chars)")

if __name__ == "__main__":
    main()
