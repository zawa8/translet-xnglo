from collections import Counter
import re
from google.transliteration import transliterate_text
import gspread
from google.oauth2.service_account import Credentials

# Custom Xnglo CHAR_MAP (Vinqi/Hindi -> Xnglo code)
CHAR_MAP = {
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

KEYS_SORTED = sorted(CHAR_MAP.keys(), key=len, reverse=True)

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


def get_transliteration(text: str, lang_code: str = "hi") -> str:
  """transliterates text into the target language script using google api."""
  if not text:
    return ""
  try:
    clean_text = re.sub(r"_\d+$", "", str(text)).strip()
    result = transliterate_text(clean_text, lang_code=lang_code)
    if isinstance(result, list):
      return result[0] if result else clean_text
    return str(result)
  except Exception as e:
    print(f"Transliteration error for '{text}': {e}")
    return text


def hindi_to_xnglo(hindi_text: str) -> str:
  """converts hindi text to xnglo code using char_map. अबैंडन अबेनडन"""
  if not hindi_text:
    return ""

  text = str(hindi_text)
  for key in KEYS_SORTED:
    text = text.replace(key, CHAR_MAP[key])

  text = re.sub(r"^_", "", text)
  text = re.sub(r"(\W)_", r"\1", text)
  text = re.sub(r"([aiueo])_", r"\1", text)
  text = text.replace("_i", "yi").replace("_e", "ye").replace("_u", "xu")

  text = re.sub(r"N$", "", text)
  text = re.sub(r"N(\W)", r"\1", text)
  text = text.replace("Nb", "mb").replace("NB", "mB").replace("Np", "mp").replace("Nf", "mf")
  text = re.sub(r"N(?![kKgG])", "n", text)

  return text


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
  with open(log_filename, "w", encoding="utf-8") as log_file:
    def log_print(message=""):
      print(message)
      log_file.write(message + "\n")
    SCOPES = [ "https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive", ]
    creds = Credentials.from_service_account_file( "credentials.json", scopes=SCOPES )
    client = gspread.authorize(creds)
    sheet = client.open_by_key(spreadsheet_id).worksheet("3k")
    all_rows = sheet.get_all_values()
    if not all_rows:
      log_print("worksheet '3k' is empty.")
      return
    headers = [h.strip() for h in all_rows[0]]
    try:
      e52_col_idx = headers.index("e52")
      e23_col_idx = headers.index("e23")
      vinqi_col_idx = headers.index("vinqi")
      xv38_col_idx = headers.index("xv38")
      x38_col_idx = headers.index("x38")
      vinqi_fonetik_col_idx = headers.index("vinqi_fonetik")
    except ValueError as e:
      log_print(f"required header missing: {e}. current headers: {headers}")
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

    # Pre-calculate base frequencies for e52 duplicates
    e52_base_counts = Counter(
        [re.sub(r"_\d+$", "", w.lower()) for w in e52_records if w]
    )
    e52_tracker = Counter()

    # First pass: map every e52 record to its transformed e23 base value
    transformed_e23_list = []
    for w in e52_records:
      if w:
        clean_base = re.sub(r"_\d+$", "", w.lower())
        transformed_e23_list.append(transform_e52_to_e23(clean_base))
      else:
        transformed_e23_list.append("")

    # Count exact frequencies of each transformed e23 value globally
    e23_total_counts = Counter([val for val in transformed_e23_list if val])
    e23_tracker = Counter()

    # log_print("\n--- [LOG FILE] Global Frequencies for '*wx*' Entries ---")
    # for val, count in e23_total_counts.items():
      # if "wx" in val:
        # log_print(f"E23 Match -> '{val}': appears {count} times")
    # log_print(
        # "-----------------------------------------------------------\n"
    # )

    updates = []

    for row_idx, e52_raw in enumerate(e52_records, start=2):
      if not e52_raw:
        continue

      clean_base_e52 = re.sub(r"_\d+$", "", e52_raw.lower())

      # Fill vinqi (Meaning)
      existing_vinqi = ""
      if row_idx - 2 < len(all_rows) - 1:
        row_data = all_rows[row_idx - 1]
        existing_vinqi = (
            row_data[vinqi_col_idx].strip()
            if len(row_data) > vinqi_col_idx
            else ""
        )

      final_vinqi = (
          existing_vinqi
          if existing_vinqi
          else ENGLISH_TO_VINQI_MEANING.get(clean_base_e52, clean_base_e52)
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
        # if "wx" in base_e23:
          # log_print(
              # f"[LOG *wx*] Row {row_idx}: e52='{e52_raw}' ->"
              # f" base_e23='{base_e23}' (Count:"
              # f" {e23_total_counts[base_e23]}). Assigned: '{final_e23}'"
          # )
      else:
        final_e23 = base_e23
        # if "wx" in base_e23:
          # log_print(
              # f"[LOG *wx*] Row {row_idx}: e52='{e52_raw}' ->"
              # f" base_e23='{base_e23}' (Unique). Assigned: '{final_e23}'"
          # )

      # Convert vinqi -> xv38
      final_xv38 = hindi_to_xnglo(final_vinqi)

      # x38 mapping
      # final_x38 = hindi_to_xnglo(final_vinqi)

      # Fill vinqi_fonetik column using google.transliteration package
      final_vinqi_fonetik = get_transliteration(final_e52, lang_code="hi")
      log_print(
              f"final_e52 is {final_e52} and final_vinqi_fonetik is {final_vinqi_fonetik}"
          )
      final_x38 = hindi_to_xnglo(final_vinqi_fonetik)

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
      ])

    sheet.batch_update(updates)
    log_print(
        "\nSuccessfully processed 6-column sheet structure with Google API"
        " transliteration."
    )
    print(f"Log saved successfully to {log_filename}")


if __name__ == "__main__":
  SPREADSHEET_ID = "14txKWvu5ow2jIbAWO_cttg96zR8hhu48TTRXqsCRnxc"
  WORDS_TO_ADD = [
      # "apple",
      # "lower",
      # "lover",
      # "newer",
      # "never",
      # "west",
      # "vest",
      # "wine",
      # "vine",
      # "wary",
      # "vary",
      # "wet",
      # "vet",
  ]
  process_and_fill_sheet(SPREADSHEET_ID, WORDS_TO_ADD)