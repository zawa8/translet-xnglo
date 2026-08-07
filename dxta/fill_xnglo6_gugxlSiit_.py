import re
import gspread
from collections import Counter
from google.oauth2.service_account import Credentials

# Custom Xnglo CHAR_MAP (Vinqi/Hindi -> Xnglo code)
CHAR_MAP = {
    'क्ष': 'S', 'त्र': 'jr', 'ज्ञ': 'gy', 'अं': 'xN', 'अः': 'x', 'अ': 'x',
    'आ': 'xa', 'ऑ': 'ao', 'इ': '_i', 'ई': '_i', 'उ': '_u', 'ऊ': '_u', 'ऋ': 'ri', 'ृ': 'r',
    'ए': '_e', 'ऐ': '_e', 'ओ': 'o', 'औ': 'ou', 'ख': 'K', 'घ': 'G',
    'ङ': 'N', 'ड़': 'R', 'ढ़': 'R', 'छ': 'C', 'झ': 'Z', 'ठ': 'T', 'ढ': 'D', 'थ': 'J',
    'ध': 'Q', 'भ': 'B', 'श': 'S', 'क': 'k', 'ग': 'g', 'च': 'c',
    'ज': 'z', 'ज़': 'z', 'ञ': 'n', 'ट': 't', 'ड': 'd', 'ण': 'n', 'त': 'j',
    'द': 'q', 'न': 'n', 'प': 'p', 'फ': 'f', 'ब': 'b', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'w', 'ष': 's', 'स': 's',
    'ह': 'v', 'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
    'े': 'e', 'ै': 'xi', 'ो': 'o', 'ौ': 'ou', 'ं': 'N', 'ः': '', '्': '', 'ँ': 'N', '़': ''
}

KEYS_SORTED = sorted(CHAR_MAP.keys(), key=len, reverse=True)

# Custom manual overrides for precise phonetic spellings
MANUAL_FONETIK_OVERRIDES = {
    "youth": "यूथ",
    "zone": "ज़ोन",
    "your": "योर",
    "yours": "योर्स",
    "yourself": "योरसैल्फ़",
    "apple": "ऐप्पल",
    "lower": "लोवर",
    "lover": "लवर",
    "newer": "न्यूअर",
    "never": "नेवर",
    "west": "वेस्ट",
    "vest": "वेस्ट",
    "wine": "वाइन",
    "vine": "वाइन",
    "wary": "वैरी",
    "vary": "वैरी",
    "wet": "वेट",
    "vet": "वेट"
}

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
    "vet": "पशु चिकित्सक"
}

def get_phonetic_hindi(word: str) -> str:
    """Instant offline phonetic mapping fallback."""
    clean = word.lower().strip()
    if clean in MANUAL_FONETIK_OVERRIDES:
        return MANUAL_FONETIK_OVERRIDES[clean]
    
    # Simple algorithmic offline approximation for common English letters to Hindi phonetic
    trans_map = {
        'a': 'ा', 'b': 'ब', 'c': 'क', 'd': 'ड', 'e': 'े', 'f': 'फ', 'g': 'ग',
        'h': 'ह', 'i': 'ि', 'j': 'ज', 'k': 'क', 'l': 'ल', 'm': 'म', 'n': 'न',
        'o': 'ो', 'p': 'प', 'q': 'क्यू', 'r': 'र', 's': 'स', 't': 'ट', 'u': 'ु',
        'v': 'व', 'w': 'डब्लू', 'x': 'क्स', 'y': 'य', 'z': 'ज़'
    }
    
    result = []
    for char in clean:
        result.append(trans_map.get(char, char))
    return "".join(result)

def hindi_to_xnglo(hindi_text: str) -> str:
    """Converts Hindi (Vinqi / Vinqi_Fonetik) text to Xnglo code using CHAR_MAP."""
    if not hindi_text:
        return ""
    
    text = hindi_text
    for key in KEYS_SORTED:
        text = text.replace(key, CHAR_MAP[key])
    
    text = re.sub(r'^_', '', text)
    text = re.sub(r'(\W)_', r'\1', text)
    text = text.replace('_i', 'yi').replace('_e', 'ye').replace('_u', 'xu')
    
    text = re.sub(r'N$', '', text)
    text = re.sub(r'N(\W)', r'\1', text)
    text = text.replace('Nb', 'mb').replace('NB', 'mB')
    text = re.sub(r'N(?![kKgG])', 'n', text)
    
    return text

def process_and_fill_sheet(spreadsheet_id: str, new_words_list: list[str]):
    SCOPES = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"
    ]
    creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
    client = gspread.authorize(creds)
    
    sheet = client.open_by_key(spreadsheet_id).worksheet("3k")
    all_rows = sheet.get_all_values()
    
    if not all_rows:
        print("Worksheet '3k' is empty.")
        return
    
    headers = [h.strip() for h in all_rows[0]]

    try:
        e52_col_idx = headers.index('e52')
        e23_col_idx = headers.index('e23')
        vinqi_col_idx = headers.index('vinqi')
        xv38_col_idx = headers.index('xv38')
        vinqi_fonetik_col_idx = headers.index('vinqi_fonetik')
        x38_col_idx = headers.index('x38')
    except ValueError as e:
        print(f"Required header missing: {e}. Current headers: {headers}")
        return

    # STEP 1: Read e52 cell and identify existing vs missing words
    existing_e52_words = set()
    for row in all_rows[1:]:
        if len(row) > e52_col_idx and row[e52_col_idx]:
            base_e52 = re.sub(r'_\d+$', '', row[e52_col_idx].lower().strip())
            existing_e52_words.add(base_e52)

    missing_words = [w.strip().lower() for w in new_words_list if w.strip().lower() and w.strip().lower() not in existing_e52_words]

    if missing_words:
        sheet.add_rows(len(missing_words))

    e52_records = []
    for row in all_rows[1:]:
        e52_records.append(row[e52_col_idx].strip() if len(row) > e52_col_idx else "")
    for word in missing_words:
        e52_records.append(word)

    e52_base_counts = Counter([re.sub(r'_\d+$', '', w.lower()) for w in e52_records if w])
    e52_tracker = Counter()

    e23_base_counts = Counter()
    for w in e52_records:
        if w:
            clean_base = re.sub(r'_\d+$', '', w.lower())
            e23_base = clean_base.replace('v', 'w').replace('j', 'z').replace('q', 'k')
            e23_base_counts[e23_base] += 1
    e23_tracker = Counter()

    updates = []
    
    for row_idx, e52_raw in enumerate(e52_records, start=2):
        if not e52_raw:
            continue

        clean_base_e52 = re.sub(r'_\d+$', '', e52_raw.lower())

        # STEP 2: Fill vinqi (Meaning)
        existing_vinqi = ""
        if row_idx - 2 < len(all_rows) - 1:
            row_data = all_rows[row_idx - 1]
            existing_vinqi = row_data[vinqi_col_idx].strip() if len(row_data) > vinqi_col_idx else ""
        
        final_vinqi = existing_vinqi if existing_vinqi else ENGLISH_TO_VINQI_MEANING.get(clean_base_e52, clean_base_e52)

        # STEP 3: Fill vinqi_fonetik
        existing_fonetik = ""
        if row_idx - 2 < len(all_rows) - 1:
            row_data = all_rows[row_idx - 1]
            existing_fonetik = row_data[vinqi_fonetik_col_idx].strip() if len(row_data) > vinqi_fonetik_col_idx else ""

        if not existing_fonetik or re.match(r'^[a-zA-Z0-9_\s]+$', existing_fonetik):
            final_vinqi_fonetik = get_phonetic_hindi(clean_base_e52)
        else:
            final_vinqi_fonetik = existing_fonetik

        # STEP 4: Check for duplicate Homonyms in e52
        if e52_base_counts[clean_base_e52] > 1:
            e52_tracker[clean_base_e52] += 1
            final_e52 = f"{clean_base_e52}_{e52_tracker[clean_base_e52]}"
        else:
            final_e52 = clean_base_e52

        # STEP 5: Convert e52 -> e23
        base_e23 = clean_base_e52.replace('v', 'w').replace('j', 'z').replace('q', 'k')
        if e23_base_counts[base_e23] > 1:
            e23_tracker[base_e23] += 1
            final_e23 = f"{base_e23}_{e23_tracker[base_e23]}"
        else:
            final_e23 = base_e23

        # STEP 6: Convert vinqi -> xv38
        final_xv38 = hindi_to_xnglo(final_vinqi)

        # STEP 7: Convert vinqi_fonetik -> x38
        final_x38 = hindi_to_xnglo(final_vinqi_fonetik)

        # STEP 8: Prepare batch cell updates
        updates.extend([
            {'range': gspread.utils.rowcol_to_a1(row_idx, e52_col_idx + 1), 'values': [[final_e52]]},
            {'range': gspread.utils.rowcol_to_a1(row_idx, e23_col_idx + 1), 'values': [[final_e23]]},
            {'range': gspread.utils.rowcol_to_a1(row_idx, vinqi_col_idx + 1), 'values': [[final_vinqi]]},
            {'range': gspread.utils.rowcol_to_a1(row_idx, xv38_col_idx + 1), 'values': [[final_xv38]]},
            {'range': gspread.utils.rowcol_to_a1(row_idx, vinqi_fonetik_col_idx + 1), 'values': [[final_vinqi_fonetik]]},
            {'range': gspread.utils.rowcol_to_a1(row_idx, x38_col_idx + 1), 'values': [[final_x38]]}
        ])

    sheet.batch_update(updates)
    print("Successfully populated vinqi_fonetik and x38 columns instantly offline.")

if __name__ == "__main__":
    SPREADSHEET_ID = "14txKWvu5ow2jIbAWO_cttg96zR8hhu48TTRXqsCRnxc"
    WORDS_TO_ADD = [
        "apple", "lower", "lover", "newer", "never", "west", "vest", 
        "wine", "vine", "wary", "vary", "wet", "vet"
    ]
    process_and_fill_sheet(SPREADSHEET_ID, WORDS_TO_ADD)