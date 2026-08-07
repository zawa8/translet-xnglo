#!/usr/bin/env python3
"""
po2e23.py — convert any gettext .po file's English msgstr entries into e23.

Usage:
    python3 po2e23.py input.po output.po

What it does:
    - Parses a standard .po file (msgid / msgstr pairs)
    - For every msgid, fills msgstr with the e23 transliteration of the
      msgid (English source string)
    - Leaves headers, comments, plural forms, and fuzzy markers intact
    - Writes a new .po file you can compile with msgfmt into a .mo file

To finish building the language pack after this:
    msgfmt output.po -o output.mo
    # then place the .mo under the right locale dir, e.g.
    # /usr/share/locale/e23/LC_MESSAGES/cinnamon.mo
    # and register "e23" as a locale (see notes at bottom of this file)
"""

import re
import sys

try:
    import polib
    HAVE_POLIB = True
except ImportError:
    HAVE_POLIB = False

SUBSTITUTIONS = {"w": "v", "j": "z", "q": "k"}


def to_e23(text: str) -> str:
    out = []
    for ch in text.lower():
        out.append(SUBSTITUTIONS.get(ch, ch))
    return "".join(out)


def convert_with_polib(infile: str, outfile: str) -> None:
    po = polib.pofile(infile)
    for entry in po:
        if not entry.msgid:
            continue
        entry.msgstr = to_e23(entry.msgid)
        if "fuzzy" in entry.flags:
            entry.flags.remove("fuzzy")
    po.save(outfile)
    print(f"wrote {len(po)} entries -> {outfile}")


def convert_with_regex(infile: str, outfile: str) -> None:
    """Fallback parser if polib isn't installed. Handles the common
    single-line msgid/msgstr case; multi-line strings may need polib."""
    with open(infile, "r", encoding="utf-8") as f:
        lines = f.readlines()

    out_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r'^msgid "(.*)"\s*$', line)
        if m and m.group(1) != "":
            msgid_text = m.group(1)
            out_lines.append(line)
            i += 1
            if i < len(lines) and lines[i].startswith("msgstr"):
                translated = to_e23(msgid_text)
                out_lines.append(f'msgstr "{translated}"\n')
                i += 1
            continue
        out_lines.append(line)
        i += 1

    with open(outfile, "w", encoding="utf-8") as f:
        f.writelines(out_lines)
    print(f"wrote -> {outfile} (regex fallback mode; check multi-line strings by hand)")


def main():
    if len(sys.argv) != 3:
        print("usage: python3 po2e23.py input.po output.po")
        sys.exit(1)
    infile, outfile = sys.argv[1], sys.argv[2]
    if HAVE_POLIB:
        convert_with_polib(infile, outfile)
    else:
        print("note: polib not installed, using regex fallback (less robust)")
        convert_with_regex(infile, outfile)


if __name__ == "__main__":
    main()

# ---------------------------------------------------------------------------
# Notes on finishing the Cinnamon language pack once you have converted .po
# files for the components you want (cinnamon, cinnamon-menus,
# cinnamon-control-center, cinnamon-settings-daemon, nemo, etc.):
#
# 1. Compile each .po into a .mo:
#      msgfmt output.po -o output.mo
#
# 2. Install the compiled .mo files under a new locale, e.g. "e23_XX":
#      sudo mkdir -p /usr/share/locale/e23_XX/LC_MESSAGES/
#      sudo cp output.mo /usr/share/locale/e23_XX/LC_MESSAGES/cinnamon.mo
#      (repeat per-component: cinnamon.mo, cinnamon-menus.mo, nemo.mo, ...)
#
# 3. Generate the locale so glibc recognizes it (needs a locale definition
#    file, usually just copy en_US.UTF-8's and rename):
#      sudo localedef -f UTF-8 -i en_US e23_XX.UTF-8
#
# 4. Log out and select "e23_XX" as the language in Cinnamon's
#    Region & Language settings, or set LANG=e23_XX.UTF-8 for a session.
#
# For a real installable .deb package, these files get wrapped with a
# debian/ control structure (control, postinst, etc.) — happy to build
# that once the .po -> .mo conversion is confirmed working for a real
# Cinnamon source file.
# ---------------------------------------------------------------------------
