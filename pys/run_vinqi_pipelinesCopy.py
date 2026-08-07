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
    
    # Specific e52 -> e23 mapping overrides
    if w == "wet":
        return "wxt"
    if w == "vet":
        return "wyet"
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
    if r == "cell":
        return "sll"
    if r == "cycle":
        return "saikxl"

    r = r.replace('ck', 'k')  
    r = r.replace('ch', 'C')  
    r = r.replace('cy', 'si') 
    r = r.replace('ce', 'se') 
    r = r.replace('ci', 'si') 
    r = r.replace('c', 'k')   
    r = r.replace('C', 'c')   
    return r


def process_t_character_section(r: str) -> str:
    if r.startswith("thr"):
        r = "Jr" + r[3:]
    return r


def process_g_character_section(r: str) -> str:
    if r == "ginger":
        return "zinzxr"
    if r == "gimcrack":
        return "zimkrxk"
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
    if r == "gif":
        return "gif"
    if r == "girl":
        return "grl"
    if r == "giant":
        return "zaent"
    
    if "weight" in r:
        r = r.replace("weight", "wext")
    if "wait" in r:
        r = r.replace("wait", "weyt")
    
    if r.endswith("ough"):
        r = r[:-4] + "f"
    
    r = r.replace('igh', 'ai')
    
    return r


def convert_e23_to_x38_day_by_day_engine(word: str) -> str:
    if not word:
        return ""
    
    w = str(word).lower().strip()

    TRUE_EW_ROOTS = ("new", "few", "view", "brew", "sew", "skew", "chew", "stew", "grew", "blew", "flew")

    def transform_root(root_str: str) -> str:
        if root_str in ("cell", "cycle"):
            return process_c_character_section(root_str)

        special_check = process_g_character_section(root_str)
        if special_check != root_str and root_str in ("ginger", "gimcrack", "giant", "girl", "gif", "eight", "wight", "white", "right", "wright", "rite", "write"):
            return special_check

        r = root_str
        
        r = process_c_character_section(r)
        r = process_t_character_section(r)
        
        if r.startswith("ewen"):
            r = "iwxn" + r[4:]
        elif r.startswith("ewent"):
            r = "iwxnt" + r[5:]
        else:
            if "ewer" in r and not any(r.startswith(true_ew) for true_ew in TRUE_EW_ROOTS):
                r = r.replace("ewer", "xwxr")
            r = r.replace('ew', 'iyu')
            
        r = r.replace('er', 'xr')
        r = process_g_character_section(r)
        
        return r

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

    for row in deduped_rows:
        token = row[e52_key]
        derived_e23 = convert_e52_to_e23(token)
        row["e23"] = derived_e23
        row["x38"] = convert_e23_to_x38_day_by_day_engine(derived_e23)

        keys_to_delete = [k for k in row.keys() if k not in headers]
        for k in keys_to_delete:
            del row[k]

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