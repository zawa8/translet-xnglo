import csv
import os

DATA_DIR = os.path.join("..", "dxta")
DATA_FILE = os.path.join(DATA_DIR, "ehd_clean.csv")

EVE_BASE_PREFIXES = (
    "eve", "even", "event", "ever", "every", 
    "uneven", "uneventful", "whatever", "whenever", 
    "wherever", "whichever", "whoever", "whomever", "whatsoever"
)
X38_PREFIX_MAP = { "un": "xn", "re": "ri", "in": "in", "dis": "dis" }


def convert_e52_to_e23(word: str) -> str:
    if not word:
        return ""
    
    w = str(word).lower().strip()
    
    if w == "never":
        return "nxwxr"

    is_base_eve = any(w.startswith(prefix) for prefix in EVE_BASE_PREFIXES)

    if is_base_eve:
        prefix_len = 3 if w.startswith("eve") else 0
        if prefix_len:
            w = w[:prefix_len] + w[prefix_len:].replace("eve", "xwx")
    else:
        w = w.replace("eve", "xwx")

    w = w.replace('j', 'z').replace('q', 'k').replace('v', 'w')    
    return w
    
def process_c_character_section(r: str) -> str:
    # ==========================================
    # LAYER 3: HARD CONSONANT CLUSTERS & COMPLEX C BEHAVIORS
    # ==========================================
    r = r.replace('ck', 'k')  # Enforce sound compaction (e.g., back -> bak)
    r = r.replace('ch', 'C')  # Temporary capital protection token lock
    r = r.replace('cy', 'si') # Soft 'c' variation mapping
    r = r.replace('ce', 'se') # Soft 'c' variation mapping
    r = r.replace('ci', 'si') # Soft 'c' variation mapping
    r = r.replace('c', 'k')   # All remaining standard lowercase c become hard k
    r = r.replace('C', 'c')   # Release protected token back safely to lowercase c
    return r

def process_g_character_section(r: str) -> str:
    """
    Dedicated function for character section rules:
    - weight -> wext
    - wait -> weyt
    - wet -> wyt
    - vet -> wxt
    - wight -> waiht
    - white -> whait
    - right -> rait
    - wright -> rayiit
    - rite -> rayitx
    - write -> rayit
    - eight -> eet
    - igh -> ai
    """
    # Exact word rules
    if r == "eight":
        return "eet"
    if r == "wight":
        return "waiht"
    if r == "white":
        return "whait"
    if r == "right":
        return "rait"
    if r == "wright":
        return "rayiit"
    if r == "rite":
        return "rayitx"
    if r == "write":
        return "rayit"
    
    # Substring / root replacements
    if "weight" in r:
        r = r.replace("weight", "wext")
    if "wait" in r:
        r = r.replace("wait", "weyt")
    
    if r == "wet":
        r = "wyt"
    elif "wet" in r:
        r = r.replace("wet", "wyt")
    
    # General igh -> ai conversion
    r = r.replace('igh', 'ai')
    
    return r


def convert_e23_to_x38_day_by_day_engine(word: str) -> str:
    """
    Pipeline 3 Engine - Morphological Prefix & Root Layer:
    """
    if not word:
        return ""
    
    w = str(word).lower().strip()

    TRUE_EW_ROOTS = ("new", "few", "view", "brew", "sew", "skew", "chew", "stew", "grew", "blew", "flew")

    def transform_root(root_str: str) -> str:
        r = root_str
        
        # Rule 1: ck -> k
        r = process_c_character_section(r)
        
        # Rule 2: Root-level protections for 'ewen' / 'ewent'
        if r.startswith("ewen"):
            r = "iwxn" + r[4:]
        elif r.startswith("ewent"):
            r = "iwxnt" + r[5:]
        else:
            # Rule 2b: '-ewer' family suffix check
            if "ewer" in r and not any(r.startswith(true_ew) for true_ew in TRUE_EW_ROOTS):
                r = r.replace("ewer", "xwxr")
            
            # Rule 2c: Standard 'ew' vowel shift
            r = r.replace('ew', 'iyu')
            
        # Rule 3: er -> xr
        r = r.replace('er', 'xr')
        
        # Rule 4: Apply character section specific rules
        r = process_g_character_section(r)
        
        return r

    # Check for prefix decomposition (un-, re-, in-, dis-)
    for prefix, x38_prefix in X38_PREFIX_MAP.items():
        if w.startswith(prefix) and len(w) > len(prefix):
            root_part = w[len(prefix):]
            if root_part.startswith("ewen") or root_part.startswith("ewent"):
                return x38_prefix + transform_root(root_part)

    return transform_root(w)


def run_day1_pipeline_updates():
    if not os.path.exists(DATA_FILE):
        print(f"[error] target file missing at: {os.path.abspath(DATA_FILE)}")
        return
    
    print("=== startiNg paiplain xpdets wiQ kstxm prefiks mxp ===")
    
    # Read phase
    try:
        with open(DATA_FILE, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            headers = list(reader.fieldnames or [])
            rows = list(reader)
    except Exception as e:
        print(f"[error] failed to read csv file: {e}")
        return

    print(f" -> read {len(rows)} raw rows.")

    e52_key = next((h for h in headers if h.strip().lower() == "e52"), None)
    
    if not e52_key:
        print("[error] could not locate an e52/e52 column in csv header.")
        return

    for key in ["e23", "x38"]:
        if key not in headers:
            headers.append(key)

    # Deduplication Phase
    seen_e52 = set()
    deduped_rows = []
    duplicates_removed = 0

    for row in rows:
        val = row.get(e52_key, "").strip().upper()
        
        if not val:
            continue
            
        if val in seen_e52:
            duplicates_removed += 1
        else:
            seen_e52.add(val)
            row[e52_key] = val
            deduped_rows.append(row)

    print(f" -> Removed {duplicates_removed} duplicate entries.")
    print(f" -> Processing {len(deduped_rows)} unique rows...")

    # Conversion Phase
    for row in deduped_rows:
        token = row[e52_key]
        
        # Step 1: E52 -> E23
        derived_e23 = convert_e52_to_e23(token)
        row["e23"] = derived_e23
        
        # Step 2: E23 -> X38
        row["x38"] = convert_e23_to_x38_day_by_day_engine(derived_e23)

        # Cleanup extra keys
        keys_to_delete = [k for k in row.keys() if k not in headers]
        for k in keys_to_delete:
            del row[k]

    # Safe Temp Write Phase
    temp_file = DATA_FILE + ".tmp"
    try:
        with open(temp_file, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(deduped_rows)
            
        os.replace(temp_file, DATA_FILE)
        print(f"\n[SUCCESS] Updated {len(deduped_rows)} rows cleanly in {DATA_FILE}!")
    except Exception as e:
        print(f"[Error] Failed to write back to CSV file: {e}")
        if os.path.exists(temp_file):
            os.remove(temp_file)


if __name__ == "__main__":
    run_day1_pipeline_updates()