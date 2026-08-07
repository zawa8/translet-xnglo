"""
e23 transliteration engine
Step 1 of the xnglo pipeline: English(52: A-Z, a-z) -> english(23 lowercase)

Rules:
- lowercase everything (no capitals, ever)
- w -> v
- j -> z
- q -> k
"""

SUBSTITUTIONS = {
    "w": "v",
    "j": "z",
    "q": "k",
}


def to_e23(text: str) -> str:
    """Convert standard English text to e23 (23-letter lowercase english)."""
    out = []
    for ch in text.lower():
        out.append(SUBSTITUTIONS.get(ch, ch))
    return "".join(out)


if __name__ == "__main__":
    tests = [
        ("Water", "vater"),
        ("Just", "zust"),
        ("Quick", "kuick"),
        ("HELLO World", "hello vorld"),
        ("jaw", "zav"),
    ]
    for src, expected in tests:
        got = to_e23(src)
        status = "OK" if got == expected else "MISMATCH"
        print(f"{src!r:15} -> {got!r:15} (expected {expected!r})  [{status}]")
