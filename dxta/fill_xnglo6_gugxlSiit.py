from collections import Counter
import os
import re
from google.transliteration import transliterate_text
import gspread
from google.oauth2.service_account import Credentials

# --- CHAR MAPS ---

# Hindi CHAR_MAP (Vinqi/Hindi -> Xnglo code)
HINDI_CHAR_MAP = {
    "क्ष": "S",
    "त्र": "jr",
    "ज्ञ": "gy",
    "अं": "xN",
    "अः": "x",
    "अ": "x",
    "आ": "xa",
    "ऑ": "ao",
    "इ": "_i",
    "ई": "_i",
    "उ": "_u",
    "ऊ": "_u",
    "ऋ": "ri",
    "ृ": "r",
    "ए": "_e",
    "ऐ": "_e",
    "ओ": "o",
    "औ": "ou",
    "ख": "K",
    "घ": "G",
    "ङ": "N",
    "ड़": "R",
    "ढ़": "R",
    "छ": "C",
    "झ": "Z",
    "ठ": "T",
    "ढ": "D",
    "थ": "J",
    "ध": "Q",
    "भ": "B",
    "श": "S",
    "क": "k",
    "ग": "g",
    "च": "c",
    "ज": "z",
    "ज़": "z",
    "ञ": "n",
    "ट": "t",
    "ड": "d",
    "ण": "n",
    "त": "j",
    "द": "q",
    "न": "n",
    "प": "p",
    "फ": "f",
    "ब": "b",
    "म": "m",
    "य": "y",
    "र": "r",
    "ल": "l",
    "व": "w",
    "ष": "s",
    "स": "s",
    "ह": "v",
    "ा": "a",
    "ॉ": "a",
    "ि": "i",
    "ी": "i",
    "ु": "u",
    "ू": "u",
    "े": "e",
    "ै": "xi",
    "ो": "o",
    "ौ": "ou",
    "ं": "N",
    "ः": "",
    "्": "",
    "ँ": "N",
    "़": "",
}

HINDI_KEYS_SORTED = sorted(HINDI_CHAR_MAP.keys(), key=len, reverse=True)

# English -> Semantic Meaning (vinqi)
ENGLISH_TO_VINQI_MEANING = {
    "apple": "सेब",
    "lower": "निचला",
    "lover": "प्रेमी",
    "newer": "नई",
    "never": "कभी नहीं",
    "west": "पश्चिम",
    "vest": "बनियान",
    "wine": "शराब",
    "vine": "बेल",
    "wary": "सावधान",
    "vary": "बदलना",
    "wet": "गीला",
    "vet": "पशु चिकित्सक",
}


def shift_unicode_block(text: str, offset: int) -> str:
  """Shifts unicode code points by a given offset."""
  if not text:
    return ""
  shifted_chars = []
  for char in str(text):
    code = ord(char)
    if (0x0900 <= code <= 0x097F) or (0x0A00 <= code <= 0x0A7F):
      shifted_chars.append(chr(code + offset))
    else:
      shifted_chars.append(char)
  return "".join(shifted_chars)


def generate_shifted_char_map(base_map: dict, offset: int) -> dict:
  """Automatically generates script CHAR_MAP by shifting character keys by the offset."""
  shifted_map = {}
  for k, v in base_map.items():
    s_key = shift_unicode_block(k, offset)
    shifted_map[s_key] = v
  return shifted_map


# Punjabi offset is +0x80 (Devanagari 0x0900 range -> Gurmukhi 0x0A00 range)
PUNJABI_CHAR_MAP = generate_shifted_char_map(HINDI_CHAR_MAP, 0x80)
PUNJABI_KEYS_SORTED = sorted(PUNJABI_CHAR_MAP.keys(), key=len, reverse=True)

# Gujarati offset is +0x80 from Punjabi/Gurmukhi (Gurmukhi 0x0A00 range -> Gujarati 0x0A80 range)
GUJARATI_CHAR_MAP = generate_shifted_char_map(PUNJABI_CHAR_MAP, 0x80)
GUJARATI_KEYS_SORTED = sorted(GUJARATI_CHAR_MAP.keys(), key=len, reverse=True)


def get_transliteration(text: str, lang_code: str = "hi") -> str:
  """Transliterates text into the target language script using Google API."""
  if not text:
    return ""
  try:
    clean_text = re.sub(r"_\d+$", "", str(text)).strip()
    result = transliterate_text(clean_text, lang_code=lang_code)
    if isinstance(result, list):
      return result[0] if result else clean_text
    return str(result)
  except Exception as e:
    print(f"Transliteration error for '{text}' ({lang_code}): {e}")
    return text


def get_hindi_translation(text: str, lang_code: str = "hi") -> str:
  """Translates/transliterates English text into Hindi using Google API."""
  if not text:
    return ""
  try:
    clean_text = re.sub(r"_\d+$", "", str(text)).strip()
    result = transliterate_text(clean_text, lang_code=lang_code)
    if isinstance(result, list):
      return result[0] if result else clean_text
    return str(result)
  except Exception as e:
    print(f"Hindi translation error for '{text}' ({lang_code}): {e}")
    return text


def script_to_xnglo(text: str, char_map: dict, sorted_keys: list) -> str:
  """Converts native script text to Xnglo code using specified char map."""
  if not text:
    return ""

  res_text = str(text)
  for key in sorted_keys:
    res_text = res_text.replace(key, char_map[key])

  res_text = re.sub(r"^_", "", res_text)
  res_text = re.sub(r"(\W)_", r"\1", res_text)
  res_text = re.sub(r"([aiueo])_", r"\1", res_text)
  res_text = res_text.replace("_i", "yi").replace("_e", "ye").replace("_u", "xu")

  res_text = re.sub(r"N$", "", res_text)
  res_text = re.sub(r"N(\W)", r"\1", res_text)
  res_text = res_text.replace("Nb", "mb").replace("NB", "mB").replace("Np", "mp").replace("Nf", "mf")
  res_text = re.sub(r"N(?![kKgG])", "n", res_text)

  return res_text


def transform_e52_to_e23(text: str) -> str:
  """Applies exact regex replacement rules to convert e52 strings into e23 values."""
  if not text:
    return ""
  val = str(text)
  val = val.replace("lover", "lwxr")
  val = val.replace("never", "nxwxr")
  val = val.replace("vest", "weist")
  val = val.replace("vine", "wayin")
  val = val.replace("vary", "wxyri")
  val = val.replace("vet", "wyt")
  val = val.replace("v", "w")
  val = val.replace("j", "z")
  val = val.replace("q", "k")
  return val


def process_and_fill_sheet(spreadsheet_id: str, new_words_list: list[str]):
  log_filename = "fill_xnglo6_gugxlSiit.log"
  local_tsv_filename = r"C:\Users\ravi_\OneDrive\Desktop\Vimal\wimxlprogs\xnglop\translet-xnglo\dxta\3k_local_copy.tsv"

  with open(log_filename, "w", encoding="utf-8") as log_file:
    def log_print(message=""):
      print(message)
      log_file.write(message + "\n")

    SCOPES = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(
        "credentials.json", scopes=SCOPES
    )
    client = gspread.authorize(creds)
    sheet = client.open_by_key(spreadsheet_id).worksheet("3k")
    all_rows = sheet.get_all_values()

    if not all_rows:
      log_print("Worksheet '3k' is empty.")
      return

    headers = [h.strip() for h in all_rows[0]]

    try:
      e52_col_idx = headers.index("e52")
      e23_col_idx = headers.index("e23")
      vinqi_col_idx = headers.index("vinqi")
      xv38_col_idx = headers.index("xv38")
      x38_col_idx = headers.index("x38")
      vinqi_fonetik_col_idx = headers.index("vinqi_fonetik")
      pnzabi_col_idx = headers.index("pnzabi")
      xp38_col_idx = headers.index("xp38")
      guzraji_col_idx = headers.index("guzraji")
      xg38_col_idx = headers.index("xg38")
    except ValueError as e:
      log_print(f"Required header missing: {e}. Current headers: {headers}")
      return

    existing_e52_words = set()
    for row in all_rows[1:]:
      if len(row) > e52_col_idx and row[e52_col_idx]:
        base_e52 = re.sub(r"_\d+$", "", row[e52_col_idx].lower().strip())
        existing_e52_words.add(base_e52)

    missing_words = [
        w.strip().lower()
        for w in new_words_list
        if w.strip().lower() and w.strip().lower() not in existing_e52_words
    ]

    if missing_words:
      sheet.add_rows(len(missing_words))

    # Re-fetch rows after adding new rows so all_rows length matches sheet state
    all_rows = sheet.get_all_values()

    e52_records = []
    for row in all_rows[1:]:
      e52_records.append(
          row[e52_col_idx].strip() if len(row) > e52_col_idx else ""
      )

    e52_base_counts = Counter(
        [re.sub(r"_\d+$", "", w.lower()) for w in e52_records if w]
    )
    e52_tracker = Counter()

    transformed_e23_list = []
    for w in e52_records:
      if w:
        clean_base = re.sub(r"_\d+$", "", w.lower())
        transformed_e23_list.append(transform_e52_to_e23(clean_base))
      else:
        transformed_e23_list.append("")

    e23_total_counts = Counter([val for val in transformed_e23_list if val])
    e23_tracker = Counter()

    updates = []

    for row_idx, e52_raw in enumerate(e52_records, start=2):
      if not e52_raw:
        continue

      clean_base_e52 = re.sub(r"_\d+$", "", e52_raw.lower())

      row_data = all_rows[row_idx - 1] if row_idx - 1 < len(all_rows) else []

      # 1. Fill vinqi (Meaning)
      existing_vinqi = (
          row_data[vinqi_col_idx].strip()
          if len(row_data) > vinqi_col_idx
          else ""
      )
      final_vinqi = (
          existing_vinqi
          if existing_vinqi
          else ENGLISH_TO_VINQI_MEANING.get(clean_base_e52, get_hindi_translation(clean_base_e52, lang_code="hi"))
      )

      # 2. Punjabi / Pnzabi handling (+0x80 offset from Hindi)
      existing_pnzabi = (
          row_data[pnzabi_col_idx].strip()
          if len(row_data) > pnzabi_col_idx
          else ""
      )
      final_pnzabi = (
          existing_pnzabi
          if existing_pnzabi
          else shift_unicode_block(final_vinqi, 0x80)
      )

      # 3. Gujarati / Guzraji handling (+0x80 offset from Punjabi/Gurmukhi)
      existing_guzraji = (
          row_data[guzraji_col_idx].strip()
          if len(row_data) > guzraji_col_idx
          else ""
      )
      final_guzraji = (
          existing_guzraji
          if existing_guzraji
          else shift_unicode_block(final_pnzabi, 0x80)
      )

      # Handle homonyms in e52
      if e52_base_counts[clean_base_e52] > 1:
        e52_tracker[clean_base_e52] += 1
        final_e52 = f"{clean_base_e52}_{e52_tracker[clean_base_e52]}"
      else:
        final_e52 = clean_base_e52

      # Convert e52 -> e23
      base_e23 = transform_e52_to_e23(clean_base_e52)
      if e23_total_counts[base_e23] > 1:
        e23_tracker[base_e23] += 1
        final_e23 = f"{base_e23}_{e23_tracker[base_e23]}"
      else:
        final_e23 = base_e23

      # Hindi mappings (respecting existing vinqi_fonetik)
      existing_vinqi_fonetik = (
          row_data[vinqi_fonetik_col_idx].strip()
          if len(row_data) > vinqi_fonetik_col_idx
          else ""
      )
      final_vinqi_fonetik = (
          existing_vinqi_fonetik
          if existing_vinqi_fonetik
          else get_transliteration(final_e52, lang_code="hi")
      )

      final_xv38 = script_to_xnglo(
          final_vinqi, HINDI_CHAR_MAP, HINDI_KEYS_SORTED
      )
      final_x38 = script_to_xnglo(
          final_vinqi_fonetik, HINDI_CHAR_MAP, HINDI_KEYS_SORTED
      )

      # Punjabi mapping
      final_xp38 = script_to_xnglo(
          final_pnzabi, PUNJABI_CHAR_MAP, PUNJABI_KEYS_SORTED
      )

      # Gujarati mapping
      final_xg38 = script_to_xnglo(
          final_guzraji, GUJARATI_CHAR_MAP, GUJARATI_KEYS_SORTED
      )

      log_print(
          f"Row {row_idx}: e52={final_e52} | vinqi={final_vinqi} | "
          f"pnzabi={final_pnzabi} | guzraji={final_guzraji} | xg38={final_xg38}"
      )

      updates.extend([
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, e52_col_idx + 1),
              "values": [[final_e52]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, e23_col_idx + 1),
              "values": [[final_e23]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, vinqi_col_idx + 1),
              "values": [[final_vinqi]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, xv38_col_idx + 1),
              "values": [[final_xv38]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, x38_col_idx + 1),
              "values": [[final_x38]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(
                  row_idx, vinqi_fonetik_col_idx + 1
              ),
              "values": [[final_vinqi_fonetik]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, pnzabi_col_idx + 1),
              "values": [[final_pnzabi]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, xp38_col_idx + 1),
              "values": [[final_xp38]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, guzraji_col_idx + 1),
              "values": [[final_guzraji]],
          },
          {
              "range": gspread.utils.rowcol_to_a1(row_idx, xg38_col_idx + 1),
              "values": [[final_xg38]],
          },
      ])

      # Also update in-memory `all_rows` so the local file copy gets the fully computed values
      row_dict = {
          e52_col_idx: final_e52,
          e23_col_idx: final_e23,
          vinqi_col_idx: final_vinqi,
          xv38_col_idx: final_xv38,
          x38_col_idx: final_x38,
          vinqi_fonetik_col_idx: final_vinqi_fonetik,
          pnzabi_col_idx: final_pnzabi,
          xp38_col_idx: final_xp38,
          guzraji_col_idx: final_guzraji,
          xg38_col_idx: final_xg38,
      }
      for col_idx, val in row_dict.items():
        while len(row_data) <= col_idx:
          row_data.append("")
        row_data[col_idx] = val
      all_rows[row_idx - 1] = row_data

    sheet.batch_update(updates)
    log_print(
        "\nSuccessfully processed sheet columns including Punjabi (+0x80) and "
        "Gujarati (+0x80 from Punjabi) offsets with full API integrations."
    )

    # Save the updated sheet data locally as a TSV file in the requested directory
    os.makedirs(os.path.dirname(local_tsv_filename), exist_ok=True)
    with open(local_tsv_filename, "w", encoding="utf-8") as tsv_file:
      for r in all_rows:
        tsv_file.write("\t".join(str(cell) for cell in r) + "\n")

    log_print(f"Local sheet copy saved successfully to {local_tsv_filename}")
    print(f"Log saved successfully to {log_filename}")


if __name__ == "__main__":
  SPREADSHEET_ID = "14txKWvu5ow2jIbAWO_cttg96zR8hhu48TTRXqsCRnxc"
  WORDS_TO_ADD = []
  process_and_fill_sheet(SPREADSHEET_ID, WORDS_TO_ADD)