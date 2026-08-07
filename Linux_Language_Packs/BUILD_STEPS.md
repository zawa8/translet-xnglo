# e23 Cinnamon Language Pack — Build Steps

Scripts in this folder:
- `e23.py` — core transliteration engine (English 52 -> e23, 23 lowercase letters)
- `po2e23.py` — converts a Cinnamon `.po` translation file into e23

## Steps

1. Find a Cinnamon `.po` file (e.g. from `/usr/share/locale/en/LC_MESSAGES/` on
   Linux Mint, or from the `linuxmint/cinnamon` GitHub repo's `po/` folder).

2. Run the conversion script:
   ```
   python3 po2e23.py input.po output.po
   ```

3. Compile the converted `.po` into a `.mo`:
   ```
   msgfmt output.po -o output.mo
   ```

4. Install the compiled `.mo` under a new locale:
   ```
   sudo mkdir -p /usr/share/locale/e23_XX/LC_MESSAGES/
   sudo cp output.mo /usr/share/locale/e23_XX/LC_MESSAGES/cinnamon.mo
   ```
   (repeat per component: `cinnamon.mo`, `cinnamon-menus.mo`, `nemo.mo`, etc.)

5. Generate the locale so glibc recognizes it:
   ```
   sudo localedef -f UTF-8 -i en_US e23_XX.UTF-8
   ```

6. Log out and select `e23_XX` in Cinnamon's Region & Language settings,
   or set `LANG=e23_XX.UTF-8` for a session.

## Notes

- `polib` wasn't available in the build environment, so `po2e23.py` falls
  back to a regex-based parser. It handles standard single-line
  `msgid`/`msgstr` pairs correctly; multi-line strings should be
  spot-checked by hand.
- Packaging this as an installable `.deb` (with a `debian/` control
  structure) is a follow-up step once the `.po -> .mo` conversion is
  confirmed against a real Cinnamon source file.
